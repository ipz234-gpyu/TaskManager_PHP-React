<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Helpers\TokenHelper;
use App\Helpers\UrlHelper;
use App\Models\UserModel;
use App\Models\UserRefreshTokenModel;
use Ramsey\Uuid\Uuid;

class AuthController extends Controller
{
    public array $middlewares = [
        'actionChangeEmail' => ['auth'],
        'actionChangePassword' => ['auth'],
        'actionDeleteAccount' => ['auth'],
        'actionUploadAvatar' => ['auth'],
    ];

    public function actionRegister()
    {
        $data = Request::json();

        $name = trim($data['name'] ?? '');
        $surname = trim($data['surname'] ?? '');
        $email = strtolower(trim($data['email'] ?? ''));
        $password = $data['password'] ?? '';

        if (!$name || !$email || !$password) {
            return $this->json(['message' => 'All required fields must be filled in'], 422);
        }

        $userModel = new UserModel();
        if ($userModel->findByEmail($email)) {
            return $this->json(['message' => 'The user already exists'], 409);
        }

        $salt = bin2hex(random_bytes(16));
        $hashedPassword = password_hash($password . $salt, PASSWORD_BCRYPT);
        $userId = Uuid::uuid4()->toString();

        $created = $userModel->create([
            'id' => $userId,
            'name' => $name,
            'surname' => $surname,
            'email' => $email,
            'password' => $hashedPassword,
            'salt' => $salt
        ]);

        if (!$created) {
            return $this->json(['message' => 'Could not create a user'], 500);
        }

        return $this->json($this->generateTokensAndSave($userId));
    }

    public function actionLogin()
    {
        $data = Request::json();
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (!$email || !$password) {
            return $this->json(['message' => 'Email and password required'], 422);
        }

        $userModel = new UserModel();
        $user = $userModel->findByEmail($email);

        if (!$user || !password_verify($password . $user['salt'], $user['password'])) {
            return $this->json(['message' => 'Incorrect email or password'], 401);
        }

        return $this->json($this->generateTokensAndSave($user['id']));
    }

    public function actionRefresh()
    {
        $data = Request::json();
        $refreshToken = $data['refreshToken'] ?? '';

        if (!$refreshToken) {
            return $this->json(['message' => 'Refresh token is required'], 422);
        }

        $hash = TokenHelper::hashRefreshToken($refreshToken);
        $model = new UserRefreshTokenModel();
        $record = $model->findByTokenHash($hash);

        if (!$record) {
            return $this->json(['error' => 'INVALID_TOKEN'], 401);
        }

        if (strtotime($record['expires_at']) < time()) {
            $model->deleteByTokenHash($hash);
            return $this->json(['message' => 'Refresh token is expired'], 401);
        }

        $accessToken = TokenHelper::generateAccessToken(['id' => $record['user_id']]);
        $user = (new UserModel())->where('id', '=', $record['user_id'])->first();

        return $this->json([
            'access' => [
                'token' => $accessToken,
                'expiresAt' => (time() + TokenHelper::ACCESS_TTL) * 1000,
            ],
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'surname' => $user['surname'],
                'email' => $user['email'],
                'avatar' => UrlHelper::formatUserAvatar($user['avatar']),
            ]
        ]);
    }

    public function actionLogout()
    {
        $data = Request::json();
        $refreshToken = $data['refreshToken'] ?? '';

        if (!$refreshToken) {
            return $this->json(['message' => 'Refresh token is required'], 422);
        }

        $hash = TokenHelper::hashRefreshToken($refreshToken);
        (new UserRefreshTokenModel())->deleteByTokenHash($hash);

        return $this->json();
    }

    public function actionChangeEmail()
    {
        $data = Request::json();
        $user = Request::user();

        $newEmail = strtolower(trim($data['email'] ?? ''));
        $password = $data['password'] ?? '';

        if (!$newEmail || !$password) {
            return $this->json(['message' => 'Email and password are required'], 422);
        }

        if (!filter_var($newEmail, FILTER_VALIDATE_EMAIL)) {
            return $this->json(['message' => 'Invalid email format'], 422);
        }

        $userModel = new UserModel();
        $currentUser = $userModel->where('id', '=', $user['id'])->first();

        if (!$currentUser) {
            return $this->json(['message' => 'User not found'], 404);
        }

        if (!password_verify($password . $currentUser['salt'], $currentUser['password'])) {
            return $this->json(['message' => 'Current password is incorrect'], 401);
        }

        $existingUser = $userModel->findByEmail($newEmail);
        if ($existingUser && $existingUser['id'] !== $user['id']) {
            return $this->json(['message' => 'Email is already taken'], 409);
        }

        $updated = $userModel->where('id', '=', $user['id'])->update([
            'email' => $newEmail
        ]);

        if (!$updated) {
            return $this->json(['message' => 'Failed to update email'], 500);
        }

        $updatedUser = $userModel->where('id', '=', $user['id'])->first();

        return $this->json([
            'user' => [
                'id' => $updatedUser['id'],
                'name' => $updatedUser['name'],
                'surname' => $updatedUser['surname'],
                'email' => $updatedUser['email'],
                'avatar' => UrlHelper::formatUserAvatar($updatedUser['avatar']),
            ]
        ]);
    }

    public function actionChangePassword()
    {
        $data = Request::json();
        $user = Request::user();

        $currentPassword = $data['currentPassword'] ?? '';
        $newPassword = $data['newPassword'] ?? '';

        if (!$currentPassword || !$newPassword) {
            return $this->json(['message' => 'Current password and new password are required'], 422);
        }

        if (strlen($newPassword) < 6) {
            return $this->json(['message' => 'New password must be at least 6 characters'], 422);
        }

        $userModel = new UserModel();
        $currentUser = $userModel->where('id', '=', $user['id'])->first();

        if (!$currentUser) {
            return $this->json(['message' => 'User not found'], 404);
        }

        if (!password_verify($currentPassword . $currentUser['salt'], $currentUser['password'])) {
            return $this->json(['message' => 'Current password is incorrect'], 401);
        }

        $newSalt = bin2hex(random_bytes(16));
        $hashedNewPassword = password_hash($newPassword . $newSalt, PASSWORD_BCRYPT);

        $updated = $userModel->where('id', '=', $user['id'])->update([
            'password' => $hashedNewPassword,
            'salt' => $newSalt
        ]);

        if (!$updated) {
            return $this->json(['message' => 'Failed to update password'], 500);
        }

        return $this->json(['message' => 'Password updated successfully']);
    }

    public function actionDeleteAccount()
    {
        $data = Request::json();
        $user = Request::user();

        $password = $data['password'] ?? '';

        if (!$password) {
            return $this->json(['message' => 'Password is required'], 422);
        }

        $userModel = new UserModel();
        $currentUser = $userModel->where('id', '=', $user['id'])->first();

        if (!$currentUser) {
            return $this->json(['message' => 'User not found'], 404);
        }

        if (!password_verify($password . $currentUser['salt'], $currentUser['password'])) {
            return $this->json(['message' => 'Password is incorrect'], 401);
        }

        $deleted = $userModel->deleteById($currentUser['id']);

        if (!$deleted) {
            return $this->json(['message' => 'Failed to delete account'], 500);
        }

        return $this->json(['message' => 'Account deleted successfully']);
    }

    public function actionUploadAvatar()
    {
        $user = Request::user();
        if (!isset($_FILES['avatar'])) {
            return $this->json(['message' => 'No file uploaded'], 422);
        }
        $file = $_FILES['avatar'];

        if ($file['error'] !== UPLOAD_ERR_OK) {
            error_log('Upload error: ' . $file['error']);
            return $this->json(['message' => 'File upload error: ' . $file['error']], 422);
        }

        if ($file['size'] > 5 * 1024 * 1024) {
            return $this->json(['message' => 'File size too large. Maximum 5MB allowed'], 422);
        }

        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, $allowedTypes)) {
            return $this->json(['message' => 'Invalid file type. Only JPEG, JPG, PNG allowed'], 422);
        }

        $uploadDir = __DIR__ . '/../../public/uploads/avatars/';
        if (!is_dir($uploadDir)) {
            error_log('Creating upload directory: ' . $uploadDir);
            if (!mkdir($uploadDir, 0755, true)) {
                error_log('Failed to create upload directory');
                return $this->json(['message' => 'Failed to create upload directory'], 500);
            }
        }

        $allowedExtensions = ['jpg', 'jpeg', 'png'];
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, $allowedExtensions)) {
            return $this->json(['message' => 'Invalid file extension'], 422);
        }

        $fileName = $user['id'] . '_' . time() . '.' . $extension;
        $filePath = $uploadDir . $fileName;

        if (!move_uploaded_file($file['tmp_name'], $filePath)) {
            error_log('Failed to move uploaded file');
            return $this->json(['message' => 'Failed to save file'], 500);
        }

        if (!file_exists($filePath)) {
            error_log('File was not saved properly');
            return $this->json(['message' => 'File was not saved properly'], 500);
        }

        $userModel = new UserModel();
        $currentUser = $userModel->where('id', '=', $user['id'])->first();

        if ($currentUser['avatar'] && file_exists($uploadDir . basename($currentUser['avatar']))) {
            $oldFile = $uploadDir . basename($currentUser['avatar']);
            error_log('Deleting old avatar: ' . $oldFile);
            unlink($oldFile);
        }

        $avatarUrl = '/uploads/avatars/' . $fileName;
        error_log('Avatar URL: ' . $avatarUrl);

        $updated = $userModel->where('id', '=', $user['id'])->update([
            'avatar' => $avatarUrl
        ]);

        if (!$updated) {
            unlink($filePath);
            return $this->json(['message' => 'Failed to update avatar in database'], 500);
        }

        $currentUser = $userModel->where('id', '=', $user['id'])->first();

        error_log('Final avatar URL: ' . UrlHelper::formatUserAvatar($currentUser['avatar']));

        return $this->json([
            'user' => [
                'id' => $currentUser['id'],
                'name' => $currentUser['name'],
                'surname' => $currentUser['surname'],
                'email' => $currentUser['email'],
                'avatar' => UrlHelper::formatUserAvatar($currentUser['avatar'])
            ]
        ]);
    }

    public function actionGetProfile()
    {
        $user = Request::user();

        $userModel = new UserModel();
        $currentUser = $userModel->where('id', '=', $user['id'])->first();

        if (!$currentUser) {
            return $this->json(['message' => 'User not found'], 404);
        }

        return $this->json([
            'user' => [
                'id' => $currentUser['id'],
                'name' => $currentUser['name'],
                'surname' => $currentUser['surname'],
                'email' => $currentUser['email'],
                'avatar' => UrlHelper::formatUserAvatar($currentUser['avatar'])
            ]
        ]);
    }

    protected function generateTokensAndSave(string $userId): array
    {
        $accessToken = TokenHelper::generateAccessToken(['id' => $userId]);
        $deviceInfo = $_SERVER['HTTP_USER_AGENT'] ?? null;

        $refreshToken = TokenHelper::generateRefreshToken();
        $refreshHash = TokenHelper::hashRefreshToken($refreshToken);
        $refreshExpiresAt = time() + TokenHelper::REFRESH_TTL;

        $model = new UserRefreshTokenModel();
        $existing = $model->findByDevice($deviceInfo);

        if ($existing) {
            $model->where('id', '=', $existing['id'])->update([
                'refresh_token_hash' => $refreshHash,
                'expires_at' => date('Y-m-d H:i:s', $refreshExpiresAt),
            ]);
        } else {
            $model->create([
                'user_id' => $userId,
                'refresh_token_hash' => $refreshHash,
                'expires_at' => date('Y-m-d H:i:s', $refreshExpiresAt),
                'device_info' => $deviceInfo
            ]);
        }

        $user = (new UserModel())->where('id', '=', $userId)->first();

        return [
            'access' => [
                'token' => $accessToken,
                'expiresAt' => (time() + TokenHelper::ACCESS_TTL) * 1000,
            ],
            'refresh' => [
                'token' => $refreshToken,
                'expiresAt' => $refreshExpiresAt * 1000,
            ],
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'surname' => $user['surname'],
                'email' => $user['email'],
                'avatar' => UrlHelper::formatUserAvatar($user['avatar']),
            ]
        ];
    }
}

<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Helpers\TokenHelper;
use App\Models\UserModel;
use App\Models\UserRefreshToken;
use Ramsey\Uuid\Uuid;

class AuthController extends Controller
{
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
        $model = new UserRefreshToken();
        $record = $model->findByTokenHash($hash);

        if (!$record) {
            return $this->json(['error' => 'INVALID_TOKEN'], 401);
        }

        if (strtotime($record['expires_at']) < time()) {
            $model->deleteByTokenHash($hash);
            return $this->json(['message' => 'Refresh token is expired'], 401);
        }

        $accessToken = TokenHelper::generateAccessToken(['id' => $record['user_id']]);

        return $this->json([
            'access' => [
                'token' => $accessToken,
                'expiresAt' => (time() + TokenHelper::ACCESS_TTL) * 1000,
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
        (new UserRefreshToken())->deleteByTokenHash($hash);

        return $this->json();
    }

    protected function generateTokensAndSave(string $userId): array
    {
        $accessToken = TokenHelper::generateAccessToken(['id' => $userId]);
        $deviceInfo = $_SERVER['HTTP_USER_AGENT'] ?? null;

        $refreshToken = TokenHelper::generateRefreshToken();
        $refreshHash = TokenHelper::hashRefreshToken($refreshToken);
        $refreshExpiresAt = time() + TokenHelper::REFRESH_TTL;

        $model = new UserRefreshToken();
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
                'email' => $user['email']
            ]
        ];
    }
}

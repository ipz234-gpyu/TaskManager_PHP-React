<?php

namespace App\Helpers;

use App\Core\Config;
use PHPMailer\PHPMailer\PHPMailer;

class EmailHelper
{
    public static function sendTeamInvitation(string $email, string $userName, string $teamName, string $invitationLink): bool
    {
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = Config::getEnv('MAIL_HOST');
            $mail->SMTPAuth = true;
            $mail->Username = Config::getEnv('MAIL_USERNAME');
            $mail->Password = Config::getEnv('MAIL_PASSWORD');
            $mail->SMTPSecure = Config::getEnv('MAIL_ENCRYPTION', 'ssl');
            $mail->Port = Config::getEnv('MAIL_PORT', 587);

            $mail->setFrom(Config::getEnv('MAIL_FROM_ADDRESS'), Config::getEnv('MAIL_FROM_NAME', 'TaskManager'));
            $mail->addAddress($email, $userName);

            $mail->isHTML(true);
            $mail->Subject = "Team Invitation - {$teamName}";
            $mail->Body = self::getInvitationEmailTemplate($userName, $teamName, $invitationLink);

            $mail->send();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    private static function getInvitationEmailTemplate(string $userName, string $teamName, string $invitationLink): string
    {
        return "
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Team Invitation</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f6f8;
            color: #1f2937;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            border-radius: 12px;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #4f46e5, #3b82f6);
            color: #fff;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            letter-spacing: 0.5px;
        }
        .content {
            padding: 30px 20px;
        }
        .content h2 {
            font-size: 20px;
            margin-bottom: 10px;
            color: #111827;
        }
        .content p {
            font-size: 16px;
            margin-bottom: 16px;
        }
        .button {
            display: inline-block;
            padding: 14px 28px;
            background-color: #91b4f6;
            color: #fff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
        }
        .link-box {
            background-color: #f3f4f6;
            padding: 12px;
            border-radius: 8px;
            word-break: break-all;
            font-size: 14px;
            color: #1f2937;
        }
        .footer {
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #6b7280;
        }
        @media only screen and (max-width: 600px) {
            .content, .header, .footer {
                padding: 20px;
            }
            .button {
                width: 100%;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>You've Been Invited to Join <br><strong>{$teamName}</strong></h1>
        </div>
        <div class='content'>
            <h2>Hello, {$userName} 👋</h2>
            <p>You've received an invitation to join the <strong>{$teamName}</strong> team on our task management platform.</p>
            <p>Click the button below to accept the invitation:</p>
            <div style='text-align: center;'>
                <a href='{$invitationLink}' class='button'>Accept Invitation</a>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <div class='link-box'>{$invitationLink}</div>
            <p><strong>Note:</strong> This invitation will expire in 7 days.</p>
            <p>If you weren't expecting this invitation, you can safely ignore this email.</p>
        </div>
        <div class='footer'>
            © 2025 Task Manager. All rights reserved.
        </div>
    </div>
</body>
</html>
";

    }
}
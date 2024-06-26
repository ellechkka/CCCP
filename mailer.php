<?php

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

require 'config.php';

function sendCode($email, $code) {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->SMTPAuth = true;
    $mail->Host = MAILHOST;
    $mail->Username = USERNAME;
    $mail->Password = PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $mail->setFrom(SEND_FROM, SEND_FROM_NAME);
    $mail->addAddress($email);
    $mail->addReplyTo(REPLY_TO, REPLY_TO_NAME);
    $mail->isHTML(true);
    $mail->Subject = 'Подтвердите регистрацию на сайте Детско-юношеского компьютерного центра Университета ИТМО';
    $mail->CharSet = "UTF-8";
    $mail->Encoding = 'base64';
    $mail->ContentType = 'text/plain';

    $post = '
    <div style="text-align: center;">
        <h2>Подтвердите регистрацию</h2>
        <p>Регистрация почти закончена, для завершения необходимо ввести код</p>
        <h3 style="color: #0982D9;">' . $code . '</h3>
        <small>Код действует в течение 20 минут</small>
    </div>
    ';

    $mail->Body = $post;

    $mail->AltBody = "Регистрация почти закончена, для завершения необходимо ввести код " . $code . ". Код действует в течение 20 минут";
    
    if (!$mail->send()) {
        return 'not sent';
        // return "Mailer Error: " . $mail->ErrorInfo;
    } else {
        return 'sent';
        // return "Message has been sent successfully";
    }
}

function recoverPassword($email, $code) {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->SMTPAuth = true;
    $mail->Host = MAILHOST;
    $mail->Username = USERNAME;
    $mail->Password = PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $mail->setFrom(SEND_FROM, SEND_FROM_NAME);
    $mail->addAddress($email);
    $mail->addReplyTo(REPLY_TO, REPLY_TO_NAME);
    $mail->isHTML(true);
    $mail->Subject = 'Восстановление пароля на сайте Детско-юношеского компьютерного центра Университета ИТМО';
    $mail->CharSet = "UTF-8";
    $mail->Encoding = 'base64';
    $mail->ContentType = 'text/plain';

    $link = 'http://localhost/cccp.ver2/html/enter-new-password.html?code=' . urlencode($code);

    $post = "
    <div style='text-align: center;'>
    <h2>Восстановление пароля</h2>
    <p>Вы сделали запрос на восстановление пароля. Чтобы сбросить старый пароль и создать новый, перейдите по ссылке ниже: </p>
    <a href='" . $link . "'
    style='text-decoration: none; color: #0982D9; font-weight: bold;'>" . $link . "</a><br><br><br>
    <small>Ссылка действует в течение 20 минут</small><br><br>
    <small>Если вы не запрашивали восстановление пароля, можете смело игнорировать это письмо</small>
</div>";

    $mail->Body = $post;

    $mail->AltBody = "Вы сделали запрос на восстановление пароля. Чтобы сбросить старый пароль и создать новый, перейдите по ссылке: ". $link . ". Ссылка действует в течение 20 минут. Если вы не запрашивали восстановление пароля, можете смело игнорировать это письмо.";;
    if (!$mail->send()) {
        return 'error';
        // return "Mailer Error: " . $mail->ErrorInfo;
    } else {
        return 'success';
        // return "Message has been sent successfully";
    }
}

function sendVer($email, $code) {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->SMTPAuth = true;
    $mail->Host = MAILHOST;
    $mail->Username = USERNAME;
    $mail->Password = PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $mail->setFrom(SEND_FROM, SEND_FROM_NAME);
    $mail->addAddress($email);
    $mail->addReplyTo(REPLY_TO, REPLY_TO_NAME);
    $mail->isHTML(true);
    $mail->Subject = 'Редактирование профиля на сайте Детско-юношеского компьютерного центра Университета ИТМО';
    $mail->CharSet = "UTF-8";
    $mail->Encoding = 'base64';
    $mail->ContentType = 'text/plain';

    $post = '
    <div style="text-align: center;">
    <h2>Редактирование профиля</h2>
    <p>Редактирование профиля почти закончено, для завершения необходимо ввести код </p>
    <h3 style="color: #0982D9;">' . $code . '</h3>
    <small>Код действует в течение 20 минут</small>
</div>
    ';

    $mail->Body = $post;

    $mail->AltBody = "Редактирование профиля почти закончено, для завершения необходимо ввести код " . $code . ". Код действует в течение 20 минут";
    
    if (!$mail->send()) {
        return 'error';
        // return "Mailer Error: " . $mail->ErrorInfo;
    } else {
        return 'success';
        // return "Message has been sent successfully";
    }
}
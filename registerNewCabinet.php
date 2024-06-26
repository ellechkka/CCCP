<?php
require ('mailer.php');
session_start();

$postData = file_get_contents("php://input");
$data = json_decode($postData, true);

$email = $data['email'] ?? null;
$password = $data['password'] ?? null;
$myCode = $data['myCode'] ?? null;

// подключение к базе
try {
    $db = new PDO('firebird:dbname=188.120.237.220:/root/CCCP_000.fdb;charset=win1251;', 'SYSDBA', 'masterkey');
} catch (PDOException $e) {
    die("Ошибка подключения к базе данных: " . $e->getMessage());
}

// если был введен код
if ($myCode !== null) {
    $savedCode = $_SESSION['saved_data_reg'];
    $savedMail = $_SESSION['saved_email_reg'];
    $savedPassword = $_SESSION['saved_pass_reg'];

    // сохраненный в сессии код совпал с введенным
    if ($savedCode == $myCode) {
        // поменять кодировку
        $email_win1251 = mb_convert_encoding($savedMail, 'Windows-1251', 'UTF-8');
        $password_win1251 = mb_convert_encoding($savedPassword, 'Windows-1251', 'UTF-8');

        // добавить строку в CABINET
        $sql = "INSERT INTO CABINET (ID_LK, MAIL, PASS_LK) VALUES (NEXT VALUE FOR GEN_CABINET_ID, :email, :password)";
        $select = $db->prepare($sql);
        $select->bindParam(':email', $email_win1251);
        $select->bindParam(':password', $password_win1251);
        $result = $select->execute();
        // если строка добавилась 
        if ($result) {
            // сохранить почту в куки
            setcookie('Email', $savedMail, time() + 86400, '/');

            // проверить, есть ли такой человек в REGISTRATION
            $sql = "SELECT ID_NAME FROM REGISTRATION WHERE EMAIL LIKE :email";
            $select = $db->prepare($sql);
            $emailPattern = '%' . $email_win1251 . '%';
            $select->bindParam(':email', $emailPattern);
            $select->execute();
            $result = $select->fetchAll(PDO::FETCH_ASSOC);

            // такого нет
            if (empty($result)) {
                echo json_encode('registered');
            }
            // есть зарегистрированные дети
            else {
                // получить ID_LK
                $sql = "SELECT ID_LK FROM CABINET WHERE MAIL = :email";
                $select = $db->prepare($sql);
                $select->bindParam(':email', $email_win1251);
                $select->execute();
                $result = $select->fetch(PDO::FETCH_ASSOC);

                $lkid = $result['ID_LK'];
                // добавить в REGISTRATION
                $sql = "UPDATE REGISTRATION SET ID_LK = :lkid WHERE EMAIL LIKE :email";
                $select = $db->prepare($sql);
                $select->bindParam(':lkid', $lkid);
                $select->bindParam(':email', $emailPattern);
                $result = $select->execute();
                if ($result) {
                    echo json_encode('linked');
                } else {
                    echo json_encode('not linked');
                }
            }
        }
        // не добавилась
        else {
            echo json_encode("no success");
        }
    }
    // код введен неверно
    else {
        echo json_encode("code error");
    }
} else {
    // код еще не отправлен
    $email = mb_convert_encoding($email, 'Windows-1251', 'UTF-8');

    // Проверка, зарегистрирован ли уже пользователь с такой почтой
    $sql = "SELECT * FROM CABINET WHERE MAIL = :email";
    $select = $db->prepare($sql);
    $select->bindParam(':email', $email);
    $select->execute();
    $result = $select->fetchAll(PDO::FETCH_ASSOC);

    // такой пользователь уже зарегистрирован
    if (!empty($result)) {
        echo json_encode('already registered');
        exit();
    }
    // еще не зарегистрирован
    else {
        // Отправка кода подтверждения на почту
        $code = mt_rand(100000, 999999);

        if (!empty($email)) {
            $response = sendCode($email, $code);
            $_SESSION['saved_data_reg'] = $code;
            $_SESSION['saved_email_reg'] = $email;
            $_SESSION['saved_pass_reg'] = $password;
        } else {
            $response = "not sent";
        }
        echo json_encode($response);
    }
}
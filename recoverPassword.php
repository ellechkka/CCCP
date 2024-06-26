<?php
require ('mailer.php');
session_start();

$postData = file_get_contents("php://input");
$data = json_decode($postData, true);

$email = $data['email'] ?? null;
$password = $data['password'] ?? null;
$code = $data['code'] ?? null;

// подключение к базе
try {
    $db = new PDO('firebird:dbname=188.120.237.220:/root/CCCP_000.fdb;charset=win1251;', 'SYSDBA', 'masterkey');
} catch (PDOException $e) {
    die("Ошибка подключения к базе данных: " . $e->getMessage());
}

// если был совершен переход по ссылке
if ($code !== null) {
    $savedCode = $_SESSION['saved_data_recovery'];
    $savedMail = $_SESSION['saved_email_recovery'];

    // сохраненный в сессии код совпал с введенным
    if ($savedCode == $code) {
        //     echo json_encode('code verified');
        $email_win1251 = mb_convert_encoding($email, 'Windows-1251', 'UTF-8');
        $password_win1251 = mb_convert_encoding($password, 'Windows-1251', 'UTF-8');

        $sql = "UPDATE CABINET SET PASS_LK = :password WHERE MAIL = :email";
        $select = $db->prepare($sql);
        $select->bindParam(':password', $password_win1251);
        $select->bindParam(':email', $email_win1251);

        $result = $select->execute();

        if ($result) {
            setcookie('Email', $email, time() + 86400, '/');
            echo json_encode('changed');
        } else {
            echo json_encode('not changed');
        }
    }
    // не совпал
    else {
        echo json_encode('code error');
    }
}
// код еще не отправлен 
else if ($email !== null) {
    // смена кодировки из UTF8 в Win1251
    $email_win1251 = mb_convert_encoding($email, 'Windows-1251', 'UTF-8');

    // Проверка, зарегистрирован ли уже пользователь с такой почтой
    $sql = "SELECT * FROM CABINET WHERE MAIL = :email";
    $select = $db->prepare($sql);
    $select->bindParam(':email', $email_win1251);
    $select->execute();
    $result = $select->fetchAll(PDO::FETCH_ASSOC);

    // такой пользователь не зарегистрирован
    if (empty($result)) {
        echo json_encode($email . ' not registered');
        exit();
    }
    // такой пользователь зарегистрирован
    // генерация кода подтверждения
    $code = mt_rand(100000, 999999);
    // отправка письма
    $response = recoverPassword($email, $code);
    $_SESSION['saved_data_recovery'] = $code;
    $_SESSION['saved_email_recovery'] = $email;
    // echo json_encode(['code' => $_SESSION['saved_data_recovery'], 'email' => $_SESSION['saved_email_recovery']]);
    echo json_encode($response);
}

// нужно отправить ему на почту ссылку с GET запросом, содержащую код
// он перейдет по ссылке, там при загрузке страницы будет fetch, который снова откроет этот файл и сверит коды
// если они совпали, поле для ввода пароля
// если нет то не понятно
// написать типа не удалось верифицировать почту, попробуйте позже

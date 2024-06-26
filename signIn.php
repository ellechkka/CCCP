<?php
$data = json_decode(file_get_contents("php://input"), true);

$login = $data['login'];
$password = $data['password'];

$emailPattern = '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/';
$idPattern = '/^\d+$/';

try {
    $db = new PDO('firebird:dbname=188.120.237.220:/root/CCCP_000.fdb;charset=win1251;', 'SYSDBA', 'masterkey');
    
    if (preg_match($emailPattern, $login)) {
        // вход осуществляется по почте 
        $sql = "SELECT * FROM CABINET WHERE MAIL = :login";
    } elseif (preg_match($idPattern, $login)) {
        // вход осуществляется по ID
        $sql = "SELECT * FROM registration
                JOIN CABINET ON registration.id_lk = cabinet.id_lk
                WHERE id_name = :login";
    } else {
        echo json_encode("Строка не является ни почтой, ни идентификатором");
        exit();
    }
    
    // смена кодировки из UTF8 в Win1251
    $login = mb_convert_encoding($login, 'Windows-1251', 'UTF-8');

    $select = $db->prepare($sql);
    $select->bindParam(':login', $login);
    $select->execute();
    $result = $select->fetchAll(PDO::FETCH_ASSOC);

    // такой пользователь не зарегистрирован
    if (empty($result)) {
        echo json_encode('empty');
        exit();
    }

    if (preg_match($emailPattern, $login)) {
        // вход осуществляется по почте 
        $passwordDB = $result[0]['PASS_LK'];
    } elseif (preg_match($idPattern, $login)) {
        // вход осуществляется по ID
        $passwordDB = $result[0]['PASSW'];
    }

    // смена кодировки из Win1251 в UTF8
    $passwordDB = mb_convert_encoding($passwordDB, 'UTF-8', 'Windows-1251');
    // проверка на соответствие пароля
    if ($password == $passwordDB) { 
        if (preg_match($emailPattern, $login)) {
            // вход осуществляется по почте 
            // сохранение email в cookie
            setcookie('Email', $login, time() + 86400, '/');
        } elseif (preg_match($idPattern, $login)) {
            // вход осуществляется по ID
            setcookie('ID', $login, time() + 86400, '/');
        }
        echo json_encode('success');
    } else {
        echo json_encode('no success');
    }
} catch (PDOException $e) {
    die("Ошибка подключения к базе данных: " . $e->getMessage());
}
<?php
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];

try {
    $db = new PDO('firebird:dbname=188.120.237.220:/root/CCCP_000.fdb;charset=win1251;', 'SYSDBA', 'masterkey');
    $sql = "SELECT * FROM registration WHERE email LIKE :like_email";

    $select = $db->prepare($sql);
    $select->execute([':like_email' => '%' . $email . '%']);
    $result = $select->fetchAll(PDO::FETCH_ASSOC);
    if ($result) {
        echo json_encode(mb_convert_encoding($result[0]['ID_NAME'], 'UTF-8', 'windows-1251')); 
    }
    else {
        echo json_encode('no id');
    }
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

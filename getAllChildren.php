<?php
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];

try {
    $db = new PDO('firebird:dbname=188.120.237.220:/root/CCCP_000.fdb;charset=win1251;', 'SYSDBA', 'masterkey');
    $sql = "SELECT ID_NAME, LASTNAME, FIRSTNAME, MIDNAME FROM registration WHERE email LIKE :like_email";

    $select = $db->prepare($sql);
    $select->execute([':like_email' => '%' . $email . '%']);
    $result = $select->fetchAll(PDO::FETCH_ASSOC);
    foreach ($result as &$row) {
        foreach ($row as &$value) {
            $value = mb_convert_encoding($value, 'UTF-8', 'windows-1251');
        }
    }
    echo json_encode($result);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

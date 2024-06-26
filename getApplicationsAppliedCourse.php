<?php
$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];

try {
    $db = new PDO('firebird:dbname=188.120.237.220:/root/CCCP_000.fdb;charset=win1251;', 'SYSDBA', 'masterkey');

    // отправлена заявка на курс
    $sql = "SELECT COMP FROM REGISTRATION WHERE ID_NAME = '$id';";
    $select = $db->prepare($sql);
    $select->execute([':id' => $id]);
    $select->execute();
    $result = $select->fetchAll(PDO::FETCH_ASSOC);
    if ($result) {
        foreach ($result as &$row) {
            foreach ($row as &$value) {
                $value = mb_convert_encoding($value, 'UTF-8', 'windows-1251');
            }
        }
        echo json_encode($result);
    } else {
        echo json_encode('no applied courses');
    }
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
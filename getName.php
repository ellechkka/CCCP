<?php
$data = json_decode(file_get_contents("php://input"), true);
$id = mb_convert_encoding($data['id'], 'Windows-1251', 'UTF-8');

try {
    $db = new PDO('firebird:dbname=188.120.237.220:/root/CCCP_000.fdb;charset=win1251;', 'SYSDBA', 'masterkey');

    $sql = "SELECT LASTNAME, FIRSTNAME FROM registration WHERE ID_NAME = :id";
    $select = $db->prepare($sql);
    $select->execute([':id' => $id]);
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
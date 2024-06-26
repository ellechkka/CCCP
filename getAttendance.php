<?php
$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$group = mb_convert_encoding($data['group'], 'Windows-1251', 'UTF-8');

try {
    $db = new PDO('firebird:dbname=188.120.237.220:/root/CCCP_000.fdb;charset=win1251;', 'SYSDBA', 'masterkey');
    $sql = "SELECT DATE_J, PRESENCE, TEST_GROUP_JN  FROM journal
    JOIN po_kursam ON journal.id_name_j = po_kursam.id_name_l
    WHERE ID_NAME_J = :id AND TEST_GROUP_JN = :group AND DEL_MARK = 'A';";
    $select = $db->prepare($sql);
    $select->bindParam(':id', $id, PDO::PARAM_STR);
    $select->bindParam(':group', $group, PDO::PARAM_STR);
    $select->execute();
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
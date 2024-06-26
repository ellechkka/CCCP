<?php
$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];

try {
    $db = new PDO('firebird:dbname=188.120.237.220:/root/CCCP_000.fdb;charset=win1251;', 'SYSDBA', 'masterkey');

    $sql = "SELECT NAME_COURSE, DAY_PAY, MONEY, PAY_N
    FROM allpaydata 
    JOIN groups ON allpaydata.test_group_mn = groups.test_group_g
    JOIN courses ON courses.id_course = groups.id_course_g
    WHERE ID_NAME_M = :id
    ORDER BY DAY_PAY DESC";

    $select = $db->prepare($sql);
    $select->bindParam(':id', $id, PDO::PARAM_STR);
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
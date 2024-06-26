<?php
$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'];

try {
    $db = new PDO('firebird:dbname=188.120.237.220:/root/CCCP_000.fdb;charset=win1251;', 'SYSDBA', 'masterkey');
    $sql = "SELECT MAIL, PASS_LK FROM CABINET 
    join registration on registration.id_lk = cabinet.id_lk 
    WHERE ID_NAME = :id";
    $select = $db->prepare($sql);
    $select->execute([':id' =>  $id]);
    $result = $select->fetchAll(PDO::FETCH_ASSOC);

    if ($result) {
        foreach ($result as &$value) {
            $value = mb_convert_encoding($value, 'UTF-8', 'windows-1251');
        }
        $passLength = mb_strlen($result[0]['PASS_LK'], 'UTF-8');
        $hiddenPassword = str_repeat('•', $passLength);

        $array = array("Email" => $result[0]['MAIL'], "Length" => $passLength, "Password" => $hiddenPassword);

        echo json_encode($array);
    } else {
        echo json_encode([]);
    }
    
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

<?php
$data = json_decode(file_get_contents("php://input"), true);

$fname = mb_convert_encoding($data['studentName'], 'Windows-1251', 'UTF-8');
$lname = mb_convert_encoding($data['studentSurname'], 'Windows-1251', 'UTF-8');
$mname = mb_convert_encoding($data['studentPatronymic'], 'Windows-1251', 'UTF-8');
$payer = mb_convert_encoding(($parentSurname . ' ' . $parentName . ' ' . $parentPatronymic), 'Windows-1251', 'UTF-8');
$year = mb_convert_encoding($data['chooseYear'], 'Windows-1251', 'UTF-8');
$tel = mb_convert_encoding($data['studentTel'], 'Windows-1251', 'UTF-8');
$telPayer = mb_convert_encoding($data['parentTel'], 'Windows-1251', 'UTF-8');
$napr = mb_convert_encoding(substr($data['chooseTrack'], -1), 'Windows-1251', 'UTF-8');
$courses = '';

// Проходим по массиву и добавляем значения в строку
foreach ($data['chooseCourses'] as $value) {
    // Добавляем значение к строке, разделяя запятой
    $courses .= $value . ', ';
}
// Удаляем последнюю запятую и пробел
$courses = rtrim($courses, ', ');
$courses = mb_convert_encoding($courses, 'Windows-1251', 'UTF-8');

try {
    $db = new PDO('firebird:dbname=188.120.237.220:/root/CCCP_000.fdb;charset=win1251;', 'SYSDBA', 'masterkey');
    $sql = "SELECT NEXT VALUE FOR GEN_REGISTR FROM RDB\$DATABASE";
    $select = $db->prepare($sql);
    $select->execute();
    // слежующее значение ID
    $id_name = $select->fetchColumn();

    // нужно получить значение ID_LK 
    $email_win1251 = mb_convert_encoding($data['parentEmail'], 'Windows-1251', 'UTF-8');
    $sql = "SELECT ID_LK FROM CABINET WHERE MAIL = :email";
    $select = $db->prepare($sql);
    $select->bindParam(':email', $email_win1251);
    $select->execute();
    $result = $select->fetch(PDO::FETCH_ASSOC);

    $lkid = $result['ID_LK'];

    // // вставка строки в REGISTRATION
    $sql = "INSERT INTO REGISTRATION (ID_NAME, LASTNAME, FIRSTNAME, MIDNAME, MOTHER, COMP, LOGINNAME, PASSW, BYEAR, TEL, TELMAMA, EMAIL, CATEGORY, ID_LK) VALUES (:id, :lname, :fname, :mname, :payer, :comp, :loginname, :passw, :year, :tel, :telPayer, :email, :naprav, :id_lk)";

    $sql = "INSERT INTO REGISTRATION (ID_NAME, LASTNAME, FIRSTNAME, MIDNAME, SCHOOL, NCLASS, MOTHER, DATAREG,
    COMP, LOGINNAME, PASSW, BYEAR, TEL, TELMAMA,
    EMAIL, CATEGORY, ID_LK) VALUES
    (:id, :lname, :fname, :mname, '', '', :payer, CURRENT_TIMESTAMP, :comp, :loginname, :passw, :year, :tel, :telPayer, :email, :naprav, :id_lk)";
    $select = $db->prepare($sql);

    $select->bindParam(':id', $id_name);
    $select->bindParam(':fname', $fname);
    $select->bindParam(':lname', $lname);
    $select->bindParam(':mname', $mname);
    $select->bindParam(':payer', $payer);
    $select->bindParam(':comp', $courses);
    $select->bindParam(':loginname', $id_name);
    $select->bindParam(':passw', $lname);
    $select->bindParam(':year', $year);
    $select->bindParam(':tel', $tel);
    $select->bindParam(':telPayer', $telPayer);
    $select->bindParam(':email', $email_win1251);
    $select->bindParam(':naprav', $napr);
    $select->bindParam(':id_lk', $lkid);

    $result = $select->execute();
    if ($result) {
        echo json_encode('registered');
    } else {
        echo json_encode('not registered');
    }

} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
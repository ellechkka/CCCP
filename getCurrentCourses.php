<?php
$data = json_decode(file_get_contents("php://input"), true);
$id = mb_convert_encoding($data['id'], 'Windows-1251', 'UTF-8');

try {
    $db = new PDO('firebird:dbname=188.120.237.220:/root/CCCP_000.fdb;charset=win1251;', 'SYSDBA', 'masterkey');
    $sql = "SELECT COURSES.COD_COURS, COURSES.LVL, NAME_COURSE, groups.test_group_g, FIRST_NAME,
    LAST_NAME, MIDDLE_NAME, MOBIL_PHONE, TIME_LESSON, DAY_LESSON
    FROM po_kursam
        join groups on po_kursam.test_group_l = groups.test_group_g
        join teachers on groups.id_teacher_g = teachers.id_teacher
        join courses on courses.id_course = groups.id_course_g
        where del_mark = 'A' AND ID_NAME_L = :id AND test_group_g NOT LIKE '?%';";

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
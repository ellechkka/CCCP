<?php
$data = json_decode(file_get_contents("php://input"), true);
$id = mb_convert_encoding($data['id'], 'Windows-1251', 'UTF-8');

try {
    $db = new PDO('firebird:dbname=188.120.237.220:/root/CCCP_000.fdb;charset=win1251;', 'SYSDBA', 'masterkey');
    $sql = "SELECT distinct RESULT, FIRST_NAME, LAST_NAME, MIDDLE_NAME, MOBIL_PHONE, NAME_COURSE, COURSES.COD_COURS, COURSES.LVL
    FROM results
        JOIN edu_objects on results.id_object_r = edu_objects.id_object
        join po_kursam on results.id_student = po_kursam.id_name_l
        join teachers on results.who_res = teachers.id_teacher
        join courses on courses.id_course = edu_objects.id_course_o
        WHERE ID_STUDENT = :id AND type_obj = 2 AND DEL_MARK = 'D';";

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
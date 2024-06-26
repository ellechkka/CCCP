<?php
$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$id = 12419;

try {
    $db = new PDO('firebird:dbname=188.120.237.220:/root/CCCP_000.fdb;charset=win1251;', 'SYSDBA', 'masterkey');
    // зачислен на курс
    $sql = "SELECT DISTINCT COD_COURS, NAME_COURSE, LVL FROM pup_A
    join groups on groups.test_group_g = pup_a.test_group_l
    join courses on courses.id_course = groups.id_course_g
    WHERE (TEST_GROUP_L LIKE '?_A' OR TEST_GROUP_L LIKE '?_B' OR
      TEST_GROUP_L LIKE '?_BC' OR TEST_GROUP_L LIKE '?_BM' OR
      TEST_GROUP_L LIKE '?_BS' OR TEST_GROUP_L LIKE '?_BV' OR
      TEST_GROUP_L LIKE '?_C' OR TEST_GROUP_L LIKE '?_CS' OR
      TEST_GROUP_L LIKE '?_D' OR TEST_GROUP_L LIKE '?_E' OR
      TEST_GROUP_L LIKE '?_G' OR TEST_GROUP_L LIKE '?_GE' OR
      TEST_GROUP_L LIKE '?_GM' OR TEST_GROUP_L LIKE '?_GP' OR
      TEST_GROUP_L LIKE '?_GS' OR TEST_GROUP_L LIKE '?_H' OR
      TEST_GROUP_L LIKE '?_I' OR TEST_GROUP_L LIKE '?_IG' OR
      TEST_GROUP_L LIKE '?_JV' OR TEST_GROUP_L LIKE '?_K' OR
      TEST_GROUP_L LIKE '?_M' OR TEST_GROUP_L LIKE '?_MA' OR
      TEST_GROUP_L LIKE '?_MD' OR TEST_GROUP_L LIKE '?_N' OR
      TEST_GROUP_L LIKE '?_O' OR TEST_GROUP_L LIKE '?_P' OR
      TEST_GROUP_L LIKE '?_PH' OR TEST_GROUP_L LIKE '?_R' OR
      TEST_GROUP_L LIKE '?_SA' OR TEST_GROUP_L LIKE '?_SAM' OR
      TEST_GROUP_L LIKE '?_SB' OR TEST_GROUP_L LIKE '?_TC' OR
      TEST_GROUP_L LIKE '?_TD' OR TEST_GROUP_L LIKE '?_V' OR
      TEST_GROUP_L LIKE '?_W') AND ID_NAME = '$id';";
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
        echo json_encode('no registered courses');
    }
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
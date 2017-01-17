<?php
require_once('database.php');

$connection = connect();

$sql = 'INSERT INTO sitting VALUES ()';
$out = array();

if ($connection->query($sql) === TRUE) {
  $out['session_id'] = $connection->insert_id; 
} else {
  $out['session_id'] = -1;
}

echo json_encode($out);

disconnect($connection);
?>

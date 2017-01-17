<?php
require_once('database.php');

$connection = connect();

$sql = 'INSERT INTO guess(sitting_id, ip, generation, litter, expression, nright, nstars) VALUES (?, ?, ?, ?, ?, ?, ?)';
$statement = $connection->prepare($sql);
$statement->bind_param('isiisii', $_REQUEST['session'], $_SERVER['REMOTE_ADDR'], $_REQUEST['generation'], $_REQUEST['litter'], $_REQUEST['expression'], $_REQUEST['nright'], $_REQUEST['nstars']);
$statement->execute();

$statement->close();
disconnect($connection);
?>

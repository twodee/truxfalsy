<?php

function connect() {
   $properties = parse_ini_file('private.ini');
   $connection = new mysqli('localhost', $properties['user'], $properties['password'], $properties['database']);
   return $connection;
}

/* ------------------------------------------------------------------------- */

function disconnect($connection) {
   $connection->close();
}

/* ------------------------------------------------------------------------- */

?>

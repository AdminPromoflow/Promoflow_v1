<?php
  $input = json_decode(file_get_contents("php://input"), true);

  echo json_encode($input['action'].$input['email'].$input['password']);
 ?>

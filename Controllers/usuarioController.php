<?php 

    require_once('../Models/DB.php');
    require_once('../Models/Response.php');

    try {
        $connection = DB::getConnection();
    }
    catch (PDOException $e){
        error_log("Error de conexión - " . $e);

        $response = new Response();
        $response->setHttpStatusCode(500);
        $response->setSuccess(false);
        $response->addMessage("Error en conexión a Base de datos");
        $response->send();
        exit();
    }

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Methods: POST, GET, DELETE, PATCH, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        header('Access-Control-Max-Age: 86400');
        $response = new Response();
        $response->setHttpStatusCode(200);
        $response->setSuccess(true);
        $response->send();
        exit();
    }


    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        $response = new Response();
        $response->setHttpStatusCode(405);
        $response->setSuccess(false);
        $response->addMessage("Metodo no permitido");
        $response->send();
        exit();
    }

    if ($_SERVER['CONTENT_TYPE'] !== 'application/json') {
        $response = new Response();
        $response->setHttpStatusCode(400);
        $response->setSuccess(false);
        $response->addMessage("Encabezado Content Type no es JSON");
        $response->send();
        exit();
    }

    $postData = file_get_contents('php://input');

    if (!$json_data = json_decode($postData)) {
        $response = new Response();
        $response->setHttpStatusCode(400);
        $response->setSuccess(false);
        $response->addMessage("El cuerpo de la solicitud no es un JSON válido");
        $response->send();
        exit();
    }

    if (!isset($json_data->email) || !isset($json_data->nombre) || !isset($json_data->contrasena)) {
        $response = new Response();
        $response->setHttpStatusCode(400);
        $response->setSuccess(false);
        (!isset($json_data->nombre) ? $response->addMessage("El nombre es obligatorio") : false);
        (!isset($json_data->email) ? $response->addMessage("El email es obligatorio") : false);
        (!isset($json_data->contrasena) ? $response->addMessage("La contraseña es obligatoria") : false);
        $response->send();
        exit();
    }

    //Validación de longitud....

    if($json_data->email === null || strlen($json_data->email) > 50 || strlen($json_data->email) < 1) {
        $response = new Response();
        $response->setHttpStatusCode(409);
        $response->setSuccess(false);
        $response->addMessage("El tamaño del email es incorrecto");
        $response->send();
        exit();
    }

    if(strpos($json_data->email, "@") === false || strpos($json_data->email, ".") === false){
        $response = new Response();
        $response->setHttpStatusCode(409);
        $response->setSuccess(false);
        $response->addMessage("El email es incorrecto");
        $response->send();
        exit();
    }
    

    if($json_data->nombre === null || strlen($json_data->nombre) > 50 || strlen($json_data->nombre) < 1) {
        $response = new Response();
        $response->setHttpStatusCode(409);
        $response->setSuccess(false);
        $response->addMessage("El nombre es incorrecto");
        $response->send();
        exit();
    }

    if(strlen($json_data->contrasena) < 8) {
        $response = new Response();
        $response->setHttpStatusCode(409);
        $response->setSuccess(false);
        $response->addMessage("La contraseña es corta");
        $response->send();
        exit();
    }


    $email = trim($json_data->email);
    $nombre = trim($json_data->nombre);
    $contrasena = $json_data->contrasena;
    $rol = $json_data->rol;


    try {
        $query = $connection->prepare('SELECT id FROM usuario WHERE email = :email');
        $query->bindParam(':email', $email, PDO::PARAM_STR);
        $query->execute();

        $rowCount = $query->rowCount();

        if($rowCount !== 0) {
            $response = new Response();
            $response->setHttpStatusCode(409);
            $response->setSuccess(false);
            $response->addMessage("El usuario ya existe");
            $response->send();
            exit();
        }

        $contrasena_hash = password_hash($contrasena, PASSWORD_DEFAULT);

        $query = $connection->prepare('INSERT INTO usuario(rol, email, contrasena, nombre) VALUES(:rol, :email, :contrasena, :nombre)');
        $query->bindParam(':rol', $rol, PDO::PARAM_STR);
        $query->bindParam(':email', $email, PDO::PARAM_STR);
        $query->bindParam(':contrasena', $contrasena_hash, PDO::PARAM_STR);
        $query->bindParam(':nombre', $nombre, PDO::PARAM_STR);
        $query->execute();

        $rowCount = $query->rowCount();

        if($rowCount === 0) {
            $response = new Response();
            $response->setHttpStatusCode(500);
            $response->setSuccess(false);
            $response->addMessage("Error al crear usuario - inténtelo de nuevo");
            $response->send();
            exit();
        }

        $ultimoID = $connection->lastInsertId();

        $returnData = array();
        $returnData['id'] = $ultimoID;
        $returnData['rol'] = $rol;
        $returnData['email'] = $email;
        $returnData['nombre'] = $nombre;

        $response = new Response();
        $response->setHttpStatusCode(201);
        $response->setSuccess(true);
        $response->addMessage("Usuario creado");
        $response->setData($returnData);
        $response->send();
        exit();
    }
    catch(PDOException $e) {
        error_log('Error en BD - ' . $e);

        $response = new Response();
        $response->setHttpStatusCode(500);
        $response->setSuccess(false);
        $response->addMessage("Error al crear usuario");
        $response->send();
        exit();
    }


?>
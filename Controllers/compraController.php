<?php

    require_once('../Models/DB.php');
    require_once('../Models/compra.php');
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


    if (array_key_exists("id_usuario", $_GET)) {
        //GET host/tareas/categoria_id={id}
        if($_SERVER['REQUEST_METHOD'] === 'GET')
        {
            //Devolver por categoria
            $id_usuario = $_GET['id_usuario'];
            if ($id_usuario == '' || !is_numeric($id_usuario)) {
                $response = new Response();
                $response->setHttpStatusCode(400);
                $response->setSuccess(false);
                $response->addMessage("El id del cliente no puede estar vacío y debe ser numérico");
                $response->send();
                exit();
            }
    
            try {
                $query = $connection->prepare('SELECT id, precio, pago, direccion, id_usuario
                FROM compra WHERE id_usuario = :id_usuario');
                $query->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
                $query->execute();
    
                $rowCount = $query->rowCount();
    
                $compras = array();

                while($row = $query->fetch(PDO::FETCH_ASSOC)) {
                    $compra = new Compra($row['id'], $row['precio'], $row['pago'], $row['direccion'], $row['id_usuario']);
    
                    $compras[] = $compra->getArray();
                }
    
                $returnData = array();
                $returnData['total_registros'] = $rowCount;
                $returnData['compras'] = $compras;
    
                $response = new Response();
                $response->setHttpStatusCode(200);
                $response->setSuccess(true);
                $response->setToCache(true);
                $response->setData($returnData);
                $response->send();
                exit();
            }
            catch(TareaException $e){
                $response = new Response();
                $response->setHttpStatusCode(500);
                $response->setSuccess(false);
                $response->addMessage($e->getMessage());
                $response->send();
                exit();
            }
            catch(PDOException $e) {
                error_log("Error en BD - " . $e);
    
                $response = new Response();
                $response->setHttpStatusCode(500);
                $response->setSuccess(false);
                $response->addMessage("Error en consulta de la compra");
                $response->send();
                exit();
            }
        }
        elseif($_SERVER['REQUEST_METHOD'] === 'POST')
        {
            //Devolver por categoria
            $id_usuario = $_GET['id_usuario'];
            if ($id_usuario == '' || !is_numeric($id_usuario)) {
                $response = new Response();
                $response->setHttpStatusCode(400);
                $response->setSuccess(false);
                $response->addMessage("El id del cliente no puede estar vacío y debe ser numérico");
                $response->send();
                exit();
            }
    
            try {


                $query = $connection->prepare('INSERT INTO compra (precio, id_usuario) 
                VALUES (:precio, :id_usuario )');
                $query->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
                $query->execute();
    
                $rowCount = $query->rowCount();
    
                $compras = array();

                while($row = $query->fetch(PDO::FETCH_ASSOC)) {
                    $compra = new Compra($row['id'], $row['precio'], $row['pago'], $row['direccion'], $row['id_usuario']);
    
                    $compras[] = $compra->getArray();
                }
    
                $returnData = array();
                $returnData['total_registros'] = $rowCount;
                $returnData['compras'] = $compras;
    
                $response = new Response();
                $response->setHttpStatusCode(200);
                $response->setSuccess(true);
                $response->setToCache(true);
                $response->setData($returnData);
                $response->send();
                exit();
            }
            catch(TareaException $e){
                $response = new Response();
                $response->setHttpStatusCode(500);
                $response->setSuccess(false);
                $response->addMessage($e->getMessage());
                $response->send();
                exit();
            }
            catch(PDOException $e) {
                error_log("Error en BD - " . $e);
    
                $response = new Response();
                $response->setHttpStatusCode(500);
                $response->setSuccess(false);
                $response->addMessage("Error en consulta de la compra");
                $response->send();
                exit();
            }
        }
        else {
            $response = new Response();
            $response->setHttpStatusCode(405);
            $response->setSuccess(false);
            $response->addMessage("Método no permitido");
            $response->send();
            exit();
        }
    }

?>
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

//Verificación token


if(empty($_GET)){
    
    if($_SERVER['REQUEST_METHOD'] === 'POST')
    {

        if ($_SERVER['CONTENT_TYPE'] !== 'application/json'){
            $response = new Response();
            $response->setHttpStatusCode(400);
            $response->setSuccess(false);
            $response->addMessage('Encabezado "Content type" no es JSON');
            $response->send();
            exit();
        }

        $postData = file_get_contents('php://input');

        if (!$json_data = json_decode($postData)) {
            $response = new Response();
            $response->setHttpStatusCode(400);
            $response->setSuccess(false);
            $response->addMessage('El cuerpo de la solicitud no es un JSON válido');
            $response->send();
            exit();
        }


        $id_usuario = $json_data->id;

        //Devolver por categoria
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
            $query->bindParam(':precio', $json_data->precio, PDO::PARAM_STR);
            $query->execute();

            $rowCount = $query->rowCount();

            $returnData['total_registros'] = $rowCount;
            $returnData['ID'] = $ultimoID = $connection->lastInsertId();
            
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

} else{

    if (array_key_exists("compra", $_GET)) {
        //GET host/tareas/categoria_id={id}
        if($_SERVER['REQUEST_METHOD'] === 'GET')
        {
            //Devolver por categoria
            $categoria_id = $_GET['compra'];
            if ($categoria_id == '' || !is_numeric($categoria_id)) {
                $response = new Response();
                $response->setHttpStatusCode(400);
                $response->setSuccess(false);
                $response->addMessage("El id de la compra no puede estar vacío y debe ser numérico");
                $response->send();
                exit();
            }

            try {
                $query = $connection->prepare('SELECT id FROM compra WHERE id_usuario = :categoria_id');
                $query->bindParam(':categoria_id', $categoria_id, PDO::PARAM_INT);
                $query->execute();

                $rowCount = $query->rowCount();

                $tareas = array();

                while($row = $query->fetch(PDO::FETCH_ASSOC)) {

                    $tareas[] = $row['id'];
                }

                $returnData = array();
                $returnData['total_registros'] = $rowCount;
                $returnData['compras'] = $tareas;


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
                $response->addMessage("Error en consulta de compra");
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


}

?>
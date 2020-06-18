<?php
    require_once('../Models/DB.php');
    require_once('../Models/Producto.php');
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











    if(empty($_GET)){

        

        //POST host/producto
        if($_SERVER['REQUEST_METHOD'] === 'POST'){

            //Verificación token

            if (!isset($_SERVER['HTTP_AUTHORIZATION']) || strlen($_SERVER['HTTP_AUTHORIZATION']) < 1) {
                $response = new Response();
                $response->setHttpStatusCode(401);
                $response->setSuccess(false);
                $response->addMessage("No se encontró el token de acceso");
                $response->send();
                exit();
            }

            $accesstoken = $_SERVER['HTTP_AUTHORIZATION']; 

            try {
                $query = $connection->prepare('SELECT id_usuario, caducidad_token_acceso, activo 
                FROM sesion, usuario WHERE sesion.id_usuario = usuario.id 
                AND token_acceso = :token_acceso');
                $query->bindParam(':token_acceso', $accesstoken, PDO::PARAM_STR);
                $query->execute();

                $rowCount = $query->rowCount();

                if ($rowCount === 0) {
                    $response = new Response();
                    $response->setHttpStatusCode(401);
                    $response->setSuccess(false);
                    $response->addMessage("Token de acceso no válido");
                    $response->send();
                    exit();
                }

                $row = $query->fetch(PDO::FETCH_ASSOC);

                $consulta_idUsuario = $row['id_usuario'];
                $consulta_cadTokenAcceso = $row['caducidad_token_acceso'];
                $consulta_activo = $row['activo'];

                if($consulta_activo !== 'SI') {
                    $response = new Response();
                    $response->setHttpStatusCode(401);
                    $response->setSuccess(false);
                    $response->addMessage("Cuenta de usuario no activa");
                    $response->send();
                    exit();
                }


                ////////////////////  Verificar zona horaria
                //echo date('D M j G:i:s T Y'); 
                $consulta_cadTokenAcceso = '07-06-2020 21:59';
                echo strtotime($consulta_cadTokenAcceso);
                //var_dump(date_default_timezone_get());
                date_default_timezone_set('America/Mexico_City'); 
                echo ' - ';
                echo time()-18000;

                if (strtotime($consulta_cadTokenAcceso) < time()) {
                    $response = new Response();
                    $response->setHttpStatusCode(401);
                    $response->setSuccess(false);
                    $response->addMessage("Token de acceso ha caducado");
                    $response->send();
                    exit();
                }
            } 
            catch (PDOException $e) {
                error_log('Error en DB - ' . $e);

                $response = new Response();
                $response->setHttpStatusCode(500);
                $response->setSuccess(false);
                $response->addMessage("Error al autenticar usuario");
                $response->send();
                exit();
            }


            

            //POST

            try {
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
    
                if (!isset($json_data->nombre) || !isset($json_data->precio) || !isset($json_data->categoria) 
                || !isset($json_data->descripcion) || !isset($json_data->envio) || !isset($json_data->img)) {
                    $response = new Response();
                    $response->setHttpStatusCode(400);
                    $response->setSuccess(false);
                    
                    (!isset($json_data->nombre) ? $response->addMessage('El nombre del producto es obligatorio') : false);
                    (!isset($json_data->precio) ? $response->addMessage('El precio del producto es obligatorio') : false);
                    (!isset($json_data->categoria) ? $response->addMessage('La categoria del producto es obligatoria') : false);
                    (!isset($json_data->descripcion) ? $response->addMessage('La descripcion del producto es obligatoria') : false);
                    (!isset($json_data->envio) ? $response->addMessage('El costo de envio del producto es obligatorio') : false);
                    (!isset($json_data->img) ? $response->addMessage('La imegen del producto es obligatoria') : false);
                    $response->send();
                    exit();
                }
    
                $producto = new Producto(
                    null, 
                    $json_data->nombre,
                    $json_data->precio,
                    $json_data->categoria,
                    $json_data->descripcion,
                    $json_data->envio,
                    '2020-06-06 12:12',
                    (isset($json_data->descuento) ? $json_data->descuento : null),
                    $json_data->img,
                    'NO'
                );
                
                $nombre = $producto->getNombre();
                $precio = $producto->getPrecio();
                $categoria = $producto->getCategoria();
                $descripcion = $producto->getDescripcion();
                $envio = $producto->getEnvio();
                $fecha = $producto->getFecha();
                $descuento = $producto->getDescuento();
                $img = base64_decode($json_data->img);

                $query = $connection->prepare('INSERT INTO producto (nombre, precio, categoria, descripcion, envio, fecha, descuento, img) 
                VALUES ( :nombre, :precio, :categoria, :descripcion, :envio, STR_TO_DATE(:fecha, \'%Y-%m-%d %H:%i\'), :descuento, :img)');
                $query->bindParam(':nombre', $nombre, PDO::PARAM_STR);
                $query->bindParam(':precio', $precio, PDO::PARAM_STR);
                $query->bindParam(':categoria', $categoria, PDO::PARAM_STR);
                $query->bindParam(':descripcion', $descripcion, PDO::PARAM_STR);
                $query->bindParam(':envio', $envio, PDO::PARAM_STR);
                $query->bindParam(':fecha', $fecha, PDO::PARAM_STR);
                $query->bindParam(':descuento',$descuento, PDO::PARAM_INT);
                $query->bindParam(':img', $img, PDO::PARAM_LOB);
                $query->execute();
    
                $rowCount = $query->rowCount();
    
                if ($rowCount === 0) {
                    $response = new Response();
                    $response->setHttpStatusCode(500);
                    $response->setSuccess(false);
                    $response->addMessage("Error al crear el producto");
                    $response->send();
                    exit();
                }
    
                $ultimo_ID = $connection->lastInsertId();
    
                $query = $connection->prepare('SELECT id, nombre, precio, categoria, descripcion, envio,
                DATE_FORMAT(fecha, "%Y-%m-%d %H:%i") fecha, descuento, img, vendido FROM producto WHERE id = :id');
                $query->bindParam(':id', $ultimo_ID, PDO::PARAM_INT);
                $query->execute();
    
                $rowCount = $query->rowCount();
    
                if ($rowCount === 0) {
                    $response = new Response();
                    $response->setHttpStatusCode(500);
                    $response->setSuccess(false);
                    $response->addMessage("Error al obtener el producto después de crearlo");
                    $response->send();
                    exit();
                }
    
                $producto = array();

                while($row = $query->fetch(PDO::FETCH_ASSOC)) {
                    $producto = new Producto($row['id'], $row['nombre'], $row['precio'], $row['categoria'], 
                    $row['descripcion'], $row['envio'], $row['fecha'], $row['descuento'], $row['img'], $row['vendido']);

                    $productos[] = $producto->getArray();
                }
    
                $returnData = array();
                $returnData['total_registros'] = $rowCount;
                $returnData['producto'] = $productos;
    
                $response = new Response();
                $response->setHttpStatusCode(200);
                $response->setSuccess(true);
                $response->addMessage("Producto creado");
                $response->setData($returnData);
                $response->send();
                exit();
            }
            catch (ProductoException $e) {
                $response = new Response();
                $response->setHttpStatusCode(500);
                $response->setSuccess(false);
                $response->addMessage($e->getMessage());
                $response->send();
                exit();
            }
            catch (PDOException $e){
                error_log("Error en BD - " . $e);
    
                $response = new Response();
                $response->setHttpStatusCode(500);
                $response->setSuccess(false);
                $response->addMessage("Error en creación de productos");
                $response->send();
                exit();
            }
        } 
        else{//Si el metodo no es correcto
            $response = new Response();
            $response->setHttpStatusCode(405);
            $response->setSuccess(false);
            $response->addMessage("Método no permitido");
            $response->send();
            exit();
        }


    }else{

        


        //GET host/producto/producto_is={id}
        //Obtener articulo para compra
        if (array_key_exists("producto_id", $_GET)) {





            //Verificación token

            if (!isset($_SERVER['HTTP_AUTHORIZATION']) || strlen($_SERVER['HTTP_AUTHORIZATION']) < 1) {
                $response = new Response();
                $response->setHttpStatusCode(401);
                $response->setSuccess(false);
                $response->addMessage("No se encontró el token de acceso");
                $response->send();
                exit();
            }

            $accesstoken = $_SERVER['HTTP_AUTHORIZATION']; 

            try {
                $query = $connection->prepare('SELECT id_usuario, caducidad_token_acceso, activo 
                FROM sesion, usuario WHERE sesion.id_usuario = usuario.id 
                AND token_acceso = :token_acceso');
                $query->bindParam(':token_acceso', $accesstoken, PDO::PARAM_STR);
                $query->execute();

                $rowCount = $query->rowCount();

                if ($rowCount === 0) {
                    $response = new Response();
                    $response->setHttpStatusCode(401);
                    $response->setSuccess(false);
                    $response->addMessage("Token de acceso no válido");
                    $response->send();
                    exit();
                }

                $row = $query->fetch(PDO::FETCH_ASSOC);

                $consulta_idUsuario = $row['id_usuario'];
                $consulta_cadTokenAcceso = $row['caducidad_token_acceso'];
                $consulta_activo = $row['activo'];

                if($consulta_activo !== 'SI') {
                    $response = new Response();
                    $response->setHttpStatusCode(401);
                    $response->setSuccess(false);
                    $response->addMessage("Cuenta de usuario no activa");
                    $response->send();
                    exit();
                }


                ////////////////////  Verificar zona horaria
                //echo date('D M j G:i:s T Y'); 
                $consulta_cadTokenAcceso = '07-06-2020 21:59';
                echo strtotime($consulta_cadTokenAcceso);
                //var_dump(date_default_timezone_get());
                date_default_timezone_set('America/Mexico_City'); 
                echo ' - ';
                echo time()-18000;

                if (strtotime($consulta_cadTokenAcceso) < time()) {
                    $response = new Response();
                    $response->setHttpStatusCode(401);
                    $response->setSuccess(false);
                    $response->addMessage("Token de acceso ha caducado");
                    $response->send();
                    exit();
                }
            } 
            catch (PDOException $e) {
                error_log('Error en DB - ' . $e);

                $response = new Response();
                $response->setHttpStatusCode(500);
                $response->setSuccess(false);
                $response->addMessage("Error al autenticar usuario");
                $response->send();
                exit();
            }










            $producto_id = $_GET['producto_id'];
            if($_SERVER['REQUEST_METHOD'] === 'GET') {

                //Buscar un producto
                if ($producto_id == '' || !is_numeric($producto_id)) {
                    $response = new Response();
                    $response->setHttpStatusCode(400);
                    $response->setSuccess(false);
                    $response->addMessage("El id del producto no puede estar vacío y debe ser numérico");
                    $response->send();
                    exit();
                }

                try {
                    $query = $connection->prepare('SELECT id, nombre, precio, categoria, descripcion, envio, 
                    DATE_FORMAT(fecha, "%Y-%m-%d %H:%i") fecha, descuento, img, vendido FROM producto WHERE id = :id');
                    $query->bindParam(':id', $producto_id, PDO::PARAM_INT);
                    $query->execute();
        
                    $rowCount = $query->rowCount();
        
                    $productos = array();

                    while($row = $query->fetch(PDO::FETCH_ASSOC)) {
                        $producto = new Producto($row['id'], $row['nombre'], $row['precio'], $row['categoria'], 
                        $row['descripcion'], $row['envio'], $row['fecha'], $row['descuento'], $row['img'], $row['vendido']);
    
                        $productos[] = $producto->getArray();
                    }
        
                    $returnData = array();
                    $returnData['total_registros'] = $rowCount;
                    $returnData['producto'] = $productos;
        
                    $response = new Response();
                    $response->setHttpStatusCode(200);
                    $response->setSuccess(true);
                    $response->setToCache(true);
                    $response->setData($returnData);
                    $response->send();
                    exit();
                }
                catch(ProductoException $e){
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
                    $response->addMessage("Error en consulta de productos");
                    $response->send();
                    exit();
                }
            




            }//DELETE host/producto/producto_is={id}
            elseif($_SERVER['REQUEST_METHOD'] === 'DELETE') {
                try {
                    $query = $connection->prepare('DELETE FROM producto WHERE id = :producto_id');
                    $query->bindParam(':producto_id', $producto_id, PDO::PARAM_INT);
                    $query->execute();
        
                    $rowCount = $query->rowCount();
        
                    if ($rowCount === 0) {
                        $response = new Response();
                
                        $response->setHttpStatusCode(404);
                        $response->setSuccess(false);
                        $response->addMessage("Producto no encontrado");
                        $response->send();
                        exit();
                    }
        
                    $response = new Response();
                
                    $response->setHttpStatusCode(200);
                    $response->setSuccess(true);
                    $response->addMessage("Producto eliminado");
                    $response->send();
                    exit();
                }
                catch (PDOException $e) {
                    error_log("Error en DB - ".$e, 0);
                
                    $response = new Response();
                
                    $response->setHttpStatusCode(500);
                    $response->setSuccess(false);
                    $response->addMessage("Error al eliminar el producto");
                    $response->send();
                    exit();
                }
































                


            }
            
            
            
            
            //DELETE host/producto/producto_is={id}
            elseif($_SERVER['REQUEST_METHOD'] === 'PATCH'){
                try {
                    if ($_SERVER['CONTENT_TYPE'] !== 'application/json'){
                        $response = new Response();
                        $response->setHttpStatusCode(400);
                        $response->setSuccess(false);
                        $response->addMessage('Encabezado "Content type" no es JSON');
                        $response->send();
                        exit();
                    }
        
                    $patchData = file_get_contents('php://input');
        
                    if (!$json_data = json_decode($patchData)) {
                        $response = new Response();
                        $response->setHttpStatusCode(400);
                        $response->setSuccess(false);
                        $response->addMessage('El cuerpo de la solicitud no es un JSON válido');
                        $response->send();
                        exit();
                    }


                    $actualiza_nombre = false;
                    $actualiza_precio = false;
                    $actualiza_categoria = false;
                    $actualiza_descripcion = false;
                    $actualiza_envio = false;
                    $actualiza_descuento = false;
                    $actualiza_img = false;
                    $actualiza_vendido = false;
                    
                    $campos_query = "";
        
                    if (isset($json_data->nombre)) {
                        $actualiza_nombre = true;
                        $campos_query .= "nombre = :nombre, ";
                    }

                    if (isset($json_data->precio)) {
                        $actualiza_precio = true;
                        $campos_query .= "precio = :precio, ";
                    }

                    if (isset($json_data->categoria)) {
                        $actualiza_categoria = true;
                        $campos_query .= "categoria = :categoria, ";
                    }

                    if (isset($json_data->descripcion)) {
                        $actualiza_descripcion = true;
                        $campos_query .= "descripcion = :descripcion, ";
                    }

                    if (isset($json_data->envio)) {
                        $actualiza_envio = true;
                        $campos_query .= "envio = :envio, ";
                    }

                    if (isset($json_data->descuento)) {
                        $actualiza_descuento = true;
                        $campos_query .= "descuento = :descuento, ";
                    }

                    if (isset($json_data->img)) {
                        $actualiza_img = true;
                        $campos_query .= "img = :img, ";
                    }

                    if (isset($json_data->vendido)) {
                        $actualiza_vendido = true;
                        $campos_query .= "vendido = :vendido, ";
                    }

        
                    $campos_query = rtrim($campos_query, ", ");
        
                    if ($actualiza_nombre === false && $actualiza_precio === false && $actualiza_categoria === false && 
                    $actualiza_descripcion === false && $actualiza_envio === false && $actualiza_img === false && $actualiza_vendido === false) {
                        $response = new Response();
                        $response->setHttpStatusCode(400);
                        $response->setSuccess(false);
                        $response->addMessage("No hay campos para actualizar");
                        $response->send();
                        exit();
                    }

                    $query = $connection->prepare('SELECT id, nombre, precio, categoria, descripcion, envio, 
                    DATE_FORMAT(fecha, "%Y-%m-%d %H:%i") fecha, descuento, img, vendido FROM producto WHERE id = :id');
                    $query->bindParam(':id', $producto_id, PDO::PARAM_INT);
                    $query->execute();

                    $rowCount = $query->rowCount();
        
                    if($rowCount === 0) {
                        $response = new Response();
                        $response->setHttpStatusCode(404);
                        $response->setSuccess(false);
                        $response->addMessage("No se encontró el producto");
                        $response->send();
                        exit();
                    }
                    
                    
                    while($row = $query->fetch(PDO::FETCH_ASSOC)) {
                        $producto = new Producto($row['id'], $row['nombre'], $row['precio'], $row['categoria'], 
                        $row['descripcion'], $row['envio'], $row['fecha'], $row['descuento'], $row['img'], $row['vendido']);
                    }
        
                    $cadena_query = 'UPDATE producto SET ' . $campos_query . ' WHERE id = :id';
                    $query = $connection->prepare($cadena_query);
        
                    if($actualiza_nombre === true) {
                        $producto->setNombre($json_data->nombre);
                        $up_nombre = $producto->getNombre();
                        $query->bindParam(':nombre', $up_nombre, PDO::PARAM_STR);
                    }

                    if($actualiza_precio === true) {
                        $producto->setPrecio($json_data->precio);
                        $up_precio = $producto->getPrecio();
                        $query->bindParam(':precio', $up_precio, PDO::PARAM_STR);
                    }
                    
                    if($actualiza_categoria === true) {
                        $producto->setCategoria($json_data->categoria);
                        $up_categoria = $producto->getCategoria();
                        $query->bindParam(':categoria', $up_categoria, PDO::PARAM_STR);
                    }

                    if($actualiza_descripcion === true) {
                        $producto->setDescripcion($json_data->descripcion);
                        $up_descripcion = $producto->getDescripcion();
                        $query->bindParam(':descripcion', $up_descripcion, PDO::PARAM_STR);
                    }

                    if($actualiza_envio === true) {
                        $producto->setEnvio($json_data->envio);
                        $up_envio = $producto->getEnvio();
                        $query->bindParam(':envio', $up_envio, PDO::PARAM_STR);
                    }
                    
                    if($actualiza_descuento === true) {
                        $producto->setDescuento($json_data->descuento);
                        $up_descuento = $producto->getDescuento();
                        $query->bindParam(':descuento', $up_descuento, PDO::PARAM_STR);
                    }

                    if($actualiza_img === true) {
                        $producto->setImg($json_data->img);
                        $up_img = $producto->getImg();
                        $query->bindParam(':img', $up_img, PDO::PARAM_STR);
                    }

                    if($actualiza_vendido === true) {
                        $producto->setVendido($json_data->vendido);
                        $up_vendido = $producto->getVendido();
                        $query->bindParam(':vendido', $up_vendido, PDO::PARAM_STR);
                    }
                    
        
                    $query->bindParam(':id', $producto_id, PDO::PARAM_INT);
                    $query->execute();
        
                    $rowCount = $query->rowCount();
        
                    if ($rowCount === 0) {
                        $response = new Response();
                        $response->setHttpStatusCode(500);
                        $response->setSuccess(false);
                        $response->addMessage("Error al actualizar el producto");
                        $response->send();
                        exit();
                    }
        
                    $query = $connection->prepare('SELECT id, nombre, precio, categoria, descripcion, envio,
                    DATE_FORMAT(fecha, "%Y-%m-%d %H:%i") fecha, descuento, img, vendido FROM producto WHERE id = :id');
                    $query->bindParam(':id', $producto_id, PDO::PARAM_INT);
                    $query->execute();
        
                    $rowCount = $query->rowCount();
        
                    if($rowCount === 0) {
                        $response = new Response();
                        $response->setHttpStatusCode(404);
                        $response->setSuccess(false);
                        $response->addMessage("No se encontró el producto después de actulizar");
                        $response->send();
                        exit();
                    }


                    $producto = array();

                    while($row = $query->fetch(PDO::FETCH_ASSOC)) {
                        $producto = new Producto($row['id'], $row['nombre'], $row['precio'], $row['categoria'], 
                        $row['descripcion'], $row['envio'], $row['fecha'], $row['descuento'], $row['img'], $row['vendido']);
    
                        $productos[] = $producto->getArray();
                    }
        
                    $returnData = array();
                    $returnData['total_registros'] = $rowCount;
                    $returnData['producto'] = $productos;
        
                    $response = new Response();
                    $response->setHttpStatusCode(200);
                    $response->setSuccess(true);
                    $response->addMessage("Producto actualizado");
                    $response->setData($returnData);
                    $response->send();
                    exit();
                }
                catch(ProductoException $e) {
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
                    $response->addMessage("Error en BD al actualizar el producto");
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

        elseif (array_key_exists("product", $_GET)) {

             $producto_id = $_GET['product'];
            if($_SERVER['REQUEST_METHOD'] === 'GET') {

                //Buscar un producto
                if ($producto_id == '') {
                    $response = new Response();
                    $response->setHttpStatusCode(400);
                    $response->setSuccess(false);
                    $response->addMessage("El id del producto no puede estar vacío");
                    $response->send();
                    exit();
                }

                if (!is_numeric($producto_id)) {
                    $response = new Response();
                    $response->setHttpStatusCode(400);
                    $response->setSuccess(false);
                    $response->addMessage("El id del producto ebe ser numérico");
                    $response->send();
                    exit();
                }



                try {
                    $query = $connection->prepare('SELECT id, nombre, precio, categoria, descripcion, envio, 
                    DATE_FORMAT(fecha, "%Y-%m-%d %H:%i") fecha, descuento, img, vendido FROM producto WHERE id = :id');
                    $query->bindParam(':id', $producto_id, PDO::PARAM_INT);
                    $query->execute();
        
                    $rowCount = $query->rowCount();
        
                    $productos = array();


                    while($row = $query->fetch(PDO::FETCH_ASSOC)) {
                        
                        $producto = new Producto($row['id'], $row['nombre'], $row['precio'], $row['categoria'], 
                        $row['descripcion'], $row['envio'], $row['fecha'], $row['descuento'], $row['img'], $row['vendido']);
    
                        $productos[] = $producto->getArray();
                    }

                    
        
                    $returnData = array();
                    $returnData['total_registros'] = $rowCount;
                    $returnData['producto'] = $productos;
        
                    $response = new Response();
                    $response->setHttpStatusCode(200);
                    $response->setSuccess(true);
                    $response->setToCache(true);
                    $response->setData($returnData);
                    $response->send();
                    exit();
                }
                catch(ProductoException $e){
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
                    $response->addMessage("Error en consulta de productos");
                    $response->send();
                    exit();
                }
            




            }//DELETE host/producto/producto_is={id}
            elseif($_SERVER['REQUEST_METHOD'] === 'DELETE') {
                try {
                    $query = $connection->prepare('DELETE FROM producto WHERE id = :producto_id');
                    $query->bindParam(':producto_id', $producto_id, PDO::PARAM_INT);
                    $query->execute();
        
                    $rowCount = $query->rowCount();
        
                    if ($rowCount === 0) {
                        $response = new Response();
                
                        $response->setHttpStatusCode(404);
                        $response->setSuccess(false);
                        $response->addMessage("Producto no encontrado");
                        $response->send();
                        exit();
                    }
        
                    $response = new Response();
                
                    $response->setHttpStatusCode(200);
                    $response->setSuccess(true);
                    $response->addMessage("Producto eliminado");
                    $response->send();
                    exit();
                }
                catch (PDOException $e) {
                    error_log("Error en DB - ".$e, 0);
                
                    $response = new Response();
                
                    $response->setHttpStatusCode(500);
                    $response->setSuccess(false);
                    $response->addMessage("Error al eliminar el producto");
                    $response->send();
                    exit();
                }
































                


            }
            
            
            
            
            //DELETE host/producto/producto_is={id}
            elseif($_SERVER['REQUEST_METHOD'] === 'PATCH'){
                try {
                    if ($_SERVER['CONTENT_TYPE'] !== 'application/json'){
                        $response = new Response();
                        $response->setHttpStatusCode(400);
                        $response->setSuccess(false);
                        $response->addMessage('Encabezado "Content type" no es JSON');
                        $response->send();
                        exit();
                    }
        
                    $patchData = file_get_contents('php://input');
        
                    if (!$json_data = json_decode($patchData)) {
                        $response = new Response();
                        $response->setHttpStatusCode(400);
                        $response->setSuccess(false);
                        $response->addMessage('El cuerpo de la solicitud no es un JSON válido');
                        $response->send();
                        exit();
                    }
        
                    $actualiza_nombre = false;
                    $actualiza_precio = false;
                    $actualiza_categoria = false;
                    $actualiza_descripcion = false;
                    $actualiza_envio = false;
                    $actualiza_descuento = false;
                    $actualiza_img = false;
                    $actualiza_vendido = false;
                    
                    $campos_query = "";
        
                    if (isset($json_data->nombre)) {
                        $actualiza_nombre = true;
                        $campos_query .= "nombre = :nombre, ";
                    }

                    if (isset($json_data->precio)) {
                        $actualiza_precio = true;
                        $campos_query .= "precio = :precio, ";
                    }

                    if (isset($json_data->categoria)) {
                        $actualiza_categoria = true;
                        $campos_query .= "categoria = :categoria, ";
                    }

                    if (isset($json_data->descripcion)) {
                        $actualiza_descripcion = true;
                        $campos_query .= "descripcion = :descripcion, ";
                    }

                    if (isset($json_data->envio)) {
                        $actualiza_envio = true;
                        $campos_query .= "envio = :envio, ";
                    }

                    if (isset($json_data->descuento)) {
                        $actualiza_descuento = true;
                        $campos_query .= "descuento = :descuento, ";
                    }

                    if (isset($json_data->img)) {
                        $actualiza_img = true;
                        $campos_query .= "img = :img, ";
                    }

                    if (isset($json_data->vendido)) {
                        $actualiza_vendido = true;
                        $campos_query .= "vendido = :vendido, ";
                    }

        
                    $campos_query = rtrim($campos_query, ", ");
        
                    if ($actualiza_nombre === false && $actualiza_precio === false && $actualiza_categoria === false && 
                    $actualiza_descripcion === false && $actualiza_envio === false && $actualiza_img === false && $actualiza_vendido === false) {
                        $response = new Response();
                        $response->setHttpStatusCode(400);
                        $response->setSuccess(false);
                        $response->addMessage("No hay campos para actualizar");
                        $response->send();
                        exit();
                    }

                    $query = $connection->prepare('SELECT id, nombre, precio, categoria, descripcion, envio, 
                    DATE_FORMAT(fecha, "%Y-%m-%d %H:%i") fecha, descuento, img, vendido FROM producto WHERE id = :id');
                    $query->bindParam(':id', $producto_id, PDO::PARAM_INT);
                    $query->execute();

                    $rowCount = $query->rowCount();
        
                    if($rowCount === 0) {
                        $response = new Response();
                        $response->setHttpStatusCode(404);
                        $response->setSuccess(false);
                        $response->addMessage("No se encontró el producto");
                        $response->send();
                        exit();
                    }
                    
                    
                    while($row = $query->fetch(PDO::FETCH_ASSOC)) {
                        $producto = new Producto($row['id'], $row['nombre'], $row['precio'], $row['categoria'], 
                        $row['descripcion'], $row['envio'], $row['fecha'], $row['descuento'], $row['img'], $row['vendido']);
                    }
        
                    $cadena_query = 'UPDATE producto SET ' . $campos_query . ' WHERE id = :id';
                    $query = $connection->prepare($cadena_query);
        
                    if($actualiza_nombre === true) {
                        $producto->setNombre($json_data->nombre);
                        $up_nombre = $producto->getNombre();
                        $query->bindParam(':nombre', $up_nombre, PDO::PARAM_STR);
                    }

                    if($actualiza_precio === true) {
                        $producto->setPrecio($json_data->precio);
                        $up_precio = $producto->getPrecio();
                        $query->bindParam(':precio', $up_precio, PDO::PARAM_STR);
                    }
                    
                    if($actualiza_categoria === true) {
                        $producto->setCategoria($json_data->categoria);
                        $up_categoria = $producto->getCategoria();
                        $query->bindParam(':categoria', $up_categoria, PDO::PARAM_STR);
                    }

                    if($actualiza_descripcion === true) {
                        $producto->setDescripcion($json_data->descripcion);
                        $up_descripcion = $producto->getDescripcion();
                        $query->bindParam(':descripcion', $up_descripcion, PDO::PARAM_STR);
                    }

                    if($actualiza_envio === true) {
                        $producto->setEnvio($json_data->envio);
                        $up_envio = $producto->getEnvio();
                        $query->bindParam(':envio', $up_envio, PDO::PARAM_STR);
                    }
                    
                    if($actualiza_descuento === true) {
                        $producto->setDescuento($json_data->descuento);
                        $up_descuento = $producto->getDescuento();
                        $query->bindParam(':descuento', $up_descuento, PDO::PARAM_STR);
                    }

                    if($actualiza_img === true) {
                        $up_img = base64_decode($json_data->img);
                        $query->bindParam(':img', $up_img, PDO::PARAM_LOB);
                    }

                    if($actualiza_vendido === true) {
                        $producto->setVendido($json_data->vendido);
                        $up_vendido = $producto->getVendido();
                        $query->bindParam(':vendido', $up_vendido, PDO::PARAM_STR);
                    }
                    
        
                    $query->bindParam(':id', $producto_id, PDO::PARAM_INT);
                    $query->execute();
        
                    $rowCount = $query->rowCount();
        
                    if ($rowCount === 0) {
                        $response = new Response();
                        $response->setHttpStatusCode(500);
                        $response->setSuccess(false);
                        $response->addMessage("Error al actualizar el producto");
                        $response->send();
                        exit();
                    }
        
                    $query = $connection->prepare('SELECT id, nombre, precio, categoria, descripcion, envio,
                    DATE_FORMAT(fecha, "%Y-%m-%d %H:%i") fecha, descuento, img, vendido FROM producto WHERE id = :id');
                    $query->bindParam(':id', $producto_id, PDO::PARAM_INT);
                    $query->execute();
        
                    $rowCount = $query->rowCount();
        
                    if($rowCount === 0) {
                        $response = new Response();
                        $response->setHttpStatusCode(404);
                        $response->setSuccess(false);
                        $response->addMessage("No se encontró el producto después de actulizar");
                        $response->send();
                        exit();
                    }


                    $producto = array();

                    while($row = $query->fetch(PDO::FETCH_ASSOC)) {
                        $producto = new Producto($row['id'], $row['nombre'], $row['precio'], $row['categoria'], 
                        $row['descripcion'], $row['envio'], $row['fecha'], $row['descuento'], $row['img'], $row['vendido']);
    
                        $productos[] = $producto->getArray();
                    }
        
                    $returnData = array();
                    $returnData['total_registros'] = $rowCount;
                    $returnData['producto'] = $productos;
        
                    $response = new Response();
                    $response->setHttpStatusCode(200);
                    $response->setSuccess(true);
                    $response->addMessage("Producto actualizado");
                    $response->setData($returnData);
                    $response->send();
                    exit();
                }
                catch(ProductoException $e) {
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
                    $response->addMessage("Error en BD al actualizar el producto");
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

        //Obtener productos por categoria
        elseif(array_key_exists("categoria", $_GET) && array_key_exists("catcont", $_GET) ) {


            $categoria = $_GET['categoria'];
            if($_SERVER['REQUEST_METHOD'] === 'GET') {
                $cont = $_GET['catcont'];
                //Buscar un producto
                if (strtolower($categoria) !== 'automoviles' && strtolower($categoria) !== 'tecnologia' && strtolower($categoria) !== 'hogar' && strtolower($categoria) !== 'electrodomesticos' 
                && strtolower($categoria) !== 'joyas' && strtolower($categoria) !== 'herramientas' && strtolower($categoria) !== 'videojuegos' && strtolower($categoria) !== 'libros' 
                && strtolower($categoria) !== 'software' && strtolower($categoria) !== 'ropa' && strtolower($categoria) !== 'juguetes' && strtolower($categoria) !== 'inmuebles') {
                    $response = new Response();
                    $response->setHttpStatusCode(400);
                    $response->setSuccess(false);
                    $response->addMessage("Categoria invalida");
                    $response->send();
                    exit();
                }
                

                try {
                    $query = $connection->prepare('SELECT id, nombre, precio, categoria, descripcion, envio, 
                    DATE_FORMAT(fecha, "%Y-%m-%d %H:%i") fecha, descuento, img, vendido FROM producto WHERE categoria = :categoria');
                    $query->bindParam(':categoria', $categoria, PDO::PARAM_INT);
                    $query->execute();
        
                    $rowCount = $query->rowCount();
                   
                    $i = ($cont-1)*20;
                    $f = 20;
                    
                    $query = $connection->prepare('SELECT id, nombre, precio, categoria, descripcion, envio, 
                    DATE_FORMAT(fecha, "%Y-%m-%d %H:%i") fecha, descuento, img, vendido FROM producto WHERE categoria = :categoria LIMIT :i, :f');
                    $query->bindParam(':i', $i, PDO::PARAM_INT);
                    $query->bindParam(':f', $f, PDO::PARAM_INT);
                    $query->bindParam(':categoria', $categoria, PDO::PARAM_INT);
                    $query->execute();
        
                    $productos = array();

                    while($row = $query->fetch(PDO::FETCH_ASSOC)) {
                        $producto = new Producto($row['id'], $row['nombre'], $row['precio'], $row['categoria'], 
                        $row['descripcion'], $row['envio'], $row['fecha'], $row['descuento'], $row['img'], $row['vendido']);
    
                        $productos[] = $producto->getArray();
                    }
        
                    $returnData = array();
                    $returnData['total_registros'] = $rowCount;
                    $returnData['productos'] = $productos;
        
                    $response = new Response();
                    $response->setHttpStatusCode(200);
                    $response->setSuccess(true);
                    $response->setToCache(true);
                    $response->setData($returnData);
                    $response->send();
                    exit();
                }
                catch(ProductoException $e){
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
                    $response->addMessage("Error en consulta del producto");
                    $response->send();
                    exit();
                }

            }

        }

        //Obtener todos los articulos
        elseif(array_key_exists("cont", $_GET)) {
            $cont = $_GET['cont'];
            if($_SERVER['REQUEST_METHOD'] === 'GET')
            {
                try {

                    $query = $connection->prepare('SELECT id, nombre, precio, categoria, 
                    descripcion, envio, DATE_FORMAT(fecha, "%Y-%m-%d %H:%i") fecha, descuento, 
                    img, vendido FROM producto');
                    $query->execute();

                    $rowCount = $query->rowCount();


                    $i = ($cont-1)*20;
                    $f = 20;

                    $query = $connection->prepare('SELECT id, nombre, precio, categoria, 
                    descripcion, envio, DATE_FORMAT(fecha, "%Y-%m-%d %H:%i") fecha, descuento, 
                    img, vendido FROM producto LIMIT :i, :f');
                    $query->bindParam(':i', $i, PDO::PARAM_INT);
                    $query->bindParam(':f', $f, PDO::PARAM_INT);
                    $query->execute();

                    $productos = array();
                    
                    while($row = $query->fetch(PDO::FETCH_ASSOC)) {
                        $producto = new Producto($row['id'], $row['nombre'], $row['precio'], $row['categoria'], 
                        $row['descripcion'], $row['envio'], $row['fecha'], $row['descuento'], $row['img'], $row['vendido']);

                        $productos[] = $producto->getArray();
                    }


                    $returnData = array();
                    $returnData['total_registros'] = $rowCount;
                    $returnData['productos'] = $productos;

                    $response = new Response();
                    $response->setHttpStatusCode(200);
                    $response->setSuccess(true);
                    $response->setToCache(true);
                    $response->setData($returnData);
                    $response->send();
                    exit();
                
                }catch(ProductoException $e) {

                    $response = new Response();
                    $response->setHttpStatusCode(500);
                    $response->setSuccess(false);
                    $response->addMessage($e->getMessage());
                    $response->send();
                    exit();
                
                }catch(PDOException $e) {
                    error_log("Error en BD - " . $e);

                    $response = new Response();
                    $response->setHttpStatusCode(500);
                    $response->setSuccess(false);
                    $response->addMessage("Error en consulta de productos");
                    $response->send();
                    exit();
                }
            }
        }


        //Obtener los articulos de la busqueda
        elseif(array_key_exists("src", $_GET)) {
            $src = $_GET['src'];
            if($_SERVER['REQUEST_METHOD'] === 'GET')
            {
                $cont = $_GET['conta'];
                try {

                    $query = $connection->prepare('SELECT id, nombre, precio, categoria, 
                    descripcion, envio, DATE_FORMAT(fecha, "%Y-%m-%d %H:%i") fecha, descuento, 
                    img, vendido FROM producto WHERE nombre LIKE :src');
                    $src = '%'.$src.'%';
                    $query->bindParam(':src', $src ,PDO::PARAM_STR);
                    $query->execute();

                    $rowCount = $query->rowCount();

                    $i = ($cont-1)*20;
                    $f = 20;

                    //$query = $connection->prepare('SELECT id, nombre, precio, categoria, 
                    //descripcion, envio, DATE_FORMAT(fecha, "%Y-%m-%d %H:%i") fecha, descuento, 
                    //img, vendido FROM producto WHERE nombre LIKE "%:src%" LIMIT :i, :f');
                    //$query->bindParam(':src',$src,PDO::PARAM_STR);
                    //$query->bindParam(':i', $i, PDO::PARAM_INT);
                    //$query->bindParam(':f', $f, PDO::PARAM_INT);
                    //$query->execute();

                    $productos = array();
                    
                    while($row = $query->fetch(PDO::FETCH_ASSOC)) {
                        $producto = new Producto($row['id'], $row['nombre'], $row['precio'], $row['categoria'], 
                        $row['descripcion'], $row['envio'], $row['fecha'], $row['descuento'], $row['img'], $row['vendido']);

                        $productos[] = $producto->getArray();
                    }


                    $returnData = array();
                    $returnData['total_registros'] = $rowCount;
                    $returnData['productos'] = $productos;

                    $response = new Response();
                    $response->setHttpStatusCode(200);
                    $response->setSuccess(true);
                    $response->setToCache(true);
                    $response->setData($returnData);
                    $response->send();
                    exit();
                
                }catch(ProductoException $e) {

                    $response = new Response();
                    $response->setHttpStatusCode(500);
                    $response->setSuccess(false);
                    $response->addMessage($e->getMessage());
                    $response->send();
                    exit();
                
                }catch(PDOException $e) {
                    error_log("Error en BD - " . $e);

                    $response = new Response();
                    $response->setHttpStatusCode(500);
                    $response->setSuccess(false);
                    $response->addMessage("Error en consulta de productos");
                    $response->send();
                    exit();
                }
            }
        }




        //Obtener los articulos con descuento
        elseif(array_key_exists("descuento", $_GET)) {
            $cont = $_GET['descuento'];
            if($_SERVER['REQUEST_METHOD'] === 'GET')
            {
                try {
                    $des = 0;
                    $query = $connection->prepare('SELECT id, nombre, precio, categoria, 
                    descripcion, envio, DATE_FORMAT(fecha, "%Y-%m-%d %H:%i") fecha, descuento, 
                    img, vendido FROM producto WHERE descuento != :des');
                    $query->bindParam(':des',$des,PDO::PARAM_INT);
                    $query->execute();

                    $rowCount = $query->rowCount();


                    $i = ($cont-1)*20;
                    $f = 20;
                    
                    $query = $connection->prepare('SELECT id, nombre, precio, categoria, 
                    descripcion, envio, DATE_FORMAT(fecha, "%Y-%m-%d %H:%i") fecha, descuento, 
                    img, vendido FROM producto WHERE descuento != :des LIMIT :i, :f');
                    $query->bindParam(':i', $i, PDO::PARAM_INT);
                    $query->bindParam(':f', $f, PDO::PARAM_INT);
                    $query->bindParam(':des',$des,PDO::PARAM_INT);
                    $query->execute();

                    $productos = array();
                    
                    while($row = $query->fetch(PDO::FETCH_ASSOC)) {
                        $producto = new Producto($row['id'], $row['nombre'], $row['precio'], $row['categoria'], 
                        $row['descripcion'], $row['envio'], $row['fecha'], $row['descuento'], $row['img'], $row['vendido']);

                        $productos[] = $producto->getArray();
                    }


                    $returnData = array();
                    $returnData['total_registros'] = $rowCount;
                    $returnData['productos'] = $productos;

                    $response = new Response();
                    $response->setHttpStatusCode(200);
                    $response->setSuccess(true);
                    $response->setToCache(true);
                    $response->setData($returnData);
                    $response->send();
                    exit();
                
                }catch(ProductoException $e) {

                    $response = new Response();
                    $response->setHttpStatusCode(500);
                    $response->setSuccess(false);
                    $response->addMessage($e->getMessage());
                    $response->send();
                    exit();
                
                }catch(PDOException $e) {
                    error_log("Error en BD - " . $e);

                    $response = new Response();
                    $response->setHttpStatusCode(500);
                    $response->setSuccess(false);
                    $response->addMessage("Error en consulta de productos");
                    $response->send();
                    exit();
                }
            }
        }

        //Obtener los articulos nuevos
        elseif(array_key_exists("novedades", $_GET)) {
            $cont = $_GET['novedades'];
            if($_SERVER['REQUEST_METHOD'] === 'GET')
            {
                try {
                    $des = 30;
                    $query = $connection->prepare('SELECT id, nombre, precio, categoria, 
                    descripcion, envio, DATE_FORMAT(fecha, "%Y-%m-%d %H:%i") fecha, descuento, 
                    img, vendido FROM producto WHERE DATE_FORMAT(fecha, "%Y-%m-%d %H:%i") BETWEEN CURDATE() - INTERVAL :da DAY AND CURDATE()');
                    $query->bindParam(':da',$des,PDO::PARAM_INT);
                    $query->execute();

                    $rowCount = $query->rowCount();

                    $i = ($cont-1)*20;
                    $f = 20;
                    
                    $query = $connection->prepare('SELECT id, nombre, precio, categoria, 
                    descripcion, envio, DATE_FORMAT(fecha, "%Y-%m-%d %H:%i") fecha, descuento, 
                    img, vendido FROM producto WHERE DATE_FORMAT(fecha, "%Y-%m-%d %H:%i") BETWEEN CURDATE() - INTERVAL :da DAY AND CURDATE() LIMIT :i, :f');
                    $query->bindParam(':i', $i, PDO::PARAM_INT);
                    $query->bindParam(':f', $f, PDO::PARAM_INT);
                    $query->bindParam(':da',$des,PDO::PARAM_INT);
                    $query->execute();

                    $productos = array();
                    
                    while($row = $query->fetch(PDO::FETCH_ASSOC)) {
                        $producto = new Producto($row['id'], $row['nombre'], $row['precio'], $row['categoria'], 
                        $row['descripcion'], $row['envio'], $row['fecha'], $row['descuento'], $row['img'], $row['vendido']);

                        $productos[] = $producto->getArray();
                    }


                    $returnData = array();
                    $returnData['total_registros'] = $rowCount;
                    $returnData['productos'] = $productos;

                    $response = new Response();
                    $response->setHttpStatusCode(200);
                    $response->setSuccess(true);
                    $response->setToCache(true);
                    $response->setData($returnData);
                    $response->send();
                    exit();
                
                }catch(ProductoException $e) {

                    $response = new Response();
                    $response->setHttpStatusCode(500);
                    $response->setSuccess(false);
                    $response->addMessage($e->getMessage());
                    $response->send();
                    exit();
                
                }catch(PDOException $e) {
                    error_log("Error en BD - " . $e);

                    $response = new Response();
                    $response->setHttpStatusCode(500);
                    $response->setSuccess(false);
                    $response->addMessage("Error en consulta de productos");
                    $response->send();
                    exit();
                }
            }
        }












        
    }









    

?>
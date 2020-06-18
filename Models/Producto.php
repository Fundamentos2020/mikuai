<?php 

    class ProductoException extends Exception {}

    class Producto {
        
        private $_id;
        private $_nombre;
        private $_precio;
        private $_categoria;
        private $_descripcion;
        private $_envio;
        private $_fecha;
        private $_descuento;
        private $_img;
        private $_vendido;


        public function __construct($id, $nombre, $precio, $categoria, $descripcion, $envio, $fecha, $descuento, $img, $vendido) {

            $this->setID($id);
            $this->setNombre($nombre);
            $this->setPrecio($precio);
            $this->setCategoria($categoria);
            $this->setDescripcion($descripcion);
            $this->setEnvio($envio);
            $this->setFecha($fecha);
            $this->setDescuento($descuento);
            ///Falta img
            $this->setImg($img);
            $this->setVendido($vendido);

        }

        public function getID() {
            return $this->_id;
        }

        public function getNombre() {
            return $this->_nombre;
        }

        public function getPrecio() {
            return $this->_precio;
        }

        public function getCategoria() {
            return $this->_categoria;
        }

        public function getDescripcion() {
            return $this->_descripcion;
        }

        public function getEnvio() {
            return $this->_envio;
        }

        public function getFecha() {
            return $this->_fecha;
        }

        public function getDescuento() {
            return $this->_descuento;
        }

        public function getImg() {
            return $this->_img;
        }

        public function getVendido() {
            return $this->_vendido;
        }




        

        //Obtener ID, verficando que sea numero, este dentro de los parametros establecidos, sea numero, no sea nulo y no exista
        public function setID($id) {
            if ($id !== null && (!is_numeric($id) || $id <= 0 || $id >= 2147483647 || $this->_id !== null)) {
                throw new ProductoException("Error en ID del producto");
            }
            $this->_id = $id;
        }

        //Obtener nombre, verificar que la cadena este dentro de los parametros y no sea vacio
        public function setNombre($nombre) {
            if ($nombre === null || strlen($nombre) > 30 || strlen($nombre) < 1) {
                throw new ProductoException("Error en el nombre del producto");
            }
            $this->_nombre = $nombre;
        }

        ///////////////////////Investigar valor maximo float
        public function setPrecio($precio) {
            if (!is_numeric($precio) || $precio <= 0 || $precio >= 2147483647) {
                throw new ProductoException("Error en el precio del producto");
            }
            $this->_precio = $precio;
        }

        public function setCategoria($categoria) {
            if (strtolower($categoria) !== 'automoviles' && strtolower($categoria) !== 'tecnologia' && strtolower($categoria) !== 'hogar' && strtolower($categoria) !== 'electrodomesticos' 
            && strtolower($categoria) !== 'joyas' && strtolower($categoria) !== 'herramientas' && strtolower($categoria) !== 'videojuegos' && strtolower($categoria) !== 'libros' 
            && strtolower($categoria) !== 'software' && strtolower($categoria) !== 'ropa' && strtolower($categoria) !== 'juguetes' && strtolower($categoria) !== 'inmuebles') {
                throw new ProductoException("Error en la categoria del producto");
            }
            $this->_categoria = $categoria;
        }

        //
        public function setDescripcion($descripcion) {
            if ($descripcion !== null && strlen($descripcion) > 150) {
                throw new ProductoException("Error en descripción del producto");
            }
            $this->_descripcion = $descripcion;
        }

        ///////////////////////Investigar valor maximo float
        public function setEnvio($envio) {
            if (!is_numeric($envio) || $envio < 0 || $envio >= 2147483647) {
                throw new ProductoException("Error en el precio de envio del producto");
            }
            $this->_envio = $envio;
        }

        //
        public function setFecha($fecha) {
            if ($fecha !== null && date_format(date_create_from_format('Y-m-d H:i', $fecha), 'Y-m-d H:i') !== $fecha) {
                throw new ProductoException("Error en fecha límite de tarea");
            }
            $this->_fecha = $fecha;
        }

        //
        public function setDescuento($descuento) {
            if (($descuento !== null) && (!is_numeric($descuento) || $descuento < 0 || $descuento > 100)) {
                throw new ProductoException("Error en el descuento del producto");
            }
            $this->_descuento = $descuento;
        }

        //falta img
        public function setImg($img) {
            //if () {
            //    throw new ProductoException("Error en la imagen del producto");
            //}

            $img = base64_encode($img);
            $this->_img = utf8_encode($img);
        }

        //
        public function setVendido($vendido) {
            if (strtoupper($vendido) !== 'SI' && strtoupper($vendido) !== 'NO') {
                throw new ProductoException("Error en campo vendido del producto");
            }
            $this->_vendido = $vendido;
        }






        public function getArray() {
            $producto = array();

            $producto['id'] = $this->getID();
            $producto['nombre'] = $this->getNombre();
            $producto['precio'] = $this->getPrecio();
            $producto['categoria'] = $this->getCategoria();
            $producto['descripcion'] = $this->getDescripcion();
            $producto['envio'] = $this->getEnvio();
            $producto['fecha'] = $this->getFecha();
            $producto['descuento'] = $this->getDescuento();
            $producto['img'] = $this->getImg();
            $producto['vendido'] = $this->getVendido();

            return $producto;
        }
    }

?>
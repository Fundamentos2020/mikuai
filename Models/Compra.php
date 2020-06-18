<?php 

    class CompraException extends Exception {}


    class Compra {
        private $_id;
        private $_precio;
        private $_pago;
        private $_direccion;
        private $_id_usuario;

        public function __construct($id, $precio, $pago, $direccion, $id_usuario) {
            $this->setID($id);
            $this->setPrecio($precio);
            $this->setPago($pago);
            $this->setDireccion($direccion);
            $this->setIdUsuario($id_usuario);
        }

        public function getID() {
            return $this->_id;
        }

        public function getPrecio() {
            return $this->_precio;
        }

        public function getPago(){
            return $this->_pago;
        }

        public function getDireccion(){
            return $this->_direccion;
        }

        public function getIdUsuario() {
            return $this->_id_usuario;
        }



        //
        public function setID($id) {
            if ($id !== null && (!is_numeric($id) || $id <= 0 || $id >= 2147483647 || $this->_id !== null)) {
                throw new CompraException("Error en ID de la compra");
            }
            $this->_id = $id;
        }

        ///////////////////////Investigar valor maximo float
        public function setPrecio($precio) {
            if (!is_numeric($precio) || $precio <= 0 || $precio >= 2147483647) {
                throw new CompraException("Error en el precio de la compra");
            }
            $this->_precio = $precio;
        }

        //
        public function setPago($pago) {
            if (strtolower($pago) !== 'tarjeta' && strtolower($pago) !== 'cupon' && strtolower($pago) !== 'codigo') {
                throw new CompraException("Error en el tipo de pago de la compra");
            }
            $this->_pago = $pago;
        }
    
        //
        public function setDireccion($direccion) {
            if ($direccion !== null && strlen($direccion) > 100) {
                throw new CompraException("Error en direccion de la compra");
            }
            $this->_descripcion = $descripcion;
        }

        public function setIdUsuario($id_usuario) {
            
            $this->_id_usuario = $id_usuario;
        }



        public function getArray() {
            $compra = array();

            $compra['id'] = $this->getID();
            $compra['precio'] = $this->getPrecio();
            $compra['pago'] = $this->getPago();
            $compra['direccion'] = $this->getDireccion();
            $compra['id_usuario'] = $this->getIdUsuario();

            return $compra;
        }
    }

?>
var precioE = false;
var nombreE = false;
var envioE = false;
var descuentoE = false;
var categoriaE = false;
var descripcionE = false;
var imgE = false;

var _img;
var json = {};

function crtePrd(e) {
    e.preventDefault();
    document.getElementById('mserrT').innerHTML = ``;
    document.getElementById('mserr').innerHTML = ``;

    const xhr = new XMLHttpRequest();
    // Abrimos la conexion
    
    
    xhr.open('POST', api + "producto" , true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
        const prd = JSON.parse( this.responseText ) ;
        
        if(this.status === 200) {
            
            
          document.getElementById('msgtr').innerText = prd.messages;
    
          document.getElementById('btnedt').innerHTML = ``;

            
        } else if(this.status === 400  || this.status === 404 || this.status === 500){ 
            document.getElementById('mserr').innerText = prd.messages;
        }
    }

    
    if(nombreE) {
      _nombre = document.getElementById('nom').value;
      var aux = { nombre: _nombre };
      json = Object.assign(json,aux);
  }

  if(precioE){
      _precio = document.getElementById('precio').value;
      var aux = { precio: _precio };
      json = Object.assign(json,aux);
  }

  if(envioE) {
      _envio = document.getElementById('envio').value;
      var aux = { envio: _envio };
      json = Object.assign(json,aux);
  } 
  
  
    _descuento = document.getElementById('descuento').value;
    var aux = { descuento: _descuento };
    json = Object.assign(json,aux);

  if(categoriaE) {
      _categoria = document.getElementById('categoria').value;
      var aux = { categoria: _categoria };
      json = Object.assign(json,aux);
  }

  if(descripcionE){
      _descripcion = document.getElementById('descripcion').value;
      var aux = { descripcion: _descripcion };
      json = Object.assign(json,aux);
  }
  
  if(imgE){
      
      _img = _img.substring(_img.indexOf(",")+1,_img.length);

      var aux = { img: _img };
      
      json = Object.assign(json,aux);
  }
    

    var json_string = JSON.stringify(json);

    console.log(json_string);
    xhr.send(json_string);
}

function gImg(t){
    _img = t;
}

function read(callback) {
    var reader = new FileReader();
    imag = document.getElementById('seleccionArchivos').files[0];
    reader.readAsDataURL(imag);

    reader.onloadend = function() {
        callback(reader.result);
    };
  
    
}


function chngPrecio() {
  precioE = true;
}

function chngNombre() {
  nombreE = true;
}

function chngEnvio() {
  envioE = true;
}

function chngDescuento() {
  descuentoE = true;
}

function chngDescripcion() {
  descripcionE = true;
}

function chngCategoria() {
  categoriaE = true;
}

function changeImg(){

  imgE = true;
  const $seleccionArchivos = document.querySelector("#seleccionArchivos"),
  $imagenPrevisualizacion = document.querySelector("#primg");
  
    const archivos = $seleccionArchivos.files;
    if (!archivos || !archivos.length) {
        $imagenPrevisualizacion.src = "";
        return;
    }
    const primerArchivo = archivos[0];

    const objectURL = URL.createObjectURL(primerArchivo);

    $imagenPrevisualizacion.src = objectURL;

    read(gImg);
}
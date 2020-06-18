var precioE = false;
var nombreE = false;
var envioE = false;
var descuentoE = false;
var categoriaE = false;
var descripcionE = false;
var imgE = false;

var _img;
var json = {};

function searchBtPrdId(e) {
    e.preventDefault();
    document.getElementById('btnedt').innerHTML = ``;
    document.getElementById('mserrT').innerHTML = ``;
    document.getElementById('mserr').innerHTML = ``;

    const xhr = new XMLHttpRequest();
    // Abrimos la conexion
    t = document.getElementById('schrtxPrd').value;
    xhr.open('GET', api + "product/" + t , false);
    

    xhr.onload = function() {
        const prd = JSON.parse( this.responseText ) ;
        if(this.status === 200) {
            
            if(prd.data.total_registros > 0) {
                nome = "MiKuai | Editar" + prd.data.producto[0].nombre;
                document.getElementById('titleh').innerText = nome;
                // Generar el HTML
                
                document.getElementById('nom').value = prd.data.producto[0].nombre;
                document.getElementById('precio').value = prd.data.producto[0].precio;
                document.getElementById('envio').value = prd.data.producto[0].envio;
                document.getElementById('descuento').value = prd.data.producto[0].descuento;
                document.getElementById('categoria').value = prd.data.producto[0].categoria;
                document.getElementById('descripcion').value = prd.data.producto[0].descripcion;

                document.getElementById('primg').src = "data:image/*; base64, " + prd.data.producto[0].img;

                document.getElementById('btnedt').innerHTML = `<div class="usr usr-s btnemail" > <button onclick="edtPrd(event)" class="btn" href="">Editar producto</button> </div>`;
            }else {
                window.scrollTo(0,500);
                document.getElementById('mserrT').innerText = "El producto no existe";
            }
        }else if(this.status === 400) {
            document.getElementById('mserrT').innerText = prd.messages;
        }
    }
    
    // Enviar el Request
    xhr.send();
}



function edtPrd(e) {
    e.preventDefault();

    const xhr = new XMLHttpRequest();
    // Abrimos la conexion
    t = document.getElementById('schrtxPrd').value;
    xhr.open('PATCH', api + "product/" + t , true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
        const prd = JSON.parse( this.responseText ) ;
        
        if(this.status === 200) {
            
            
            nome = "MiKuai | Editar";
            document.getElementById('titleh').innerText = nome;
            // Generar el HTML
            document.getElementById('mserrT').innerHTML = ``;
            document.getElementById('mserr').innerHTML = ``;
            document.getElementById('btnedt').innerHTML = ``;


            document.getElementById('msgtr').innerText = prd.messages;



            
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
    
    if(descuentoE) {
        _descuento = document.getElementById('descuento').value;
        var aux = { descuento: _descuento };
        json = Object.assign(json,aux);
    }

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

function chngImg() {
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
function searchBtPrdId(e) {
    e.preventDefault();
    window.scrollTo(0, 0);

    const xhr = new XMLHttpRequest();
    // Abrimos la conexion
    t = document.getElementById('schrtxPrd').value;
    xhr.open('GET', api + "product/" + t , false);
    

    xhr.onload = function() {
        if(this.status === 200) {

            document.getElementById('primg').value = this.responseText; 
            
            const prd = JSON.parse( this.responseText ) ;
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
        }
    }
    
    // Enviar el Request
    xhr.send();
}
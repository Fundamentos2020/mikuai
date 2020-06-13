function SetTypeCl() {
    type = document.getElementById('userT').value;

    if(type === "administrador")
    {
        document.getElementById('usr').innerHTML = `
        <div class="pswrtxt  w-m-40 w-s-90" >

            <input placeholder="Clave" type="password">
            <div class="tooltip">?
                <span class="tooltiptext">Introduce clave para poder ser administrador.</span>
            </div>
        
        </div>
        `;
    }else{
        document.getElementById('usr').innerHTML = ``;
    }
}




function sentData(e) {
    e.preventDefault();

    console.log(api + "usuario");
    

    var xhttp = new XMLHttpRequest();

    
    xhttp.open('POST', api + "usuario", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onload = function() {
        if (this.status == 201) {
            var data = JSON.parse(this.responseText);

            if (data.success === true){
                localStorage.setItem('lprd_sesion', JSON.stringify(data.data));
                window.location.href = "index.html";
            }
        }
        else {
            var data = JSON.parse(this.responseText);

            document.getElementById('mserr').innerText = data;
        }
    };

    //var type = document.getElementById('userT').value;
    var type = "cliente";
    var nombre_usuario = document.getElementById('username').value;
    var contrasena = document.getElementById('password').value;
    var correo = document.getElementById('password').value;

    var json = { "nombre": nombre_usuario, "contrasena": contrasena, "email": correo, "rol": type};
    var json_string = JSON.stringify(json);
    
    xhttp.send(json_string);


}
function Log(e,t){
    e.preventDefault();

    emil = document.getElementById('email').value;

    console.log(emil);
    if(emil !== "") {
        //Eliminar "Continuar"
        t.remove();

        //Crar input 
        const psw = document.createElement('input');
        psw.placeholder = "Contraseña";
        psw.classList.add("usrtxt");
        psw.id = "psword";
        psw.type = "password";

        document.getElementById('pswrd').appendChild(psw);

        //Crear "Iniciar sesion"
        const btn = document.createElement('button');
        btn.classList.add("btn");
        btn.onclick = function(){LogIn(event)};
        btn.textContent = "Iniciar Sesión";

        document.getElementById('inss').appendChild(btn);

        //Quitar crear cuenta
        document.getElementById('ccbtn').remove();

        //Crear "Olvide mi contraseña"
        const btnss = document.createElement('button');
        btnss.classList.add("btn", "btncracta");
        btnss.textContent = "No sé mi contraseña";
        btnss.style = "width: 11em;";

        document.getElementById('cc').appendChild(btnss);
    }

}

function LogIn(e) {
e.preventDefault();

    document.getElementById('mserr').innerText = '';
    const xhr = new XMLHttpRequest();
    // Abrimos la conexion

    
    
    
    xhr.open('POST', api + "sesion" , true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
        const prd = JSON.parse( this.responseText ) ;
        
        if(this.status === 201) {
            localStorage.setItem('mikuai_sesion', JSON.stringify(prd.data));

            if(prd.data.rol == "Administrador")
                window.location.href = "/HTML/Escoge.html";
            else
                window.location.href = "/HTML/UsrView.html";
            
            
    
            
        } else{ 
            document.getElementById('mserr').innerText = prd.messages;
        }
    }

    emil = document.getElementById('email').value;
    pswr = document.getElementById('psword').value;

    json = { email: emil, contrasena: pswr};

    var json_string = JSON.stringify(json);
    xhr.send(json_string);
}


function lod() {
    var sesion = getSesion();

    console.log(sesion);

    if (sesion !== null) {
        if(sesion.rol == "Administrador")
                window.location.href = "/HTML/Escoge.html";
            else
                window.location.href = "/HTML/UsrView.html";
    }
}
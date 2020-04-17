

function password(e,t){
    e.preventDefault();
    
    //Eliminar "Continuar"
    t.remove();

    //Crar input 
    const psw = document.createElement('input');
    psw.placeholder = "Contraseña";
    psw.classList.add("usrtxt");
    psw.type = "password";

    document.getElementById('pswrd').appendChild(psw);

    //Crear "Iniciar sesion"
    const btn = document.createElement('button');
    btn.classList.add("btn");
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
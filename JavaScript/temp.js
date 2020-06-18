//
const api = "http://localhost:80/Proyecto/";
const client = "http://localhost:80/Proyecto/";

var pagAct = 1;
var cant = 10;
var cantPag = 0;
var cantPrd = 20;
var totalPrd = 0;

function getSesion() {
    var sesion = localStorage.getItem("mikuai_sesion");
    
    if (sesion != null && sesion != "")
    {
        var sesion_json = JSON.parse(sesion);

        return sesion_json;
    }
    
    return null;
}

function refreshToken() {
    var sesion = getSesion();

    if (sesion == null) {
        window.location.href = client;
    }

    var xhttp = new XMLHttpRequest();

    xhttp.open("PATCH", api + "sesiones/" + sesion.id_sesion, false);
    xhttp.setRequestHeader("Authorization", sesion.token_acceso);
    xhttp.setRequestHeader("Content-Type", "application/json");

    var json = { "token_actualizacion": sesion.token_actualizacion };
    var json_string = JSON.stringify(json);

    xhttp.send(json_string);

    var data = JSON.parse(xhttp.responseText);

    if (data.success === true){
        localStorage.setItem('mikuai_sesion', JSON.stringify(data.data));
        window.location.href = client;
    }
    else{
        alert(data.messages);
        window.location.href = client;
    }
}










//Boton pata volver arriba
function volvArriba(e) {
    e.preventDefault();
    window.scrollTo(0, 0);
}

//Muestra carrito de compras
function ShopCar(e,t) {
    e.preventDefault();

    showCar();

}

//Mostrar carrito
function showCar() {
    
    document.getElementById('Cshop').innerHTML = ``;

    //titulo
    const titl = document.createElement('div');
    titl.classList.add("tit", "col-m-10", "col-s-10");
    titl.innerText = "Carrito";
    //

    //botonx
    const x = document.createElement('button');
    x.classList.add("xm");
    x.innerText = "x";
    x.onclick = xm;
    
    const xx = document.createElement('div');
    xx.classList.add("col-m-2", "col-s-2");
    xx.appendChild(x);
    //

    //General
    const gen = document.createElement('div');
    gen.classList.add("row");
    
    gen.appendChild(titl);
    gen.appendChild(xx);
    //

    //principal
    const prn = document.createElement('div');
    prn.classList.add("car" , "w-m-car", "w-s-car");
    prn.appendChild(gen);
    //

    let prods = obtenerLocalSt();

    var tot = 0;
    var pay = false;

    const divscrll = document.createElement('div');
    divscrll.classList.add("scrll");

    prods.forEach(function(elm) {
        //prn.appendChild(elm);

        const xhr = new XMLHttpRequest();
        // Abrimos la conexion
        xhr.open('GET', api + "product/" + elm , false);
        

        xhr.onload = function() {
            if(this.status === 200) {
                const prd = JSON.parse( this.responseText ) ;

                pay = true;

                //img
                const ima = document.createElement('img');
                ima.src = "data:image/*; base64," + prd.data.producto[0].img;
                ima.classList.add("img-fluid", "carImg");

                const imag = document.createElement('div');
                imag.classList.add("col-m-2", "col-s-2");

                imag.appendChild(ima);
                //

                //text
                const txt = document.createElement('div');
                txt.classList.add("col-m-4", "col-s-4");
                txt.style="padding-left: 1em;";
                txt.innerText = `${prd.data.producto[0].nombre}`;
                //

                //Precio
                const price = document.createElement('div');
                if(prd.data.producto[0].descuento !== 0)
                {
                    price.innerText = `$${prd.data.producto[0].precio - (prd.data.producto[0].precio*(prd.data.producto[0].descuento/100))}`;
                    tot += prd.data.producto[0].precio - (prd.data.producto[0].precio*(prd.data.producto[0].descuento/100));
                }
                else {
                    price.innerText = `$${prd.data.producto[0].precio}`;
                    tot += prd.data.producto[0].precio;
                }
                price.classList.add("CarPrice");

                const pgen = document.createElement('div');
                pgen.classList.add("col-m-4", "col-s-4");
                pgen.appendChild(price);
                //

                //boton x
                const btn = document.createElement('button');
                btn.innerText = `x`;
                btn.classList.add("x");
                btn.onclick = function(){borrarPrd(event,elm)};
                const botn = document.createElement('div');
                botn.classList.add("col-m-2", "col-s-2");
                botn.appendChild(btn);
                //


                //div general
                const gen = document.createElement('div');
                gen.classList.add("row", "bt", "box");
                //

                //Agregar todo a div gen
                gen.appendChild(imag);
                gen.appendChild(txt);
                gen.appendChild(pgen);
                gen.appendChild(botn);

                //link
                const adiv = document.createElement('a');
                adiv.href = "";
                //adiv.onclick = function(){viewProd(prd.data.producto[0].id)};
                adiv.appendChild(gen);
                //

                divscrll.appendChild(adiv);

            }
        }

        xhr.send();
    
    });

    prn.appendChild(divscrll);


    if(pay)
    {
        const dpag = document.createElement('div');
        dpag.innerHTML = 'Total';
        dpag.classList.add("CarPrice", "col-m-3", "col-s-3");

        const dots = document.createElement('div');
        dots.innerHTML = `.............`;
        dots.classList.add("CarPrice", "col-m-3", "col-s-3");


        const price = document.createElement('div');
        price.innerText = `$` + tot;
        price.classList.add("CarPrice", "col-m-4", "col-s-4");

        const btnp = document.createElement('button');
        btnp.innerHTML = `Pagar`;
        btnp.onclick =irCompras;
        btnp.classList.add("btn", "btnpag", "col-m-2", "col-s-2");

        const dpagg = document.createElement('div');
        dpagg.classList.add("row", "DivPrice", "dvprc-m", "dvprc-s");

        dpagg.appendChild(dpag);
        dpagg.appendChild(dots);
        dpagg.appendChild(price);
        dpagg.appendChild(btnp);



        prn.appendChild(dpagg);
    }


    document.getElementById('Cshop').appendChild(prn);


}

//Quita carrito de compras
function xm(e,t) {
    e.preventDefault();

    document.getElementById('Cshop').innerHTML = ``;
}

//Agrega al carrito de compras
function addCar(e,t) {
    e.preventDefault();

    agregarLocalSt(t);

    showCar();
}

//Agregar elemento a Local Storage
function agregarLocalSt(elem) {
    var elems = obtenerLocalSt();

    //Añadir el nuevo tweet
    if(!elems.includes(elem))
        elems.push(elem);
    //Convertir a string a arreglo para ls
    localStorage.setItem('elems', JSON.stringify(elems));
    //localStorage.setItem('elems', elems)

}


//Obtener los elementos de Local Storage
function obtenerLocalSt() {
    var elems;

    //Checar valores de local storage
    if(localStorage.getItem('elems') === null) {
        elems = [];
    } else {
        elems = JSON.parse(localStorage.getItem('elems'));
    }
    return elems;
}

//Eliminar elemento de Local Storage 
function borrarTeetLs(elemtBr) {
    var elems;
    
    elems = obtenerLocalSt();

    const index = elems.indexOf(elemtBr);
    if (index > -1) {
        elems.splice(index, 1);
    }

    localStorage.setItem('elems', JSON.stringify(elems))

    showCar();

    // elems.forEach(function(elem, index) {
    //     console.log(elem);
    //     if(elemtBr === elem) {
            
    //         elems.splice(index, 1);
    //     }
    // });

    localStorage.setItem("elems", JSON.stringify(elems));
}

//Eliminar elemento
function borrarPrd(e,t) {
    e.preventDefault();

    borrarTeetLs(t);
}

function borrarPrdct(e,t) {
    location.reload();
    borrarTeetLs(t);
}


function irCompras(e){
    e.preventDefault();

    window.location.href='/HTML/Pagar.html';
}


function compras() {


    let prods = obtenerLocalSt();

    const divscrll = document.createElement('div');
    divscrll.classList.add("scrllp");
    var tot = 0;
    var env = 0;
    var des = 0;

    prods.forEach(function(elm) {
        //prn.appendChild(elm);

        const xhr = new XMLHttpRequest();
        // Abrimos la conexion
        xhr.open('GET', api + "product/" + elm , false);
        

        xhr.onload = function() {
            if(this.status === 200) {
                const prd = JSON.parse( this.responseText ) ;

                pay = true;

                //img
                const ima = document.createElement('img');
                ima.src = "data:image/*; base64," + prd.data.producto[0].img;
                ima.classList.add("img-fluid", "carImg");

                const imag = document.createElement('div');
                imag.classList.add("col-m-2", "col-s-2");

                imag.appendChild(ima);
                //

                //text
                const txt = document.createElement('div');
                txt.classList.add("col-m-4", "col-s-4");
                txt.style="padding-left: 1em;";
                txt.innerText = `${prd.data.producto[0].nombre}`;
                //

                //Precio
                const price = document.createElement('div');
                if(prd.data.producto[0].descuento !== 0)
                {
                    price.innerText = `$${prd.data.producto[0].precio - (prd.data.producto[0].precio*(prd.data.producto[0].descuento/100))}`;
                    tot += prd.data.producto[0].precio - (prd.data.producto[0].precio*(prd.data.producto[0].descuento/100));
                }
                else {
                    price.innerText = `$${prd.data.producto[0].precio}`;
                    tot += prd.data.producto[0].precio;
                }
                price.classList.add("CarPrice");

                const pgen = document.createElement('div');
                pgen.classList.add("col-m-4", "col-s-4");
                pgen.appendChild(price);
                //

                //boton x
                const btn = document.createElement('button');
                btn.innerText = `x`;
                btn.classList.add("x");
                btn.onclick = function(){borrarPrdct(event,elm)};
                const botn = document.createElement('div');
                botn.classList.add("col-m-2", "col-s-2");
                botn.appendChild(btn);
                //


                //div general
                const gen = document.createElement('div');
                gen.classList.add("row", "bt", "box");
                //

                //Agregar todo a div gen
                gen.appendChild(imag);
                gen.appendChild(txt);
                gen.appendChild(pgen);
                gen.appendChild(botn);

                //link
                const adiv = document.createElement('div');
                adiv.href = "Producto.html";
                adiv.appendChild(gen);
                //

                divscrll.appendChild(adiv);

                env += prd.data.producto[0].envio;
                des += prd.data.producto[0].descuento;

            }
        }

        xhr.send();
    });

    document.getElementById('comprass').appendChild(divscrll);

    let inht = `
            <div style="font-size: 1.5em;" class="atxt">Resumen de la compra</div>
            <div style="margin: 1.5em 0.5em 1em 2em;" class="ntxt">Descripcion *********</div>

        <div style="margin: 1.5em 0.5em 1em 2em; font-weight: bold; font-size: 1.5em; " class="ntxt">Productos ........... $${tot}</div>

        <div style="margin: 1.5em 0.5em 1em 2em; font-weight: bold; font-size: 1.5em; " class="ntxt">Envio ................... $${env}</div>

        <div style="margin: 1.5em 0.5em 1em 2em; font-weight: bold; font-size: 1.5em; " class="ntxt">Descuento .......... $${des}</div>

        <div style="margin: 1.5em 0.5em 1em 2em; font-weight: bold; font-size: 1.5em; " class="ntxt">Total a pagar ...... $${tot + env - des}</div>
    
    `;

    document.getElementById('totpag').innerHTML = inht;

}



//Cargar Productos
function LoadProducts() {
    const xhr = new XMLHttpRequest();
    window.scrollTo(0, 0);
    // Abrimos la conexion
    xhr.open('GET', api + "producto/cont/" + pagAct , false);
    

    xhr.onload = function() {
        if(this.status === 200) {
            const prd = JSON.parse( this.responseText ) ;

            // Generar el HTML
            let htmlPrd = ``;
            
            let totalPrdu = prd.data.total_registros;
            totalPrd = totalPrdu;

            let numPagi = Math.floor(totalPrd/cantPrd);
            cantPag = numPagi;
            
            // Imprimir cada img
            prd.data.productos.forEach(function loop(prod) {
                    htmlPrd += `
                    
                    <div style="padding: 1em;" class="w-s-100 w-m-33">
            
                        <div class="bxprdct">

                            <div class = "product" > <a href=" " onclick="loadProducto(event,${prod.id})" > 
                                <img src="data:image/*; base64,${prod.img}" alt=""> </a> 
                            </div>

                            <div class="pdimfo">
                                <div style="font-size: 2em; margin-top: 1em;">
                                    ${prod.nombre}
                                </div>
                                <div style="font-size: 1.5em;">
                                    $${prod.precio}
                                </div>
                                <div style="height: 2.5em; overflow:hidden; text-overflow:ellipsis;">
                                    ${prod.descripcion}
                                </div>
                            </div>
                
                            <div class="row">
                                <div class="col-m-5 col-s-5 btnbox margin-top: 1em;" >
                                    <a onclick="cpmrProdcts(event,${prod.id})" class="btn btncomprar" href="">Comprar</a>
                                </div>
                                <div class="col-m-7 col-s-7 btnbox" >
                                    <a onclick="addCar(event,${prod.id})" class="btn btncarrito" href="">Agregar al carrito</a>
                                </div>
                
                            </div>
                        </div>

                    </div>
                    
                    `;
            })

            document.getElementById('arts').innerHTML = htmlPrd;
        }
    }
    
    // Enviar el Request
    xhr.send();
    cargPag();
}

//Cargar paginacion
function cargPag(){
    // Generar el HTML
    let htmlPg = '';

    if(cantPag >= 1)
    {
        htmlPg += `<a onclick="ChangePage(event)"; class="pgna" href="">${"Anterior"}</a>
                    `;
    }

    for(let i=0; i <= cantPag ; i++)
    {
        if((i+1).toString() === pagAct.toString())
            htmlPg += `<a onclick="ChangePage(event)"; class="asel" href="">${i+1}</a>
                      `;
        else
            htmlPg += `<a onclick="ChangePage(event)"; class="pgna" href="">${i+1}</a>
                      `;
    }
    if(cantPag >= 1)
    {
        htmlPg += `<a onclick="ChangePage(event)"; class="pgna" href="">${"Siguiente"}</a>
                    `;
    }

    document.getElementById('ipgn').innerHTML = htmlPg;
}

//Cambiar de pagina
function ChangePage(e) {
    e.preventDefault();

    window.scrollTo(0, 0); 


    let t = e.toElement.text;
    if(t === "Siguiente")
    {    
        if(parseInt(pagAct)+1 <= cantPag+1)
            pagAct++;
    }
    else
    {
        if(t === "Anterior")
        {
            if(parseInt(pagAct)-1  >= 0)
                pagAct--;
        }
        else
        {
            pagAct = t; 
        }
    }   
    LoadProducts();
}

//Moestrar producto


function loadProducto(e,t) {
    e.preventDefault();

    viewProd(t);
}

//visualizar producto y atras
function viewProd(t){
    window.scrollTo(0, 0);
    document.getElementById('arts').innerHTML = ``;

    document.getElementById('ipgn').innerHTML = ``;

    document.getElementById('btnatrs').innerHTML = `
    <div class="row pdconten pdconten-m" >

        <div style="width: 100%;" class="row">

            <div style="padding-left: 0.5em;  margin-top: 1em;" class="col-m-2 col-s-12">
                <button onclick="atras(event)" class="btn btnatras">Atras</button>
            </div>

        </div>
    </div>
    `;


    const xhr = new XMLHttpRequest();
    // Abrimos la conexion
    xhr.open('GET', api + "product/" + t , false);
    

    xhr.onload = function() {
        if(this.status === 200) {
            const prd = JSON.parse( this.responseText ) ;
            nome = "MiKuai | " + prd.data.producto[0].nombre;
            document.getElementById('titleh').innerText = nome;
            // Generar el HTML
            let htmlPrd = ``;
            
            // Imprimir cada img
            
                    htmlPrd += `
        <div style="padding: 5em 0 10em 0;" class="contn" id="contnprd">
            <div class="about w-s-50 w-m-50">

                <div class="atxt" style="font-size: 3em; margin-top: 1em; margin-left: 0.5em;">${prd.data.producto[0].nombre}</div>

                <div class="atxt" style="font-size: 2em; margin-left: 1.5em; font-style: oblique;">${prd.data.producto[0].categoria}</div>

                <div style="margin-bottom: 2em;" class="contn contn-s">
                    <img class="foto w-s-45 w-m-45 m-r" src="data:image/*; base64,${prd.data.producto[0].img}" alt="">

                    <!-- Info -->
                    <div class="infp w-m-txt w-s-txt">

                        <div style="font-weight: bold; font-size: 2em; margin-top: 2em; margin-bottom: 1em;">$${prd.data.producto[0].precio}</div>

                        <div style="font-weight: bold; font-size: 1.2em;">Precio de envio $${prd.data.producto[0].envio}</div>

                        <div>
                            ${prd.data.producto[0].descripcion}
                        </div>

                        <div style="margin-top: 3em;" class="row">
                            <div class="col-m-5 col-s-5 btnbox" >
                                <a onclick="cpmrProd(event,${prd.data.producto[0].id})" class="btn btncomprar" href="">Comprar</a>
                            </div>
                            <div class="col-m-7 col-s-7 btnbox" >
                                <a onclick="addCar(event,${prd.data.producto[0].id})" class="btn btncarrito" href="">Agregar al carrito</a>
                            </div>
            
                        </div>

                    </div>

                </div>

            </div>
        </div>
                    
                    
                    `;
            

            document.getElementById('contnprd').innerHTML = htmlPrd;
        }
    }
    
    // Enviar el Request
    xhr.send();
}

function atras(e) {
    e.preventDefault();
    document.getElementById('btnatrs').innerHTML = ``;
    document.getElementById('contnprd').innerHTML = ``;
    document.getElementById('titleh').innerText = "MiKuai";
    LoadProducts();
}

//visualizar compra y atras
function atrasC(e,t) {
    e.preventDefault();
    document.getElementById('btnatrs').innerHTML = ``;
    document.getElementById('contnprd').innerHTML = ``;
    document.getElementById('pagrprd').innerHTML = ``;
    document.getElementById('titleh').innerText = "MiKuai";
    viewProd(t);
}

function cpmrProd(e,t){

    e.preventDefault();

    document.getElementById('contnprd').innerHTML = ``;

    document.getElementById('arts').innerHTML = ``;

    document.getElementById('ipgn').innerHTML = ``;

    document.getElementById('btnatrs').innerHTML = `
    <div class="row pdconten pdconten-m" >

        <div style="width: 100%;" class="row">

            <div style="padding-left: 0.5em;  margin-top: 1em;" class="col-m-2 col-s-12">
                <button onclick="atrasC(event,${t})" class="btn btnatras">Cancelar</button>
            </div>

        </div>
    </div>
    `;

    e.preventDefault();
    window.scrollTo(0, 0);
    const xhr = new XMLHttpRequest();
    // Abrimos la conexion
    xhr.open('GET', api + "product/" + t , false);
    

    xhr.onload = function() {
        if(this.status === 200) {
            const prd = JSON.parse( this.responseText ) ;
            nome = "MiKuai | " + " Pagar " + prd.data.producto[0].nombre;
            document.getElementById('titleh').innerText = nome;
            // Generar el HTML
            let htmlPrd = ``;
            
            // Imprimir cada img
            
                    htmlPrd += `

        <div style="padding: 5em 0 10em 0;" class="contn" id="pagrprd">
            <div class="pgn w-s-pgn w-m-pgn">
                
                <div style="font-size: 3em; width: 90%;" class="atxt">Pagar</div>

                <div class="row">

                    <div class="col-m-7 row">
                        
                        <div style="font-size: 1.5em;" class="atxt col-m-12 col-s-12">Tus Datos</div>

                        <div style="font-size: 1em; margin: 1.5em 0.5em 1em 2em;" class="ntxt">qwerty@example.com</div>

                        <div style="font-size: 1em; margin: 1.5em 0.5em 3em 2em;" class="ntxt">Nombre</div>


                        <div style="font-size: 1.5em;" class="atxt">Producto</div>


                        <div class="atxt" style="font-size: 2em; margin-top: 1em; margin-left: 0.5em;">${prd.data.producto[0].nombre}</div>

                        <div class="atxt" style="font-size: 1em; margin-left: 1.5em; font-style: oblique;">${prd.data.producto[0].categoria}</div>
        
                        <div style="margin-bottom: 1em;" class="contn contn-s">
                            <img class="foto w-s-45 w-m-45 m-r" src="data:image/*; base64,${prd.data.producto[0].img}" alt="">
        
                            <!-- Info -->
                            <div style="padding-left: 0.5em;" class="infp w-m-txt w-s-txt">
        
                                <div style="font-weight: bold; font-size: 1em; margin-top: 2em; margin-bottom: 1em;">$${prd.data.producto[0].precio}</div>
        
                                <div style="font-weight: bold; font-size: 0.8em;">Precio de envio $${prd.data.producto[0].envio}</div>
        
                                <div>
                                    ${prd.data.producto[0].descripcion}
                                </div>
                            </div>

                        </div>

                    </div>

                    <div class="col-m-5" id="totpag" >

                        <div style="font-size: 1.5em;" class="atxt">Resumen de la compra</div>

                        <div style="margin: 1.5em 0.5em 1em 2em;" class="ntxt">Descripcion *********</div>

                        <div style="margin: 1.5em 0.5em 1em 2em; font-weight: bold; font-size: 1.5em; " class="ntxt">Producto ........... $${prd.data.producto[0].precio}</div>

                        <div style="margin: 1.5em 0.5em 1em 2em; font-weight: bold; font-size: 1.5em; " class="ntxt">Envio ................. $${prd.data.producto[0].envio}</div>

                        <div style="margin: 1.5em 0.5em 1em 2em; font-weight: bold; font-size: 1.5em; " class="ntxt">Descuento ........ $${prd.data.producto[0].precio * (prd.data.producto[0].descuento /100)}</div>

                        <div style="margin: 1.5em 0.5em 1em 2em; font-weight: bold; font-size: 1.5em; " class="ntxt">Total a pagar .... $${prd.data.producto[0].precio + prd.data.producto[0].envio - (prd.data.producto[0].precio * (prd.data.producto[0].descuento /100))}</div>


                        

                            <div style="width: 100%;" class="row">

                                <div style="padding-left: 0.5em;  margin-top: 1em;" class=" col-m-12 col-s-12">
                                    <button onclick="pagar(event,${t},${prd.data.producto[0].precio + prd.data.producto[0].envio - (prd.data.producto[0].precio * (prd.data.producto[0].descuento /100))})" class="btn btnatras">Pagar</button>
                                </div>

                            </div>
                        
                    </div>
                    
                
                </div>

                

            </div>
        </div>  
                    
                    `;
            

            document.getElementById('pagrprd').innerHTML = htmlPrd;
        }
    }
    
    // Enviar el Request
    xhr.send();
}

//visualizar compra de prds y atras
function cpmrProdcts(e,t){

    e.preventDefault();

    document.getElementById('contnprd').innerHTML = ``;

    document.getElementById('arts').innerHTML = ``;

    document.getElementById('ipgn').innerHTML = ``;

    document.getElementById('btnatrs').innerHTML = `
    <div class="row pdconten pdconten-m" >

        <div style="width: 100%;" class="row">

            <div style="padding-left: 0.5em;  margin-top: 1em;" class="col-m-2 col-s-12">
                <button onclick="atrasCPrdcts(event,${t})" class="btn btnatras">Cancelar</button>
            </div>

        </div>
    </div>
    `;

    e.preventDefault();
    window.scrollTo(0, 0);
    const xhr = new XMLHttpRequest();
    // Abrimos la conexion
    xhr.open('GET', api + "product/" + t , false);
    

    xhr.onload = function() {
        if(this.status === 200) {
            const prd = JSON.parse( this.responseText ) ;
            nome = "MiKuai | " + " Pagar " + prd.data.producto[0].nombre;
            document.getElementById('titleh').innerText = nome;
            // Generar el HTML
            let htmlPrd = ``;
            
            // Imprimir cada img
            
                    htmlPrd += `

        <div style="padding: 5em 0 10em 0;" class="contn" id="pagrprd">
            <div class="pgn w-s-pgn w-m-pgn">
                
                <div style="font-size: 3em; width: 90%;" class="atxt">Pagar</div>

                <div class="row">

                    <div class="col-m-7 row">
                        
                        <div style="font-size: 1.5em;" class="atxt col-m-12 col-s-12">Tus Datos</div>

                        <div style="font-size: 1em; margin: 1.5em 0.5em 1em 2em;" class="ntxt">qwerty@example.com</div>

                        <div style="font-size: 1em; margin: 1.5em 0.5em 3em 2em;" class="ntxt">Nombre</div>


                        <div style="font-size: 1.5em;" class="atxt">Producto</div>


                        <div class="atxt" style="font-size: 2em; margin-top: 1em; margin-left: 0.5em;">${prd.data.producto[0].nombre}</div>

                        <div class="atxt" style="font-size: 1em; margin-left: 1.5em; font-style: oblique;">${prd.data.producto[0].categoria}</div>
        
                        <div style="margin-bottom: 1em;" class="contn contn-s">
                            <img class="foto w-s-45 w-m-45 m-r" src="data:image/*; base64,${prd.data.producto[0].img}" alt="">
        
                            <!-- Info -->
                            <div style="padding-left: 0.5em;" class="infp w-m-txt w-s-txt">
        
                                <div style="font-weight: bold; font-size: 1em; margin-top: 2em; margin-bottom: 1em;">$${prd.data.producto[0].precio}</div>
        
                                <div style="font-weight: bold; font-size: 0.8em;">Precio de envio $${prd.data.producto[0].envio}</div>
        
                                <div>
                                    ${prd.data.producto[0].descripcion}
                                </div>
                            </div>

                        </div>

                    </div>

                    <div class="col-m-5" id="totpag" >

                        <div style="font-size: 1.5em;" class="atxt">Resumen de la compra</div>

                        <div style="margin: 1.5em 0.5em 1em 2em;" class="ntxt">Descripcion *********</div>

                        <div style="margin: 1.5em 0.5em 1em 2em; font-weight: bold; font-size: 1.5em; " class="ntxt">Producto ........... $${prd.data.producto[0].precio}</div>

                        <div style="margin: 1.5em 0.5em 1em 2em; font-weight: bold; font-size: 1.5em; " class="ntxt">Envio ................. $${prd.data.producto[0].envio}</div>

                        <div style="margin: 1.5em 0.5em 1em 2em; font-weight: bold; font-size: 1.5em; " class="ntxt">Descuento ........ $${prd.data.producto[0].precio * (prd.data.producto[0].descuento /100)}</div>

                        <div style="margin: 1.5em 0.5em 1em 2em; font-weight: bold; font-size: 1.5em; " class="ntxt">Total a pagar .... $${prd.data.producto[0].precio + prd.data.producto[0].envio - (prd.data.producto[0].precio * (prd.data.producto[0].descuento /100))}</div>
                        
                    </div>
                    
                
                </div>

                

            </div>
        </div>  
                    
                    `;
            

            document.getElementById('pagrprd').innerHTML = htmlPrd;
        }
    }
    
    // Enviar el Request
    xhr.send();
}

function atrasCPrdcts(e,t) {
    e.preventDefault();
    document.getElementById('btnatrs').innerHTML = ``;
    document.getElementById('contnprd').innerHTML = ``;
    document.getElementById('pagrprd').innerHTML = ``;
    document.getElementById('titleh').innerText = "MiKuai";
    LoadProducts();
}

//Funcion de busqueda
function searchbt(e) {
    e.preventDefault();
    src = document.getElementById('schrtx').value;
    window.location.href = client + '/HTML/index.php?src=' + src;
}


function pagar(e,t,p){
    e.preventDefault();

    var sesion = getSesion();

    

    if (sesion !== null) {

        const xhr = new XMLHttpRequest();
        // Abrimos la conexion
        xhr.open('POST', api + "compr", true);

        json = { id: sesion.id, precio: p}
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function() {
            if(this.status === 200) {
                const prd = JSON.parse( this.responseText ) ;

                const xhrP = new XMLHttpRequest();
                // Abrimos la conexion
                xhrP.open('POST', api + "comprd", true);

                json = { id: t, id_compra: prd.data.ID}
                xhrP.setRequestHeader("Content-Type", "application/json");
                xhrP.onload = function() {
                    if(this.status === 200) {
                        const copr = JSON.parse( this.responseText ) ;
                        console.log(copr);

                    }
                }
                var json_string = JSON.stringify(json);
                xhrP.send(json_string);

            }
        }

        var json_string = JSON.stringify(json);
        xhr.send(json_string);
    } else {
        window.location.href = "/HTML/LogIn.html";
    }
}
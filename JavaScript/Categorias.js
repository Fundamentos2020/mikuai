var nom; 

var pagAct = 1;
var cant = 10;
var cantPag = 0;
var cantPrd = 20;
var totalPrd = 0;

function titlet(e,t) {
    e.preventDefault();
    
    nom = t.innerText;

    aux();

    //window.location.href='/Categoria.html';
}

function aux(){

    nome = "MiKuai | " + nom;
    document.getElementById('titleh').innerText = nome;

    document.getElementById('contp').innerHTML = ' ';

    document.getElementById('prodc').innerHTML = `
    <div class="row pdconten pdconten-m" >

        <div style="width: 100%;" class="row">

            <div style="padding-left: 0.5em;  margin-top: 1em;" class="col-m-2 col-s-12">
                <button onclick="atrasC(event)" class="btn btnatras">Atras</button>
            </div>

        </div>
    </div>
    `;

    LoadProductsCat(nom);
}

function atrasC(e) {
    e.preventDefault();


    document.getElementById('titleh').innerText = "MiKuai | Categorias";

    document.getElementById('ipgn').innerHTML = ``;

    document.getElementById('prodc').innerHTML = ``;
    
    document.getElementById('arts').innerHTML = ``;

    document.getElementById('contp').innerHTML = ` 
    <div class="contp">
        <div class="row">

            <div style="float: left;" class="w-m-35 w-s-50c">
                <div class="cat">

                    <img class="imgc" src="https://picsum.photos/300/200" alt="">

                    <a onclick="titlet(event,this)" class="txtc" href=""> Automoviles </a>

                </div>
            </div>

            <div style="float: left;" class="w-m-20 w-s-50c">
                <div class="cat">

                    <img class="imgc" src="https://picsum.photos/300/200" alt="">

                    <a onclick="titlet(event,this)" class="txtc" href=""> Tecnologia </a>

                </div>
            </div>

            <div style="float: left;" class="w-m-15 w-s-30">
                <div class="cat">

                <img class="imgc" src="https://picsum.photos/300/200" alt="">

                <a onclick="titlet(event,this)" class="txtc" href=""> Hogar </a>

                </div>
            </div>

            <div style="float: left;" class="w-m-30 w-s-70">
                <div class="cat">

                    <img class="imgc" src="https://picsum.photos/300/200" alt="">

                    <a onclick="titlet(event,this)" class="txtc" href=""> Helectrodomesticos </a>

                </div>
            </div>

        </div>

        <div class="row">

            <div style="float: left;" class="w-m-15 w-s-40">
                <div class="cat">

                    <img class="imgc" src="https://picsum.photos/300/200" alt="">
        
                    <a onclick="titlet(event,this)" class="txtc" href=""> Joyas </a>
        
                </div>
            </div>
            
            <div style="float: left;" class=" w-m-35 w-s-60">
                <div class="cat">

                    <img class="imgc" src="https://picsum.photos/300/200" alt="">

                    <a onclick="titlet(event,this)" class="txtc" href=""> Herramientas </a>



                </div>
            </div>

            <div style="float: left;" class="w-m-30 w-s-55">
                <div class="cat">

                    <img class="imgc" src="https://picsum.photos/300/200" alt="">

                    <a onclick="titlet(event,this)" class="txtc" href=""> Videojuegos </a>

                </div>
            </div>

            <div style="float: left;" class="w-m-20 w-s-45c">
                <div class="cat">

                    <img class="imgc" src="https://picsum.photos/300/200" alt="">

                    <a onclick="titlet(event,this)" class="txtc" href=""> Libros </a>

                </div>
            </div>

            
        </div>

        <div class="row">

            <div style="float: left;" class="w-m-30 w-s-60">
                <div class="cat">

                    <img class="imgc" src="https://picsum.photos/300/200" alt="">

                    <a onclick="titlet(event,this)" class="txtc" href=""> Software </a>

                </div>
            </div>

            <div style="float: left;" class="w-m-25 w-s-40">
                <div class="cat">
        
                    <img class="imgc" src="https://picsum.photos/300/200" alt="">
        
                    <a onclick="titlet(event,this)" class="txtc" href=""> Ropa </a>
        
                </div>
            </div>

            <div style="float: left;" class="w-m-20 w-s-45c">
                <div class="cat">
        
                    <img class="imgc" src="https://picsum.photos/300/200" alt="">
        
                    <a onclick="titlet(event,this)" class="txtc" href=""> Juguetes </a>
        
                </div>
            </div>

            <div style="float: left;" class="w-m-25 w-s-55">
                <div class="cat">

                    <img class="imgc" src="https://picsum.photos/300/200" alt="">

                    <a onclick="titlet(event,this)" class="txtc" href=""> Inmuebles </a>

                </div>
            </div>

        </div>

    </div>
    `;
}

function LoadProductsCat(cat) {
    const xhr = new XMLHttpRequest();

    // Abrimos la conexion
    xhr.open('GET', api + "producto/categoria/" + cat + "/" + pagAct, true);
    

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
            prd.data.productos.forEach(function(prod) {
                    htmlPrd += `
                    
                    <div style="padding: 1em;" class="w-s-100 w-m-33">
            
                        <div class="bxprdct">

                            <div class = "product" > <a href=" " onclick="loadProductoCat(event,${prod.id})" > <img src="data:image/*; base64,${prod.img}" alt=""> </a> </div>

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
                                    <a onclick="cpmrProdCat(event,${prod.id})" class="btn btncomprar" href="">Comprar</a>
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
    cargPagCat();
    
}


function cargPagCat(){
    // Generar el HTML
    let htmlPg = '';

    if(cantPag >= 1)
    {
        htmlPg += `<a onclick="ChangePageCat(event)"; class="pgna" href="">${"Anterior"}</a>
                    `;
    }

    for(let i=0; i <= cantPag ; i++)
    {
        if((i+1).toString() === pagAct.toString())
            htmlPg += `<a onclick="ChangePageCat(event)"; class="asel" href="">${i+1}</a>
                      `;
        else
            htmlPg += `<a onclick="ChangePageCat(event)"; class="pgna" href="">${i+1}</a>
                      `;
    }
    if(cantPag >= 1)
    {
        htmlPg += `<a onclick="ChangePageCat(event)"; class="pgna" href="">${"Siguiente"}</a>
                    `;
    }

    document.getElementById('ipgn').innerHTML = htmlPg;
}

//Cambiar de pagina
function ChangePageCat(e) {
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
    LoadProductsCat();
}

//Moestrar producto
function loadProductoCat(e,t) {
    e.preventDefault();
    window.scrollTo(0, 0);

    document.getElementById('prodc').innerHTML = ``;

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

                <div class="atxt" style="font-size: 2em; margin-left: 1em;">${prd.data.producto[0].categoria}</div>

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
                                <a onclick="cpmrProdCat(event,${prd.data.producto[0].id})" class="btn btncomprar" href="">Comprar</a>
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
    document.getElementById('titleh').innerText = "MiKuai | Categorias";
    aux();
}

function atrasCCat(e) {
    e.preventDefault();
    document.getElementById('btnatrs').innerHTML = ``;
    document.getElementById('contnprd').innerHTML = ``;
    document.getElementById('pagrprd').innerHTML = ``;
    document.getElementById('titleh').innerText = "MiKuai";
    aux();
}

function cpmrProdCat(e,t){

    e.preventDefault();
    
    document.getElementById('prodc').innerHTML = ``;

    document.getElementById('contnprd').innerHTML = ``;

    document.getElementById('arts').innerHTML = ``;

    document.getElementById('ipgn').innerHTML = ``;

    document.getElementById('btnatrs').innerHTML = `
    <div class="row pdconten pdconten-m" >

        <div style="width: 100%;" class="row">

            <div style="padding-left: 0.5em;  margin-top: 1em;" class="col-m-2 col-s-12">
                <button onclick="atrasCCat(event)" class="btn btnatras">Cancelar</button>
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
                        
                        <div style="font-size: 1.5em;" class="atxt col-m-12">Tus Datos</div>

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
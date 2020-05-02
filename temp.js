//document.querySelector('.vlvarriba').addEventListener('click',volvArriba(event));

// General

//Boton pata volver arriba
function volvArriba(e) {
    e.preventDefault();
    console.log(e);
    window.scrollTo(0, 0);
}

function Producto(e) {
    e.preventDefault();
    window.location.href='/Producto.html';
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

    
    var pay = false;

    const divscrll = document.createElement('div');
    divscrll.classList.add("scrll");

    prods.forEach(function(elm) {
        //prn.appendChild(elm);

        pay = true;

        //img
        const ima = document.createElement('img');
        ima.src = "https://picsum.photos/id/1/80/80";
        ima.classList.add("img-fluid");

        const imag = document.createElement('div');
        imag.classList.add("col-m-2", "col-s-2");

        imag.appendChild(ima);
        //

        //text
        const txt = document.createElement('div');
        txt.classList.add("col-m-4", "col-s-4");
        txt.innerText = `Lorem ipsum dolor sit`;
        //

        //Precio
        const price = document.createElement('div');
        price.innerText = `$000,00`;
        price.classList.add("CarPrice");

        const pgen = document.createElement('div');
        pgen.classList.add("col-m-4", "col-s-4");
        pgen.appendChild(price);
        //

        //boton x
        const btn = document.createElement('button');
        btn.innerText = `x`;
        btn.classList.add("x");
        btn.onclick = borrarPrd;
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
        adiv.href = "Producto.html";
        adiv.appendChild(gen);
        //

        divscrll.appendChild(adiv);
    });

    prn.appendChild(divscrll);


    if(pay)
    {
        const dpag = document.createElement('div');
        dpag.innerHTML = `Total`;
        dpag.classList.add("CarPrice", "col-m-3", "col-s-3");

        const dots = document.createElement('div');
        dots.innerHTML = `.....................................`;
        dots.classList.add("CarPrice", "col-m-3", "col-s-3");


        const price = document.createElement('div');
        price.innerText = `$000,00`;
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
    
    const adiv = "elem";

    agregarLocalSt(adiv);

    showCar();
}




//Agregar elemento a Local Storage
function agregarLocalSt(elem) {
    let elems = obtenerLocalSt();

    //Añadir el nuevo tweet
    elems.push(elem);

    //Convertir a string a arreglo para ls
    //localStorage.setItem('elems', JSON.stringify(elems))
    localStorage.setItem('elems', JSON.stringify(elems))

}


//Obtener los elementos de Local Storage
function obtenerLocalSt() {
    let elems;

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
    let elems;
    
    elems = obtenerLocalSt();

    elems.pop();

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

    e.path[3].remove();

    borrarTeetLs(e.path[3].innerHTML);
}


function irCompras(e){
    e.preventDefault();

    window.location.href='/Pagar.html';
}


function compras() {


    let prods = obtenerLocalSt();

    const divscrll = document.createElement('div');
    divscrll.classList.add("scrllp");

    prods.forEach(function(elm) {
        //prn.appendChild(elm);

        pay = true;

        //img
        const ima = document.createElement('img');
        ima.src = "https://picsum.photos/id/1/80/80";
        ima.classList.add("img-fluid");

        const imag = document.createElement('div');
        imag.classList.add("col-m-2", "col-s-2");

        imag.appendChild(ima);
        //

        //text
        const txt = document.createElement('div');
        txt.classList.add("col-m-4", "col-s-4");
        txt.innerText = `Lorem ipsum dolor sit`;
        //

        //Precio
        const price = document.createElement('div');
        price.innerText = `$000,00`;
        price.classList.add("Prie");

        const pgen = document.createElement('div');
        pgen.classList.add("col-m-4", "col-s-4");
        pgen.appendChild(price);
        //

        //boton x
        const btn = document.createElement('div');
        //btn.innerText = `x`;
        //btn.classList.add("x");
        ///btn.onclick = borrarPrd;
        const botn = document.createElement('div');
        botn.classList.add("col-m-2", "col-s-2");
        botn.appendChild(btn);
        //


        //div general
        const gen = document.createElement('div');
        gen.classList.add("row", "bt", "boxp");
        //

        //Agregar todo a div gen
        gen.appendChild(imag);
        gen.appendChild(txt);
        gen.appendChild(botn);
        gen.appendChild(pgen);
        

        //link
        const adiv = document.createElement('a');
        adiv.href = "Producto.html";
        adiv.appendChild(gen);
        //

        divscrll.appendChild(adiv);
    });

    document.getElementById('comprass').appendChild(divscrll);

}




function LoadProducts() {
    const xhr = new XMLHttpRequest();

    // Abrimos la conexion
    xhr.open('GET', 'Products.json', true);
    

    xhr.onload = function() {
        if(this.status === 200) {
            const prd = JSON.parse( this.responseText ) ;
            
            // Generar el HTML
            let htmlPrd = ``;
            
            // Imprimir cada img
            prd.forEach(function(prod) {
                    htmlPrd += `
                    
                    <div style="padding: 1em;" class="w-s-100 w-m-33">
            
                        <div class="bxprdct">

                            <div class = "product" > <a href=" " onclick="Producto(event)" > <img src="${prod.img}" alt=""> </a> </div>

                            <div class="pdimfo">
                                <div style="font-size: 2em;">
                                    $${prod.precio},00
                                </div>
                                <div style="height: 2.2em; overflow:hidden; text-overflow:ellipsis;">
                                    ${prod.descripcion}
                                </div>
                            </div>
                
                            <div class="row">
                                <div class="col-m-5 col-s-5 btnbox" >
                                    <a class="btn btncomprar" href="">Comprar</a>
                                </div>
                                <div class="col-m-7 col-s-7 btnbox" >
                                    <a onclick="addCar(event,this)" class="btn btncarrito" href="">Agregar al carrito</a>
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
    
}
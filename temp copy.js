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


    //titulo
    const titl = document.createElement('div');
    titl.classList.add("tit", "col-m-10", "col-s-10");
    titl.innerText = "Carrito";
    //

    //botonx
    const x = document.createElement('button');
    x.classList.add("xm");
    x.innerText = "x";
    x.onclick = xm(event,this);
    
    const xx = document.createElement('div');
    xx.classList.add("col-m-2", "col-s-2");
    xx.appendChild(x);
    //

    //eneral
    const gen = document.createElement('div');
    gen.classList.add("row");
    
    gen.appendChild(titl);
    gen.appendChild(xx);
    //

    //principal
    const prn = document.createElement('div');
    prn.classList.add("car");
    prn.appendChild(gen);
    //

    let prods = obtenerLocalSt();

    


    // prods.forEach(function(elm) {
    //     prn.appendChild(elm);
    // });

    for(const elm of prods) {
        //console.log(elm);
        prn.appendChild(elm);
    }

    document.getElementById('Cshop').appendChild(prn);


}
3

//Quita carrito de compras
function xm(e,t) {
    e.preventDefault();

    document.getElementById('Cshop').innerHTML = ``;
}

//Agrega al carrito de compras
function addCar(e,t) {
    e.preventDefault();
    //img
    const ima = document.createElement('img');
    ima.classList.add("img-fluid");

    const imag = document.createElement('div');
    imag.classList.add("col-m-2", "col-s-2");

    imag.appendChild(ima);
    //

    //text
    const txt = document.createElement('div');
    txt.classList.add("col-m-9", "col-s-9");
    txt.innerText = `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi exercitationem, esse ipsam ea culpa
    at omnis eum atque dolores consectetur assumenda delectus tempore repellendus odio reprehenderit
    quidem modi sunt? Illum?`;
    //

    //boton x
    const btn = document.createElement('button');
    btn.innerText = `x`;
    btn.classList.add("x");
    const botn = document.createElement('div');
    botn.classList.add("col-m-1", "col-s-1");
    botn.appendChild(btn);
    //


    //div general
    const gen = document.createElement('div');
    gen.classList.add("row", "bt", "box");
    //

    //Agregar todo a div gen
    gen.appendChild(imag);
    gen.appendChild(txt);
    gen.appendChild(botn);

    //link
    const adiv = document.createElement('a');
    adiv.href = "Producto.html";
    //

    adiv.appendChild(gen);

    console.log(adiv);

    agregarLocalSt(adiv);
}




//Agregar elemento a Local Storage
function agregarLocalSt(elem) {
    let elems = obtenerLocalSt();

    //Añadir el nuevo tweet
    elems.push(elem);

    //Convertir a string a arreglo para ls
    //localStorage.setItem('elems', JSON.stringify(elems))
    localStorage.setItem('elems', document.documentElement.innerHTML)

}


//Obtener los elementos de Local Storage
function obtenerLocalSt() {
    let elems;

    //Checar valores de local storage
    if(localStorage.getItem('elems') === null) {
        elems = [];
    } else {
        elems = localStorage.getItem('elems');
    }
    return elems;
}

//Eliminar elemento de Local Storage 
function borrarTeetLs(elemtBr) {
    let elems;
    elems = obtenerLocalSt();

    elems.forEach(function(elem, index) {
        if(elemtBr === elem) {
            elems.splice(index, 1);
        }s
    });

    localStorage.setItem("elems", JSON.stringify(elems));
}

//Eliminar elemento
function borrarPrd(e) {
    e.preventDefault();
    if(e.target.className === "x") {
        var tweeetBr = e.target.parentElement.parentElement;
        e.target.parentElement.parentElement.remove();
        
        borrarTeetLs(e.target.parentElement.parentElement.querySelector('.txt').innerText);
    }
}
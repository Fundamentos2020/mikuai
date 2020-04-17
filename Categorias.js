var nom; 

function titlet(e,t) {
    e.preventDefault();

    nom = t.innerText;

    nome = "MiKiai | " + nom
    document.getElementById('titleh').innerText = nome;

    document.getElementById('contp').innerHTML = ' ';

    document.getElementById('prodc').innerHTML = `
    <div class="row pdconten pdconten-m" >

        <div style="width: 100%;" class="row">

            <div style="padding-left: 0.5em;  margin-top: 1em;" class="col-m-2 col-s-12">
                <button onclick="atras(event)" class="btn btnatras">Atras</button>
            </div>

            <div class="title col-m-10 col-s-12">
                    ${nom}
            </div>
            
        </div>

        <div style="padding: 1em;" class="w-s-100 w-m-33">
            
            <div class="bxprdct">

                <div class = "product" > <a href=" " onclick="Producto(event)" > <img src="https://picsum.photos/id/1/400/300" alt=""> </a> </div>

                <div class="pdimfo">
                    <div style="font-size: 2em;">
                        $000,00
                    </div>
                    <div>
                        Informacion de Articulo
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
    </div>
    `;

    //window.location.href='/Categoria.html';
}

function atras(e) {
    e.preventDefault();


    document.getElementById('titleh').innerText = "MiKuai | Categorias";

    document.getElementById('prodc').innerHTML = ``;

    document.getElementById('contp').innerHTML = ` 
    <div class="contp">
        <div class="row">

            <div style="float: left;" class="w-m-35 w-s-50">
                <div class="cat">

                    <img class="imgc" src="https://picsum.photos/300/200" alt="">

                    <a onclick="titlet(event,this)" class="txtc" href=""> Automoviles </a>

                </div>
            </div>

            <div style="float: left;" class="w-m-20 w-s-50">
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

            <div style="float: left;" class="w-m-20 w-s-45">
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

            <div style="float: left;" class="w-m-20 w-s-45">
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
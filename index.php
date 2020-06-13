<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="temp.css">
    <link rel="stylesheet" href="index.css">
    <link rel="stylesheet" href="Producto.css">
    <link rel="stylesheet" href="Pagar.css">
    <link rel="icon" href="/img/logor.png">
    <title id="titleh">MiKuai</title>
</head>
<body >
    <script src="temp.js"></script>
    <?php 
        if(array_key_exists("src", $_GET)) {
            $cont = $_GET['src'];
            if($_SERVER['REQUEST_METHOD'] === 'GET')
            {
                
            }
        }
    ?>

    <!-- Title and search, menu -->
    <div class="row bar trans">
        
        <div class="col-m-2 col-s-12 logo"> <a href="index.html"> <img src="img/Logo.png" alt=""> </a> </div>

        <div class="col-m-10 col-s-12">
            <div class="row">
            
                <div class="col-m-10 col-s-8 srchinp" > <input id="schrtx" placeholder="Search" type="text"> </div>
                
                <div class="col-m-2 col-s-4 srchibtn"> <a onclick="searchbt(event)" href="" class=" srchibtna btn"> Search </a> </div>
            
            </div>
        </div>

        <!-- Manu -->
        <div class="col-m-12">
            <div class="row">
                <div style="display: flex;" class="col-m-2 col-s-7">
                    <a class="btn mnbtn" href="Descuentos.html">Descuentos y Rebajas</a>
                </div>

                <div style="display: flex;" class="col-m-1 col-s-5">
                    <a class="btn mnbtn" href="Novedades.html">Novedades</a>
                </div>

                <div style="display: flex;" class="col-m-1 col-s-6">
                    <a class="btn mnbtn" href="Categorias.html">Categorias</a>
                </div>

                <div style="height: 3.30em; background-color: #2e3034;" style="display: flex;" class="col-m-5">
                   
                </div>

                <div style="display: flex;" class="col-m-1 col-s-6">
                    <a class="btn mnbtn" href="About.html">Informacion</a>
                </div>

                <div style="display: flex;" class="col-m-1 col-s-6">
                    <a class="btn mnbtn" href="LogIn.html" style="width: 100%; padding: 0;">  <img src="img/Mono.png" alt=""> </a>
                </div>

                <div style="display: flex;" class="col-m-1 col-s-6">
                    <a onclick="ShopCar(event,this)" style="width: 100%; padding: 0;" class="btn mnbtn" href=""> <img src="img/Carrito.png" alt=""> </a>
                </div>
                
            </div>

        </div>

    </div>


    <!-- Carrito -->
    <div id="Cshop">
        <!-- 

             Carrito 
        <div class="car">

            <div class="row">
                <div class="tit col-m-10"> Carrito </div>

                <div class="col-m-1 col-s-1">
                    <button onclick="xm(event,this)" class="xm" >x</button>
                </div>
            </div>

            


            <a href="Producto.html">
                <div class="row bt box"> 

                    <div class="col-m-2 col-s-2">
                        <img class="img-fluid" src="https://picsum.photos/id/1/80/80" alt="">
                    </div>
                    <div class="col-m-7 col-s-7 ">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi exercitationem, esse ipsam ea culpa
                        at omnis eum atque dolores consectetur assumenda delectus tempore repellendus odio reprehenderit
                        quidem modi sunt? Illum?
                    </div>

                    <div class="pdimfo col-m-2 col-s-2">
                        <div style="font-size: 2em;">
                            $000,00
                        </div>
                    </div>


                    <div class="col-m-1 col-s-1">
                        <button class="x" >x</button>
                    </div>

                </div>
            </a>
        </div>
         -->
    </div>

    <div id="errmsge">
    </div>
    

    <div id="btnatrs"></div>

    <div id="pagrprd"></div>

    <div id="contnprd"></div>
    
    <!-- Articulos -->
    <div class="row pdconten pdconten-m" id="arts" >
        
        <!-- <div style="padding: 1em;" class="w-s-100 w-m-33">
            
            <div class="bxprdct">

                <div class = "product" > <a href=" " onclick="Producto(event)" > <img src="https://picsum.photos/id/1/400/300" alt=""> </a> </div>

                <div class="pdimfo">
                    <div style="font-size: 2em;">
                        $000,00
                    </div>
                    <div style="height: 1em;">
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

        </div> -->

    </div>

    <!-- paginacion -->
    <div class="pgn" id="ipgn">
    </div>


    <!-- Pie de pagina -->
    <div class="row pie">

        <div class="col-m-6 col-s-12 pied">
            Compra en linea, felicidad en casa
        </div>

        <div style="display: flex;" class="col-m-2 col-s-12">
            
            <a onclick="volvArriba(event)" class="vlvarriba" href="">
                Volver arriba
            </a>

        </div>

        <div class="col-m-2 col-s-12 pied">
            Contactanos
        </div>

        <div class="col-m-2 col-s-12">

            <div class="row">

                <div class="col-m-4 col-s-4 bxscl redes">
                    <a style="width: 25%;" href="https://www.facebook.com" target="_blank"> <img class="scl" src="Redes/Facebook.png" alt=""> </a>
                </div>

                <div class="col-m-4 col-s-4 bxscl redes">
                    <a style="width: 25%;" href="https://www.instagram.com " target="_blank"> <img class="scl" src="Redes/Instagram.png" alt=""> </a>
                </div>

                <div class="col-m-4 col-s-4 bxscl redes">
                    <a style="width: 25%;" href="https://www.twitter.com" target="_blank"> <img class="scl" src="Redes/Twitter.png" alt=""> </a>
                </div>
                
            </div>

        </div>
        
    </div>

    <script type="text/javascript" >

        src = "<?php echo $cont; ?>";
        const xhr = new XMLHttpRequest();
        window.scrollTo(0, 0);
        // Abrimos la conexion
        xhr.open('GET', api + "producto/search/" + src + "/" + pagAct , false);
        
        ban = true;

        xhr.onload = function() {
            if(this.status === 200) {
                const prd = JSON.parse( this.responseText );

                // Generar el HTML
                let htmlPrd = ``;
                
                if(prd.data.total_registros > 0) {
                    
                    let totalPrdu = prd.data.total_registros;
                    totalPrd = totalPrdu;

                    let numPagi = Math.floor(totalPrd/cantPrd);
                    cantPag = numPagi;

                    //if(prd.data.)
                    
                    // Imprimir cada img
                    prd.data.productos.forEach(function loop(prod) {
                            htmlPrd += `
                            
                            <div style="padding: 1em;" class="w-s-100 w-m-33">
                    
                                <div class="bxprdct">

                                    <div class = "product" > <a href=" " onclick="loadProducto(event,${prod.id})" > <img src="https://picsum.photos/200/300" alt=""> </a> </div>

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
                                            <a onclick="cpmrProd(event,${prod.id})" class="btn btncomprar" href="">Comprar</a>
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
                } else {
                    ban = false;
                    htmlPrd += `<div class="errmsg errmsg-s errmsg-m">No se encontraron coincidencias</div>`;
                    document.getElementById('errmsge').innerHTML = htmlPrd;
                }
            }
        }
        
        // Enviar el Request
        xhr.send();
        if(ban)
            cargPag();

    </script>

</body>
</html>
function cmprs() {


    var sesion = getSesion();

    ids = sesion.id;



    const xhr = new XMLHttpRequest();
    // Abrimos la conexion
    xhr.open('GET', api + "compras/" + ids , true);
    
    xhr.setRequestHeader("Authorization", sesion.token_acceso);

    xhr.onload = function() {
        if(this.status === 200) {
            const compr = JSON.parse( this.responseText ) ;

            

            if(compr.data.total_registros > 0){

                const divscrll = document.createElement('div');
                divscrll.classList.add("scrllp");

                compr.data.compras.forEach(function(elm) {
                    //prn.appendChild(elm);

                    
                    

                    const xhrC = new XMLHttpRequest();
                    // Abrimos la conexion
                    xhrC.open('GET', api + "compraprd/" + elm , true);
                    

                    xhrC.onload = function() {
                        if(this.status === 200) {
                            const prdc = JSON.parse( this.responseText ) ;

                            prdc.data.productos.forEach(function(elmPr){

                                        
                                



                                const xhrP = new XMLHttpRequest();
                                // Abrimos la conexion
                                xhrP.open('GET', api + "product/" + elmPr , true);
                                

                                xhrP.onload = function() {
                                    if(this.status === 200) {
                                        const prd = JSON.parse( this.responseText ) ;
                                        console.log(prd);

                                        prd.data.producto.forEach(function(elmPr){

                                            //img
                                            const ima = document.createElement('img');
                                            ima.src = "data:image/*; base64," + elmPr.img;
                                            ima.classList.add("img-fluid", "carImg");

                                            const imag = document.createElement('div');
                                            imag.classList.add("col-m-2", "col-s-2");

                                            imag.appendChild(ima);
                                            //

                                            //text
                                            const txt = document.createElement('div');
                                            txt.classList.add("col-m-4", "col-s-4");
                                            txt.style="padding-left: 1em;";
                                            txt.innerText = `${elmPr.nombre}`;
                                            //

                                            //Precio
                                            const price = document.createElement('div');
                                            if(elmPr.descuento !== 0)
                                            {
                                                price.innerText = `$${elmPr.precio - (elmPr.precio*(elmPr.descuento/100))}`;
                                                
                                            }
                                            else {
                                                price.innerText = `$${elmPr.precio}`;
                                                
                                            }
                                            price.classList.add("CarPrice");

                                            const pgen = document.createElement('div');
                                            pgen.classList.add("col-m-4", "col-s-4");
                                            pgen.appendChild(price);
                                            //

                                            //div general
                                            const gen = document.createElement('div');
                                            gen.classList.add("row", "bt", "box");
                                            //

                                            //Agregar todo a div gen
                                            gen.appendChild(imag);
                                            gen.appendChild(txt);
                                            gen.appendChild(pgen);
                                            //link
                                            const adiv = document.createElement('div');
                                            adiv.href = "Producto.html";
                                            adiv.appendChild(gen);
                                            //

                                            divscrll.appendChild(adiv);

                                        });
                                    }
                                }
                                xhrP.send();

                            });

                        }
                    }

                    xhrC.send();
                });

                document.getElementById('comprass').appendChild(divscrll);
            } else {
                document.getElementById('errmsge').innerHTML = `<div class="errmsg errmsg-s errmsg-m">No se encontraron compras</div>`;
            }

            
        }
    }
    xhr.send();

}
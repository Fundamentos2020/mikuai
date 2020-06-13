// Obtener referencia al input y a la imagen




function changeImg(){
    const $seleccionArchivos = document.querySelector("#seleccionArchivos"),
  $imagenPrevisualizacion = document.querySelector("#imagenPrevisualizacion");
  
    const archivos = $seleccionArchivos.files;
    if (!archivos || !archivos.length) {
        $imagenPrevisualizacion.src = "";
        return;
    }

    console.log(archivos[0]);
    const primerArchivo = archivos[0];

    const objectURL = URL.createObjectURL(primerArchivo);

    $imagenPrevisualizacion.src = objectURL;
}
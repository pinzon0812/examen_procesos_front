const urlApi = "http://localhost:8089/product/";

function listarProductos(){
    validaToken()
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token

        },
    }
    fetch(urlApi,settings)
        .then(response => response.json())
        .then(function(data){
            var productos = '';
            for(const producto of data){
                productos += '<tr>'+
                    '<th scope="row">'+producto.id+'</th>'+
                    '<td>'+producto.title+'</td>'+
                    '<td>'+'$'+producto.price+'</td>'+
                    '<td>'+producto.category+'</td>'+
                    '<td>'+producto.stock+'</td>'+
                    '<td>'+
                    '<button type="button" class="btn btn-outline-danger" onclick="eliminaProducto(\''+producto.id+'\')"><i class="fa-solid fa-minus"></i></button>'+
                    '<a href="#" onclick="verModificarProducto(\''+producto.id+'\')" class="btn btn-outline-warning"><i class="fa-solid fa-notes-medical"></i></a>'+
                    '<a href="#" onclick="verProducto(\''+producto.id+'\')"class="btn btn-outline-info"><i class="fa-solid fa-eye"></i></a>'+
                    '</td>'+
                    '</tr>';
            }
            document.getElementById("listar").innerHTML = productos;

        })
}
function verAgregarProducto(){
    user();
    var cadena= '<form action="" method="post" id="myForm">'+
        ' <label  for="id">Id del producto</label>'+
        '<input type="text" class="form-control" name="id" id="id" required> <br>'+
        '<label  for="id_user">Usuario</label>'+
        '<select class="form-control" id="id_user" name="id_user" required></select> <br>'+
        ' <button type="button" class="btn btn-success" onclick="sendData()">Registrar Producto</button>'+
        '</form>';
    document.getElementById("contentModal").innerHTML = cadena;
    var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
    myModal.toggle();
}

function eliminaProducto(id){
    validaToken()
    var settings={
        method: 'DELETE',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+id,settings)
        .then(response => response.json())
        .then(function(data){

            listarProductos();
            alertas(" Se ha eliminado el producto exitosamente!",2)
        })
}
function verModificarProducto(id){
    validaToken()
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+id,settings)
        .then(response => response.json())
        .then(function(producto){
            var cadena='';
            if( producto){
                cadena='<div class="p-3 mb-2 bg-light text-dark">'+
                    '<h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modificar Producto</h1>'+
                    '</div>'+
                    '<form action="" method="post" id="modificar">'+
                    ' <label  for="title">Nombre</label>'+
                    '<input type="text" class="form-control" name="title" id="title" value ="'+producto.title+'" required> <br>'+
                    '<label  for="price">Precio</label>'+
                    ' <input type="text" class="form-control" name="price" id="price" value ="'+producto.price+'" required><br>'+
                    '<label  for="category">Categoria</label>'+
                    ' <input type="text" class="form-control" name="category" id="category" value ="'+producto.category+'" required><br>'+
                    '<label  for="description">Descripcion</label>'+
                    '  <input type="text" class="form-control" name="description" id="description" value ="'+producto.description+'" required><br>'+
                    '<label  for="stock">Stock</label>'+
                    '  <input type="text" class="form-control" name="stock" id="stock" value ="'+producto.stock+'" required><br>'+
                    ' <button type="button" class="btn btn-outline-warning" onclick="modificarProducto(\''+producto.id+'\')">Modificar</button>'+
                    '</form>';
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();



        })
}
async function modificarProducto(id){
    validaToken()
    var myForm = document.getElementById("modificar");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request =  await fetch(urlApi+id, {
        method: 'PUT',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
    listarProductos();
    alertas(" Se ha modificado el producto exitosamente!",1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario');
    var modal = bootstrap.Modal.getInstance(myModalEl)
    modal.hide();

}

function verProducto(id){
    validaToken()
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+id,settings)
        .then(response => response.json())
        .then(function(producto){
            var cadena='';


            if( producto){
                cadena='<div class="p-3 mb-2 bg-light text-dark">'+
                    '<h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Visualizar Producto</h1>'+
                    '</div>'+
                    '<ul class="list-group">'+
                    '<li class="list-group-item">Nombre: '+producto.title+' </li>'+
                    '<li class="list-group-item">Precio: $'+producto.price+'</li>'+
                    '<li class="list-group-item">Categoria: '+producto.category+'</li>'+
                    '<li class="list-group-item">Descripcion: '+producto.description+'</li>'+
                    '<li class="list-group-item">Imagen: '+producto.stock+'</li>'+
                    '<li class="list-group-item">Registrado por: '+producto.user.firstName+'</li>'

                    '</ul>';
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();

        })
}
function validaToken(){
    if(localStorage.token== undefined){
        salir();
    }
}
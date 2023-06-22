const urlApi = "http://localhost:8089";
async function login(){
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    var settings={
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    }
    const request = await fetch(urlApi+"/auth/login",settings);
    //console.log(await request.text());
    if(request.ok){
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'logeado exitosamente',
            showConfirmButton: false,
            timer: 3500
        })
        const respuesta = await request.json();
        localStorage.token = respuesta.data.token;

        //localStorage.token = respuesta;
        localStorage.email = jsonData.email;
        location.href= "dashboard.html";
    }else{
        Swal.fire({
            position: 'center',
            icon: 'error',
            text: 'Datos incorrectos',
            showConfirmButton: false,
            timer: 3000
        });
    }
}

function listar(){
    validaToken()
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token

        },
    }
    fetch(urlApi+"/user",settings)
        .then(response => response.json())
        .then(function(data){
            var usuarios = '';
            for(const usuario of data.data){


                usuarios += '<tr>'+
                    '<th scope="row">'+usuario.id+'</th>'+
                    '<td>'+usuario.firstName+'</td>'+
                    '<td>'+usuario.lastName+'</td>'+
                    '<td>'+usuario.email+'</td>'+
                    '<td>'+
                    '<button type="button" class="btn btn-outline-danger" onclick="eliminaUsuario(\''+usuario.id+'\')"><i class="fa-solid fa-user-minus"></i></button>'+
                    '<a href="#" onclick="verModificarUsuario(\''+usuario.id+'\')" class="btn btn-outline-warning"><i class="fa-solid fa-user-pen"></i></a>'+
                    '<a href="#" onclick="verUsuario(\''+usuario.id+'\')"class="btn btn-outline-info"><i class="fa-solid fa-eye"></i></a>'+
                    '</td>'+
                    '</tr>';

                if(localStorage.email==usuario.email){
                    localStorage.nombre = usuario.firstName;
                }
            }

            document.getElementById("listar").innerHTML = usuarios;
            //}
        })

}
async function sendDatas(){
    var myForm = document.getElementById("registrar");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApi+"/user", {
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',

        },
        body: JSON.stringify(jsonData)
    });
    myForm.reset();
    console.log(await request.text())
    listar();
    alertas(" Se ha registrado el usuario exitosamente!",1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario');
    var modal = bootstrap.Modal.getInstance(myModalEl)
    modal.hide();
}
function verUsuario(id){
    validaToken()
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/user/"+id,settings)
        .then(response => response.json())
        .then(function(usuario){
            var user=usuario.data
            var cadena='';
            if( user){
                cadena='<div class="p-3 mb-2 bg-light text-dark">'+
                    '<h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Visualizar Usuario</h1>'+
                    '</div>'+
                    '<ul class="list-group">'+
                    '<li class="list-group-item">Nombre: '+user.firstName+' </li>'+
                    '<li class="list-group-item">Apellido: '+user.lastName+'</li>'+
                    '<li class="list-group-item">Email: '+user.email+'</li>'+
                    '<li class="list-group-item">Direccion: '+user.address+'</li>'+
                    '<li class="list-group-item">Fecha de nacimiento: '+user.birthday+'</li>'+
                    '</ul>';
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();

        })
}

function verModificarUsuario(id){
    validaToken()
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/user/"+id,settings)
        .then(response => response.json())
        .then(function(usuario){
            var user=usuario.data;
            var cadena='';
            if( user){
                cadena='<div class="p-3 mb-2 bg-light text-dark">'+
                    '<h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modificar Usuario</h1>'+
                    '</div>'+
                    '<form action="" method="post" id="modificar" >'+
                    '<input type="hidden" name="id" id="id" value="'+user.id+'">'+
                    '<label  for="firstName" class="form-label">Nombre</label>'+
                    '<input type="text" class="form-control" name="firstName" id="firstName"  required value="'+user.firstName+'"> <br>'+
                    ' <label  for="lastName" class="form-label">Apellido</label>'+
                    ' <input type="text" class="form-control" name="lastName" id="lastName" required value="'+user.lastName+'"><br>'+

                    ' <label  for="email" class="form-label" >Email</label>'+
                    ' <input type="email" class="form-control" name="email" id="email" required value="'+user.email+'"><br>'+

                    ' <label  for="address" class="form-label" >Direccion</label>'+
                    ' <input type="text" class="form-control" name="address" id="address" required value="'+user.address+'"><br>'+

                    ' <label  for="password" class="form-label">password</label>'+
                    ' <input type="password" class="form-control"  name="password" id="password" required><br>'+
                    '<button type="button"   class="btn btn-warning" onclick="modificarUsuario(\''+user.id+'\')">Modificar</button>'+
                    '</form>';
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();



        })
}

async function modificarUsuario(id){
    validaToken()
    var myForm = document.getElementById("modificar");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request =  await fetch(urlApi+"/user/"+id, {
        method: 'PUT',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
    listar();
    alertas(" Se ha modificado el usuario exitosamente!",1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario');
    var modal = bootstrap.Modal.getInstance(myModalEl)
    modal.hide();


}

function eliminaUsuario(id){
    validaToken()
    var settings={
        method: 'DELETE',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/user/"+id,settings)
        .then(response => response.json())
        .then(function(data){
            listar();
            alertas(" Se ha eliminado el usuario exitosamente!",2)
            var myModalEl = document.getElementById('modalUsuario');
            var modal = bootstrap.Modal.getInstance(myModalEl)

        })
}

const usuarios = [{
    nombre: 'Bel',
    mail: 'belprad@mail.com',
    pass: 'turrita22'
},
{
    nombre: 'Sabri',
    mail: 'sabrisabri@mail.com',
    pass: 'sabuesa12'
},
{
    nombre: 'Alberto',
    mail: 'Albertito@mail.com',
    pass: 'bocaj09'
}]

const accesorios = [{
    nombre: "Aguila",
    medida: "3cm",
    material: "oro",
    peso: 3,
    img: './img/anillo-aguila.png'
}, {
    nombre: "Faso",
    medida: "4cm",
    material: "bronce",
    peso: 8,
    img: './img/anillo-faso.png'
}, {
    nombre: "Skull",
    medida: "5cm",
    material: "plata",
    peso: 40,
    img: './img/anillo-skull.png'
}, {
    nombre: "As",
    medida: "6cm",
    material: "acero",
    peso: 2,
    img: './img/dije-as-de-picas.jpg'
}]


//Todos los elementos del DOM que voy a necesitar
const inputMailLogin = document.getElementById('emailLogin'),
    inputPassLogin = document.getElementById('passwordLogin'),
    checkRecordar = document.getElementById('recordarme'),
    btnLogin = document.getElementById('login'),
    modalEl = document.getElementById('modalLogin'),
    modal = new bootstrap.Modal(modalEl),
    contTarjetas = document.getElementById('tarjetas'),
    elementosToggleables = document.querySelectorAll('.toggeable');


//La función de validar se aprovecha del tipo de return que hace el método find (el objeto si lo encuentra, o undefined si no encuentra ninguno que cumpla con la condición)
function validarUsuario(usersDB, user, pass) {
    let encontrado = usersDB.find((userDB) => userDB.mail == user);
    console.log(encontrado)
    console.log(typeof encontrado)

    if (typeof encontrado === 'undefined') {
        return false;
    } else {
        //si estoy en este punto, quiere decir que el usuario existe, sólo queda comparar la contraseña
        if (encontrado.pass != pass) {
            return false;
        } else {
            return encontrado;
        }
    }
}

//Después de validar el usuario, guardamos los datos del usuario que recuperamos de la database en el storage, para tener disponible el nombre
function guardarDatos(usuarioDB, storage) {
    const usuario = {
        'name': usuarioDB.nombre,
        'user': usuarioDB.mail,
        'pass': usuarioDB.pass
    }

    storage.setItem('usuario', JSON.stringify(usuario));
}

//Limpiar los storages
function borrarDatos() {
    localStorage.clear();
    sessionStorage.clear();
}

//Recupero los datos que se guardaron en el storage y los retorno
function recuperarUsuario(storage) {
    return JSON.parse(storage.getItem('usuario'));
}

//Cambio el DOM para mostrar el nombre del usuario logueado, usando los datos del storage
function saludar(usuario) {
    nombreUsuario.innerHTML = `Bienvenido/a, <span>${usuario.name}</span>`
}

//Creo HTML dinámico para mostrar la información de las mascotas a partir del array fake DB
function mostrarInfoAccesorios(array) {
    contTarjetas.innerHTML = '';
    array.forEach(element => {
        let html = `<div class="card cardAccesorios" id="tarjeta${element.nombre}">
                <h3 class="card-header" id="nombreAccesorios">Nombre: ${element.nombre}</h3>
                <img src="${element.img}" alt="${element.nombre}" class="card-img-bottom" id="fotoAccesorios">
                <div class="card-body">
                    <p class="card-text" id="medidaAccesorios">Medida: ${element.medida}</p>
                    <p class="card-text" id="materialAccesorios">Material: ${element.material}</p>
                    <p class="card-text" id="pesoAccesorios">Peso: ${element.peso} gramos</p>
                </div>
            </div>`;
        contTarjetas.innerHTML += html;
    });
}

//Esta función nos permite intercambiar la visualización de los elementos del DOM, agregando o sacando la clase d-none. Si el elemento la tiene, se la saco, y si no la tiene, se la agrego. La gata Flora de las funciones sería.
function presentarInfo(array, clase) {
    array.forEach(element => {
        element.classList.toggle(clase);
    });
}

//Esta función revisa si hay un usuario guardado en el storage, y en ese caso evita todo el proceso de login 
function estaLogueado(usuario) {

    if (usuario) {
        saludar(usuario);
        mostrarInfoAccesorios(accesorios);
        presentarInfo(elementosToggleables, 'd-none');
    }
}


btnLogin.addEventListener('click', (e) => {
    e.preventDefault();

    //Validamos que ambos campos estén completos
    if (!inputMailLogin.value || !inputPassLogin.value) {
        alert('Todos los campos son requeridos');
    } else {
        //Revisamos si el return de la función validate es un objeto o un boolean. Si es un objeto, fue una validación exitosa y usamos los datos. Si no, informamos por alert.
        let data = validarUsuario(usuarios, inputMailLogin.value, inputPassLogin.value);

        if (!data) {
            alert(`Usuario y/o contraseña erróneos`);
        } else {

            //Revisamos si elige persistir la info aunque se cierre el navegador o no
            if (checkRecordar.checked) {
                guardarDatos(data, localStorage);
                saludar(recuperarUsuario(localStorage));
            } else {
                guardarDatos(data, sessionStorage);
                saludar(recuperarUsuario(sessionStorage));
            }
            //Recién ahora cierro el cuadrito de login
            modal.hide();
            //Muestro la info para usuarios logueados
            mostrarInfoAccesorios(accesorios);
            presentarInfo(elementosToggleables, 'd-none');
        }
    }
});

btnLogout.addEventListener('click', () => {
    borrarDatos();
    presentarInfo(elementosToggleables, 'd-none');
});

estaLogueado(recuperarUsuario(localStorage));
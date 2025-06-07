let db;

function IniciarBaseDatos() {
    CrearAlmacen();
}

function CrearAlmacen() {
    db = new Dexie("PersonasDB");
    db.version(1).stores({
        personas: "++id, nombre, apellido, anioNacimiento, mesNacimiento, esBisiesto, mesPar"
    });

    Comenzar();
}

function Comenzar() {
    document.getElementById("btn-guardar").addEventListener("click", GuardarPersona);
    MostrarPersonas();
}

function MostrarError(error) {
    alert("Tenemos un ERROR: " + error.name + " / " + error.message);
}

function esBisiesto(anio) {
    return (anio % 4 === 0 && anio % 100 !== 0) || (anio % 400 === 0);
}

function esMesPar(mes) {
    return mes % 2 === 0;
}

async function GuardarPersona() {
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const anioNacimiento = parseInt(document.getElementById("anioNacimiento").value.trim());
    const mesNacimiento = parseInt(document.getElementById("mesNacimiento").value.trim());

    if (!nombre || !apellido || isNaN(anioNacimiento) || isNaN(mesNacimiento)) {
        alert("Por favor completa todos los campos correctamente.");
        return;
    }

    const bisiesto = esBisiesto(anioNacimiento);
    const parMes = esMesPar(mesNacimiento);

    try {
        await db.personas.add({ nombre, apellido, anioNacimiento, mesNacimiento, esBisiesto: bisiesto, mesPar: parMes });

        // Limpiar campos
        document.getElementById("formulario").reset();

        MostrarPersonas();
    } catch (e) {
        MostrarError(e);
    }
}

async function MostrarPersonas() {
    try {
        const lista = document.getElementById("lista-personas");
        const personas = await db.personas.toArray();

        lista.innerHTML = "<h2>Personas registradas</h2><ul style='list-style: none; padding: 0;'>";
        personas.forEach(p => {
            const edad = new Date().getFullYear() - p.anioNacimiento;
            lista.innerHTML += `
                <li style="margin: 10px 0; background-color: #341968; padding: 10px 20px; border-radius: 15px;">
                    ${p.nombre} ${p.apellido} — Edad: ${edad} años<br>
                    Año ${p.anioNacimiento} es ${p.esBisiesto ? "bisiesto" : "no bisiesto"}<br>
                    Mes ${p.mesNacimiento} es ${p.mesPar ? "par" : "impar"}
                </li>`;
        });
        lista.innerHTML += "</ul>";
    } catch (e) {
        MostrarError(e);
    }
}

window.addEventListener("load", IniciarBaseDatos);

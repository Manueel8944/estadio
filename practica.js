// La funcion date la saqué de aqui "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString"

const prompt = require ("prompt-sync")();
const fs = require('fs');

const aforoMax = 50000

let boletosAforo = [] //Aqui se guardan el numero de boletos que hay y el aforo actual mediante un JSON

function leerdatosnum(){ //Funcion para leer los datos de los boletos y aforo
    const datos1 = fs.readFileSync("numboletos.json", 'utf8');
    boletosAforo = JSON.parse(datos1);
}

function escribirdatosnum(){ //Funcion para escribir los datos de los boletos y aforo
    const datosparseados1 = JSON.stringify(boletosAforo, null, 2);
    fs.writeFileSync("numboletos.json", datosparseados1, 'utf8');
}

class Entrada { //Clase entrada con sus atriburos
    constructor (idboleto, nombre, dni, asiento, hora, valido) {
        this.idboleto = idboleto
        this.nombre = nombre
        this.dni = dni
        this.asiento = asiento
        this.hora = hora
        this.valido = valido
    }
}

class GestorEntradas { //Clase para gestionar las entradas en un array de objetos que se escribe y se lee con un JSON
    constructor () {
        this.boletos = []
    }
    
    leerdatos(){ //Leer los datos del array de boletos
        const datos = fs.readFileSync("db.json", 'utf8');
        this.boletos = JSON.parse(datos);
    }

    escribirdatos(){ // Escribir los datos del array de boletos
        const datosparseados = JSON.stringify(this.boletos, null, 2);
        fs.writeFileSync("db.json", datosparseados, 'utf8');
    }

    comprarEntrada(){ //Metodo para comprar una entrada
        this.leerdatos()
        leerdatosnum()

        let hora = "No ingresado"
        let valido = false
        let idboleto = "BOLETO-"
        idboleto = idboleto + boletosAforo[0] //Esto es para que el boleto se llame correspondiente a cuantos boletos hay
        boletosAforo[0]++

        let nombre = prompt("Ingrese su nombre: ").toLowerCase()

        let dni
        let dniCorrecto = false
        while (!dniCorrecto) { //Vemos si se repite el dni y su longitud ya que es unico
            dni = prompt("Ingrese su DNI: ")
            let encontrado = false

            for (let i = 0; i < this.boletos.length; i++) {
                if (this.boletos[i].dni == dni || dni.length == 10 ) {
                    encontrado = true
                }
            }

            if (encontrado) {
                console.log("Error: DNI invaldo")
            }

            else {
                dniCorrecto = true
            }
        }

        let asiento
        let asientoCorrecto = false
        while (!asientoCorrecto) { //Se ve que no se repite el asiento
            asiento = prompt("Escoje un asiento (numero del 1 al 50000): ")
            let encontrado = false

            for (let i = 0; i < this.boletos.length; i++) {
                if (this.boletos[i].asiento == asiento || asiento < 1 || asiento > 50000) {
                    encontrado = true
                }
            }

            if (encontrado) {
                console.log("Error: Asiento invaldo")
            }

            else {
                asientoCorrecto = true
            }
        }

        this.boletos.push(new Entrada(idboleto, nombre, dni, asiento, hora, valido)) //Creamos el objeto y lo ponemos en el array
        console.log("Boleto adquirido exitosamente")
        
        escribirdatosnum()
        this.escribirdatos()
    }

    verificarEntrada(){ //Aqui se verifica si puede pasar o no
        this.leerdatos()

        let encontrado = false
        let posicion
        let boleto = prompt("Escribe el código de su boleto: ").toUpperCase()
        for (let i = 0; i < this.boletos.length; i++) { //Se busca el boleto que seleccionas
            if (this.boletos[i].idboleto == boleto) {
                encontrado = true
                posicion = i
            }
        }

        if(!encontrado){ //No se ha encontrado
            console.log("Error: boleto no encontrado")
        }

        else if (this.boletos[posicion].valido != false){ //Si es true es que ya se verificó
            console.log("Error: Este boleto ya fué verificado")
        }

        else if (this.boletos[posicion].hora != "No ingresado") { //Si la hora no sigue igual como la asigne al principio significa que ya se entro al estadio
            console.log("Error: Este boleto ya fué usado previamente")
        }

        else if (boletosAforo[1] >= aforoMax) { //Miramos el aforo
            console.log("Error: El aforo del estadio está lleno")
        }

        else {
            this.boletos[posicion].valido = true //Pasó las pruebas y le damos el valor true
            console.log("Boleto verificado correctamente")
        }

        this.escribirdatos()
    }

    ingresoEntrada() {
        leerdatosnum()
        this.leerdatos()

        let encontrado = false
        let posicion
        let boleto = prompt("Escribe el código de su boleto: ").toUpperCase()
        for (let i = 0; i < this.boletos.length; i++) { //Buscamos el boleto que se escribe
            if (this.boletos[i].idboleto == boleto) {
                encontrado = true
                posicion = i
            }
        }

        if(!encontrado){ //No se encontro el boleto escrito
            console.log("Error: boleto no encontrado")
        }

        else if (!this.boletos[posicion].valido){ //Si verfificado es false es que no esta verificado o ya entraste porque se asigna false al entrar
            console.log("Error: Este boleto no está verificado o ya estas dentro del estadio")
        }

        else { //Entra al estadio
            this.boletos[posicion].hora = new Date().toLocaleString() //Ponemos la hora con la funcion date
            this.boletos[posicion].valido = false //Asignamos false a valido
            boletosAforo[1]++ //Y el aforo se le suma 1 ya que has entrado
            console.log("Has pasado el control del estadio y has accedido a el")
        }

        escribirdatosnum()
        this.escribirdatos()
    }

    aforoEstadio() {
        leerdatosnum()
        console.log("El aforo actual del estadio es:",boletosAforo[1]) //Se muestra el aforo del estadio
        escribirdatosnum()
    }

    salirEstadio() {
        leerdatosnum()
        this.leerdatos()

        let encontrado = false
        let posicion
        let boleto = prompt("Escribe el código de su boleto: ").toUpperCase()
        for (let i = 0; i < this.boletos.length; i++) { //Se busca el boleto por el nombre introducido
            if (this.boletos[i].idboleto == boleto) {
                encontrado = true
                posicion = i
            }
        }

        if(!encontrado){ //No se encontro
            console.log("Error: boleto no encontrado")
        }

        else if (this.boletos[posicion].asiento != 0 && this.boletos[posicion].valido == false && this.boletos[posicion].hora != "No ingresado"){ //Asignamos el asiento 0 si alguien ya salió del estadio, entonces se comprueba que no es 0. Y que valido es false y haya una hora puesta que significa que has entrado
            this.boletos[posicion].asiento = 0 //Asignamos asiento 0
            boletosAforo-- //Restamos 1 al aforo
            console.log("Saliendo del estadio...")
        }

        else {
            console.log("Error, no estás dentro del estadio")
        }

        escribirdatosnum()
        this.escribirdatos()
    }
}

function menu () {

    const gestor = new GestorEntradas() //Se crea una instancia para ejecutar los metodos

    let menu = 0

    while (menu != 5) {  //Hacemos que se repita el menú si pones algo que no es una opcion

        console.clear()
        console.log("\x1b[36m╔════════════════════════════════════╗\x1b[0m");
        console.log("\x1b[36m║ \x1b[32m      ESTADIO DE FUTBOL      \x1b[36m      ║\x1b[0m");
        console.log("\x1b[36m╠════════════════════════════════════╣\x1b[0m");
        console.log("\x1b[36m║ \x1b[33m 1)\x1b[0m Comprar boletos            \x1b[36m    ║\x1b[0m");
        console.log("\x1b[36m║ \x1b[33m 2)\x1b[0m Verificar acceso           \x1b[36m    ║\x1b[0m");
        console.log("\x1b[36m║ \x1b[33m 3)\x1b[0m Registrar ingreso         \x1b[36m     ║\x1b[0m");
        console.log("\x1b[36m║ \x1b[33m 4)\x1b[0m Ver aforo del estadio          \x1b[36m║\x1b[0m");
        console.log("\x1b[36m║ \x1b[33m 5)\x1b[0m Salir del estadio            \x1b[36m  ║\x1b[0m");
        console.log("\x1b[36m╚════════════════════════════════════╝\x1b[0m");
        

        menu = parseInt(prompt("Elige una opción: "))

        console.clear()

        switch (menu) {

            case 1: {
                console.clear()
                console.log("=== Comprar boletos ===") 
                gestor.comprarEntrada() //Inicio el metodo
                pause = prompt("Pulse Enter para continuar...")
                break;
            }
            
            case 2: {
                console.clear()
                console.log("=== Verificar acceso ===") 
                gestor.verificarEntrada() //Inicio el metodo
                pause = prompt("Pulse Enter para continuar...")
                break;
            }
        
            case 3: {
                console.clear()
                console.log("=== Registrar ingreso  ===") 
                gestor.ingresoEntrada() //Inicio el metodo
                pause = prompt("Pulse Enter para continuar...")
                break;
            }

            case 4: {
                console.clear()
                console.log("=== Ver aforo del estadio ===")
                gestor.aforoEstadio() //Inicio el metodo
                pause = prompt("Pulse Enter para continuar...")
                break;
            }

            case 5: {
                console.clear()
                console.log("=== Salir del estadio ===")
                gestor.salirEstadio() //Inicio el metodo
                break;
            }

            default: {
                console.log("Error: Opción no válida, intentalo de nuevo.");
                pause = prompt("Pulse Enter para continuar...")
            }
        }
    }
}

menu () //inicio la funcion del menu
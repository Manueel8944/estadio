// La funcion date.now() la saqué de aqui "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Date/now"

const prompt = require ("prompt-sync")();
const fs = require('fs');

const aforoMax = 50000

let boletosAforo = []

function leerdatosnum(){
    const datos1 = fs.readFileSync("numboletos.json", 'utf8');
    boletosAforo = JSON.parse(datos1);
}

function escribirdatosnum(){
    const datosparseados1 = JSON.stringify(boletosAforo, null, 2);
    fs.writeFileSync("numboletos.json", datosparseados1, 'utf8');
}

class Entrada {
    constructor (idboleto, nombre, dni, asiento, hora, valido) {
        this.idboleto = idboleto
        this.nombre = nombre
        this.dni = dni
        this.asiento = asiento
        this.hora = hora
        this.valido = valido
    }
}

class GestorEntradas {
    constructor () {
        this.boletos = []
    }
    
    leerdatos(){
        const datos = fs.readFileSync("db.json", 'utf8');
        this.boletos = JSON.parse(datos);
    }

    escribirdatos(){
        const datosparseados = JSON.stringify(this.boletos, null, 2);
        fs.writeFileSync("db.json", datosparseados, 'utf8');
    }

    comprarEntrada(){
        this.leerdatos()
        leerdatosnum()

        let hora = "No ingresado"
        let valido = false
        let idboleto = "BOLETO-"
        idboleto = idboleto + boletosAforo[0]
        boletosNum++

        let nombre = prompt("Ingrese su nombre: ").toLowerCase()

        let dni
        let dniCorrecto = false
        while (!dniCorrecto) {
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
        while (!asientoCorrecto) {
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

        this.boletos.push(new Entrada(idboleto, nombre, dni, asiento, hora, valido))
        console.log("Boleto adquirido exitosamente")
        
        escribirdatosnum()
        this.escribirdatos()
    }

    verificarEntrada(){
        this.leerdatos()

        let encontrado = false
        let posicion
        let boleto = prompt("Escribe el código de su boleto: ").toUpperCase()
        for (let i = 0; i < this.boletos.length; i++) {
            if (this.boletos[i].idboleto == boleto) {
                encontrado = true
                posicion = i
            }
        }

        if(!encontrado){
            console.log("Error: boleto no encontrado")
        }

        else if (this.boletos[posicion].valido != false){
            console.log("Error: Este boleto ya fué verificado")
        }

        else if (this.boletos[posicion].hora != "No ingresado") {
            console.log("Error: Este boleto ya fué usado previamente")
        }

        else if (aforoActual >= aforoMax) {
            console.log("Error: El aforo del estadio está lleno")
        }

        else {
            this.boletos[posicion].valido = true
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
        for (let i = 0; i < this.boletos.length; i++) {
            if (this.boletos[i].idboleto == boleto) {
                encontrado = true
                posicion = i
            }
        }

        if(!encontrado){
            console.log("Error: boleto no encontrado")
        }

        else if (!this.boletos[posicion].valido){
            console.log("Error: Este boleto no está verificado o ya estas dentro del estadio")
        }

        else {
            this.boletos[posicion].hora = Date.now()
            this.boletos[posicion].valido = false
            boletosAforo[1]++
            console.log("Has pasado el control del estadio y has accedido a el")
        }

        escribirdatosnum()
        this.escribirdatos()
    }

    aforoEstadio() {
        leerdatosnum()
        console.log("El aforo actual del estadio es:",boletosAforo[1])
        escribirdatosnum()
    }

    salirEstadio() {
        leerdatosnum()
        this.leerdatos()

        let encontrado = false
        let posicion
        let boleto = prompt("Escribe el código de su boleto: ").toUpperCase()
        for (let i = 0; i < this.boletos.length; i++) {
            if (this.boletos[i].idboleto == boleto) {
                encontrado = true
                posicion = i
            }
        }

        if(!encontrado){
            console.log("Error: boleto no encontrado")
        }

        else if (this.boletos[posicion].asiento != 0 && this.boletos[posicion].valido != false && this.boletos[posicion].hora != "No ingresado"){
            console.log("Error: Este boleto no está verificado o ya estas dentro del estadio")
        }

        escribirdatosnum()
        this.escribirdatos()
    }
}

function menu () {

    const gestor = new GestorEntradas()

    let menu = 0

    while (menu != 5) { 

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
                gestor.comprarEntrada()
                pause = prompt("Pulse Enter para continuar...")
                break;
            }
            
            case 2: {
                console.clear()
                console.log("=== Verificar acceso ===") 
                gestor.verificarEntrada()
                pause = prompt("Pulse Enter para continuar...")
                break;
            }
        
            case 3: {
                console.clear()
                console.log("=== Registrar ingreso  ===") 
                gestor.ingresoEntrada()
                pause = prompt("Pulse Enter para continuar...")
                break;
            }

            case 4: {
                console.clear()
                console.log("=== Ver aforo del estadio ===")
                gestor.aforoEstadio()
                pause = prompt("Pulse Enter para continuar...")
                break;
            }

            case 5: {
                console.clear()
                console.log("=== Salir del estadio ===")
                break;
            }

            default: {
                console.log("Error: Opción no válida, intentalo de nuevo.");
                pause = prompt("Pulse Enter para continuar...")
            }
        }
    }
}

menu ()
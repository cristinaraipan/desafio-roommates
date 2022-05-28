const fs = require('fs');



const gastoCompartido = () => {
    let gasto = fs.readFileSync("files/gastos.json", "utf-8")
    let roommate = fs.readFileSync("files/roommates.json", "utf-8")
    gasto = JSON.parse(gasto)
    roommate = JSON.parse(roommate)

    let totalRoommates = roommate.roommates.length

    let totalGastos = 0;
    gasto.gastos.forEach(element => {
        totalGastos = totalGastos + element.monto

    });
    let porcionPago = totalGastos / totalRoommates;
    roommate.roommates.forEach(element => {
        element.debe = porcionPago
    });
    /* console.log(roommate) */
    roommate = JSON.stringify(roommate, null, 4)
    fs.writeFileSync(`${__dirname}/files/roommates.json`, roommate, 'utf-8');

};

const gastoUnitario = () => {
    let gasto = fs.readFileSync("files/gastos.json", "utf-8")
    let roommate = fs.readFileSync("files/roommates.json", "utf-8")

    gasto = JSON.parse(gasto)
    roommate = JSON.parse(roommate)

    let totalPago = 0
    let totalGrupo = roommate.roommates.length
    

    roommate.roommates.forEach(companero => {
        let nombreBuscado = companero.nombre
        let gastosEncontrados = gasto.gastos.filter(elemento => elemento.roommate == nombreBuscado)
        let sumaGastos = 0;
        gastosEncontrados.forEach(g => sumaGastos = sumaGastos + g.monto)
        console.log(sumaGastos)
      
        if (gastosEncontrados.length > 0){
            totalPago = sumaGastos/totalGrupo
            companero.recibe = totalPago
        }else{
            companero.recibe = 0
        }
    })
    roommate = JSON.stringify(roommate, null, 4);
    fs.writeFileSync(`${__dirname}/files/roommates.json`, roommate, 'utf-8')
};






module.exports = { gastoCompartido, gastoUnitario }
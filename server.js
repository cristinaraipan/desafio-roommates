const express = require('express');
const app = express();
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { nuevoRoommate, guardarRoommate } = require("./roommates");
const { gastoCompartido, gastoUnitario  } = require("./calculos")
const send = require("./correos");

app.use(bodyParser.json());
app.use(express.json())
app.listen(3000, () => console.log("Servidor express activo http://localhost:3000"));

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.post("/roommate", async (req, res) => {
    try {
        const roommate = await nuevoRoommate()
        await guardarRoommate(roommate)
        //se actualiza el gastoCompartido luego de que se reescribe el json de gastos
        gastoCompartido()
        res.status(201).send(roommate)
    } catch (error) {
        res.status(500).send(error)
    }
});

app.get("/roommates", (req, res) => {

    res.sendFile(`${__dirname}/files/roommates.json`);
});
app.get("/gastos", (req, res) => {
    res.sendFile(`${__dirname}/files/gastos.json`);
});

app.post("/gasto", async(req, res) => {
    try {
        let gasto = req.body;
        let datos = fs.readFileSync(`${__dirname}/files/gastos.json`);
        datos = JSON.parse(datos);
        let datosRoommate = fs.readFileSync(`${__dirname}/files/roommates.json`)
        datosRoommate = JSON.parse(datosRoommate)
        let id = uuidv4().slice(30);
        const correos = datosRoommate.roommates.map((u) => u.email);
        
        gasto = {
            id: id,
            ...gasto
        }
        datos.gastos.push(gasto);
        datos = JSON.stringify(datos, null, 4);
        fs.writeFileSync(`${__dirname}/files/gastos.json`, datos, 'utf-8');
        
        //se actualiza el gastoCompartido luego de que se reescribe el json de gastos
        gastoUnitario()
        gastoCompartido()
        await send(gasto, correos)

        res.status(201).send(gasto);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put("/gasto", (req, res) => {
    try {
        const id = req.query.id;
        const { roommate, descripcion, monto } = req.body;
        let contenido = JSON.parse(fs.readFileSync(`${__dirname}/files/gastos.json`, "utf8"));

        const indice = contenido.gastos.findIndex(Element => Element.id == id)
       /*  console.log(req.query) */
        contenido.gastos[indice].roommate = roommate;
        contenido.gastos[indice].descripcion = descripcion;
        contenido.gastos[indice].monto = monto;

        contenido = JSON.stringify(contenido, null, 4);
        fs.writeFileSync(`${__dirname}/files/gastos.json`, contenido, "utf8");
        //se actualiza el gastoCompartido luego de que se reescribe el json de gastos
        gastoUnitario()
        gastoCompartido();
        res.json({ message: "Gasto modificado exitosamente" });
    } catch (error) {
        res.status(500).send(error)
    }
});
app.delete("/gasto", async (req, res) => {
    try {
        let id = req.query.id;
        /* console.log(id) */
        let contenido = fs.readFileSync(`${__dirname}/files/gastos.json`);
        contenido = JSON.parse(contenido);
        let indice = contenido.gastos.findIndex(elemento => elemento.id == id);
        contenido.gastos.splice(indice, 1);
        contenido = JSON.stringify(contenido, null, 4);
        fs.writeFileSync(`${__dirname}/files/gastos.json`, contenido, "utf8");
        //se actualiza el gastoCompartido luego de que se reescribe el json de gastos
        gastoUnitario()
        gastoCompartido()
        res.send("Eliminación exitosa");
    } catch (error) {
        res.status(500).send(error)
    }

})

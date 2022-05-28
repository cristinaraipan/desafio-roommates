const axios = require('axios')
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;

const nuevoRoommate = async () => {
    const {data} = await axios.get('https://randomuser.me/api')
    const roommate = data.results[0]
    const nRoommate = {
        id: uuidv4().slice(30),
        nombre: `${roommate.name.first} ${roommate.name.last}`,
        debe: 0,
        recibe: 0,
        email: roommate.email
    }
    return nRoommate
}

const guardarRoommate = async (roommate) => {
    const roommateJSON = await fs.readFile("files/roommates.json", "utf8");
    const { roommates } = JSON.parse(roommateJSON)
    roommates.push(roommate);
    await fs.writeFile("files/roommates.json", JSON.stringify({ roommates }, null, 4));
}


module.exports = { nuevoRoommate, guardarRoommate }
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "instructor.iaim@gmail.com",
    pass: "Bootcamp0006",
  },
});

const send = async (gasto, correos) => {
  let mailOptions = {
    from: "instructor.iaim@gmail.com",
    to: ["arikel17@gmail.com"].concat(correos),
    subject: "Nuevo gasto",
    html: `<h2> Anuncio: Se agregó un nuevo gasto: ${gasto.roommate}, ${gasto.descripcion}, ${gasto.monto}</h2>`,
    
  };
  console.log(mailOptions)
  await transporter.sendMail(mailOptions);
};


module.exports = send;
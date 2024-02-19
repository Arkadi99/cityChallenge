import nodemailer from "nodemailer"
import _ from "lodash";
import path from "path";
import fs from "fs"


let transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "citychallenge@mail.ru", // generated ethereal user
        pass: "GrydnKPf1QXdtBherFqK" // generated ethereal password
    },
});

class ConfirmMail {
    static confirm = async (email, activationCode) => {
        const html = `
         <a href="http://localhost:4000/users/confirmEmail?code=${activationCode}&email=${email}">
            Verify Email
        </a>`
        let info = await transporter.sendMail({
            from: '"City Challenge" <citychallenge@mail.ru>', // sender address
            to: email, // list of receivers
            subject: "City Challenge ✔", // Subject line
            html: html,
        });
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    static confirmChange = async (email, activationCode) => {
        const html = `<h1>This is your activation code</h1><br><p>${activationCode}</p>`
        let info = await transporter.sendMail({
            from: '"City Challenge" <citychallenge@mail.ru>',
            to: email, // list of receivers
            subject: "City Challenge ✔",
            html: html
        });
        console.log("Message sent: %s", info.messageId);
    }
}

export default ConfirmMail

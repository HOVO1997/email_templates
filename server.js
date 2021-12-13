"use strict";
const nodemailer = require("nodemailer");
const fs = require('fs');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
// async..await is not allowed in global scope, must use a wrapper
async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: await readFile('templates/news.html', 'utf8'), // html body
        attachments: [{
            filename: 'Logo.svg',
            path: __dirname +'\\images\\Logo.svg',
            cid: 'logo' //my mistake was putting "cid:logo@cid" here!
        },
            {
                filename: 'flat-color-icons_graduation-cap.png',
                path: __dirname +'\\images\\flat-color-icons_graduation-cap.png',
                cid: 'cap' //my mistake was putting "cid:logo@cid" here!
            }]
    });
    console.log(__dirname +'\\images\\Logo.svg')
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();

client.on('qr', qr =>{
    qrcode.generate(qr, {small: true});
})

client.initialize();

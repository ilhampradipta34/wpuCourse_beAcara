/* BUAT SECRET KEY UNTUK PASSWORD */


const crypto = require('crypto');

const SECRET = crypto.randomBytes(16).toString('hex');

console.log(SECRET);
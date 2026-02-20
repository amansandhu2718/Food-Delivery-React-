require('dotenv').config();
const db = require('./src/config/db');
db.query('SELECT NOW()').then(res => {
    console.log('Success:', res.rows[0]);
    process.exit(0);
}).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});

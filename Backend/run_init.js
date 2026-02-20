require('dotenv').config();
const initDb = require('./src/config/initDb');
initDb().then(() => {
    console.log('Migration complete');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});

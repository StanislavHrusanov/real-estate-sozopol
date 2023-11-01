const express = require('express');
const { initializeDatabase } = require('./config/database');
const { PORT } = require('./config/env');

const app = express();

require('./config/handlebars')(app);

initializeDatabase()
    .then(() => {
        app.listen(PORT, () => console.log(`App is listening on port ${PORT}...`));
    })
    .catch((err) => {
        console.log(`App cannot connect to database`, err);
    });
const express = require('express');
var cors = require('cors');

const tables = require('./modules/tables');

const logger = require('./utils/logger');
const app = express();

// Middleware-ek
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', tables);

app.listen(process.env.PORT, () => {
    logger.info(`Server listening on http://localhost:${process.env.PORT}`);
});

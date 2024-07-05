const dotenv = require('dotenv');

const environment = 'DEV';

dotenv.config({
    path: environment === 'PRODUCTION' ? `.env.prod` : '.env.dev'
});

dotenv.config();
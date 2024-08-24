const swaggerJSDoc = require('swagger-jsdoc');
const { serve, setup } = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Ecommerce',
            description: 'API diseñada para un Ecommerce'
        }
    },
    apis: [`${__dirname}/**/*.yml`]
}

const specs = swaggerJSDoc(swaggerOptions);

module.exports = {
    serve,
    setup: setup(specs)
}
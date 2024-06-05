const { fakerES: faker } = require("@faker-js/faker")

/**
 * Generates a mock product object.
 * @return {object} A product object.
 */
const generateProduct = () => {
    const thumbnails = []
    const randomNumber = parseInt(Math.random() * 5 + 1);

    for (let i = 0; i < randomNumber; i++) {
        thumbnails.push(faker.image.url());
    }

    const product = {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        code: faker.commerce.isbn(),
        price: +faker.commerce.price(),
        status: faker.datatype.boolean(),
        stock: faker.number.int({ min: 0, max: 150 }),
        category: faker.commerce.department(),
        thumbnails,
    }

    return product;
}

/**
 * Generates an array of product objects.
 *
 * This function creates an array of product objects by calling the 
 * `generateProduct` function `quantity` times. Each product object represents 
 * a unique product with various properties (e.g., name, price, category).
 * 
 * @param {number} - The number of product objects to generate
 * @default quantity 100
 * @returns {Array<object>} An array containing 100 product objects.
 */
const generateProducts = (quantity = 100) => {
    const products = [];

    for (let i = 0; i < quantity; i++) {
        products.push(generateProduct());
    }

    return products;
}

module.exports = {
    generateProduct,
    generateProducts
}
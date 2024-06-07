// Esta será utilizada en la propiedad: Cuase del CustomError.
const generateInvalidProductDataError = ({ title, code, price, status, stock, category, thumbnails }) => {
    const params = { title, code, price, status, stock, category, thumbnails };
    const undefines = Object.keys(params).filter(key => params[key] === undefined);

    // InvalidProductData
    let cause = `Invalid Product data:
    - title: [ String ], recived ${title} - type [ ${typeof title} ]
    - code:  [ String ], recived ${code} - type [ ${typeof code} ]
    - price: [ Number ], recived ${price} - type [ ${typeof price} ]
    - status: [ Boolean ], recived ${status} - type [ ${typeof status} ]
    - stock:  [ Number ], recived ${stock} - type [ ${typeof stock} ]
    - category: [ String ], recived ${category} - type [ ${typeof category} ]
    - thumbnails: [ Array<String> ], recived ${thumbnails} - type [ ${typeof thumbnails} ]

    Valores undefined: ${undefines}
    `
    return cause;
};

const generateProductNotFoundError = ({ id }) => {
    // ProductNotFound
    const cause = `Product not found:
    - ProductID: sholud be a non-empty [ String ], recived ${id} - type [ ${typeof id} ]
    `
    return cause;
};

const generateProductNotDeleteError = ({ id }) => {
    // ProductNotDelete
    const cause = `Product not found:
    - ProductID: sholud be a non-empty [ String ], recived ${id} - type [ ${typeof id} ]
    `
    return cause;
};

module.exports = {
    generateInvalidProductDataError,
    generateProductNotFoundError,
    generateProductNotDeleteError
}
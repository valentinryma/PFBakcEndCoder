const generateCartNotFoundError = ({ id }) => {
    // CartNotFound
    const cause = `Cart not found:
    - CartID: sholud be a non-empty [ String ], recived ${id} - type [ ${typeof id} ]
    `
    return cause;
}

const generateCartNotDeleteError = ({ id }) => {
    // CartNotDelete
    const cause = `Cart not found:
    - CartID: sholud be a non-empty [ String ], recived ${id} - type [ ${typeof id} ]
    `
    return cause;
}

module.exports = {
    generateCartNotFoundError,
    generateCartNotDeleteError
}
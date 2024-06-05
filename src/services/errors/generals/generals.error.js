// Esta será utilizada en la propiedad: Cuase del CustomError.
const generateDBNotAlreadyError = ({ readyState }) => {
    // DBNotAlready
    const cause = `Data base not already:
    - readyState: sholud be a [ Number === 1 ], recived ${readyState} - type [ ${typeof readyState} ]
    `
    return cause;
};

const generateInvalidObjectIdError = ({ id }) => {
    // InvalidObjectId
    const cause = `Invalid object ID:
    - ObjectId: should be a 24 character hex string, 12 byte Uint8Array, or an integer
    - recive: ${id}
    - type: ${typeof id}
    `
    return cause;
};

module.exports = {
    generateDBNotAlreadyError,
    generateInvalidObjectIdError
}
const bcrypt = require('bcrypt');

const hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

const validatePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
}

module.exports = {
    hashPassword,
    validatePassword,
}
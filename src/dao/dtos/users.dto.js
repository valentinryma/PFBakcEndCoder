class UserDTO {
    constructor(user) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.age = user.age;
        this.email = user.email;
        this.id = user._id.toString();
        this.message = 'Formateado desde DTO!'
    }
}

module.exports = { UserDTO }
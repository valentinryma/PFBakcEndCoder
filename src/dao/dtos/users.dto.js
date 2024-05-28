class UserDTO {
    constructor(user) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.age = user.age;
        this.email = user.email;
        this.message = 'Formateado desde DTO'
        this.id = user._id.toString();
    }
}

module.exports = { UserDTO }
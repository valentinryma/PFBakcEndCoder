class UserDTO {
    constructor(user) {
        console.log('user:', user);

        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.age = user.age;
        this.email = user.email;
        this.role = user.role;
        this.id = user._id.toString();
    }
}

module.exports = { UserDTO }
class CartDTO {
    constructor(cart) {
        this.id = cart._id;

        this.products = cart.products;
    };

    toJSON() {
        this.products.forEach(product => {
            delete product._id;
        });

        return {
            id: this.id,

            products: this.products
        };
    };
};

module.exports = CartDTO;
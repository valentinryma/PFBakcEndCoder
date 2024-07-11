const { CartModel, ProductModel, getReadyState } = require('../models');

class CartsMongoDAO {
    constructor() { }

    async prepare() {
        if (!getReadyState(CartModel)) {
            // Error logger
            return console.log('DB not already');
        };
    };

    async getAll() {
        // TODO: Revisar dto de carts.products (EL CONSOLE LOG!!);
        const results = await CartModel.find()

        const carts = results.map((cart) => {
            return cart.toObject({ virtuals: true })
        });

        return carts;
    };

    async getById(cid) {
        return await CartModel.findById(cid).lean().populate("products._id");
    };

    async create() {
        return await CartModel.create({ products: [] });
    };

    async addProduct(cid, pid, quantity) {
        // TODO - ErrorHandler - CustomErrors
        // TODO - Utilizar findAndValidateModelIsFound (v1)
        // const cart = await CartModel.findById(cid);
        const cart = await CartModel.findById(cid);

        if (!cart) {
            console.log("Cart not found");
            return 0;
        };

        const product = await ProductModel.findById(pid);

        if (!product) {
            console.log("Product not found");
            return 0;
        };

        // Verifica si ya existe el producto en el carrito.
        let found = cart.products.find(
            (product) => product._id.toString() === pid
        );

        // En caso de que exista, unicamente actualiza el quantity (no lo vuelve a agregar)
        if (found) {
            quantity += found.quantity;

            return await CartModel.updateOne(
                { _id: cid, 'products._id': pid },
                {
                    $set:
                        { 'products.$.quantity': quantity }
                }
            );
        };

        // Sino lo agrega.
        return await CartModel.updateOne(
            { _id: cid },
            {
                $push:
                {
                    products: { _id: pid, quantity }
                }
            }
        );
    };

    async removeProduct(cid, pid) {
        const cart = await CartModel.findById(cid);

        if (!cart) {
            console.log("Cart not found");
            return 0;
        };

        const product = await ProductModel.findById(pid);

        if (!product) {
            console.log("Product not found");
            return 0;
        };

        return await CartModel.updateOne(
            { _id: cid },
            {
                $pull: {
                    products: { _id: pid }
                }
            }
        );
    };

    async deleteById(cid) {
        const { deletedCount } = await CartModel.deleteOne({ _id: cid });
        if (deletedCount == 0) {
            // TODO: Loggear - Custom Error
            console.log('Product Not Found')
        };

        return;
    };
};

module.exports = { CartsMongoDAO };
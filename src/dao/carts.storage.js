const mongoose = require('mongoose');

// Models
const CartModel = require(`${__dirname}/models/cart.model.js`);
const ProductModel = require(`${__dirname}/models/product.model.js`);

class CartsStorage {
    constructor() { }
    async prepare() {
        if (CartModel.db.readyState != 1) {
            throw new Error('Must connect to MongoDB');
        }
    }


    async getAll() {
        try {
            const results = await CartModel.find();
            // console.log(`Carts encontrados: ${carts}`);

            // Convierte los documentos Mongo en Objetos
            const carts = results.map(cart => cart.toObject({ virtuals: true }));
            return carts;

        } catch (e) {
            console.log(`Error en ${__dirname} - getAll`, e);
            return { error: e.message }
        }
    }


    async getById(id) {
        try {
            const cart = await CartModel.findOne({ _id: id });
            if (!cart) throw new Error('not found');
            // console.log(`Cart encontrado: ${cart}`);
            return cart;

        } catch (e) {
            console.log(`Error en ${__dirname} - getById`, e);
            return { error: e.message }
        }
    }


    // Crea nuevo carrito vacio
    async createOne() {
        try {
            const newCart = await CartModel.create({ products: [] });
            return newCart;

        } catch (e) {
            console.log(`Error en ${__dirname} - createOne`, e);
            return { error: e.message }
        }
    }


    async deleteById(id) {
        try {
            const cartDelete = await CartModel.deleteOne({ _id: id });
            if (cartDelete.deletedCount == 0) {
                throw new Error('not found');
            }
            // console.log(`Carrito eliminado: ${cartDelete}`);
            return cartDelete;

        } catch (e) {
            console.log(`Error en ${__dirname} - deleteById`, e);
            return { error: e.message }
        }
    }


    async addProductInCart(cid, product) {
        const { pid, quantity } = product

        const cart = await CartModel.findOne({ _id: cid });
        if (!cart) throw new Error('not found');

        const productToAdd = await ProductModel.findOne({ _id: pid });
        if (!productToAdd) throw new Error('not found');

        // Verifica si el producto ya existe en el carrito.
        let found = cart.products.find((product) => (product._id._id.toString() === pid));

        // Actualiza el quantity del producto del carrito, si esta ya existe en el mismo.
        if (found) {
            product.quantity += found.quantity;
            try {
                const cartUpdate = await CartModel.updateOne(
                    { _id: id, 'products._id:': pid },
                    { $set: { 'products.$.quantity': product.quantity } }
                );
                // console.log(`Carrito actualizado: ${cartUpdate}`);
                return cartUpdate;

            } catch (e) {
                console.log(`Error en ${__dirname} - addProductInCart`, e);
                return { error: e.message }
            }
        }

        try {
            // Agrega el producto en el carrito.
            const cartUpdate = await CartModel.updateOne({ _id: id }, {
                $push: { products: { _id: pid, quantity } }
            });
            return cartUpdate;

        } catch (e) {
            console.log(`Error en ${__dirname} - addProductInCart`, e);
            return { error: e.message }
        }
    }


    // Pisa todos los productos del carrito con un array de productos | Sirve como clearCart (cid, [])
    async updateCartProductArray(cid, products) {
        try {
            const cart = await CartModel.findOne({ _id: cid });
            if (!cart) throw new Error('not found');

            const cartUpdate = await CartModel.updateOne({ _id: cid }, {
                $set: { products }
            })

            // console.log(`Carrito actualizado: ${cartUpdate}`);
            return cartUpdate;

        } catch (e) {
            console.log(`Error en ${__dirname} - updateCartProductArray`, e);
            return { error: e.message }
        }
    }

    // Retorna el numero total de productos dentro de un carrito (NO tiene en cuenta quantity.)
    async getTotalProducts(cid) {
        const cart = await CartModel.findOne({ _id: cid });
        if (!cart) throw new Error('not found');

        try {
            const result = await CartModel.aggregate([ // Pipeline
                { // Stage 1: "Selecciona" el carrito 
                    $match: { _id: new mongoose.Types.ObjectId(cid) }
                },
                { // Stage 2: Genera un campo "totalProducts" el cual contiene el tamaño del arreglo "prdoucts" (cantidad de productos)
                    $project: { totalProducts: { $size: '$products' } }
                }
            ]);

            const total = +(result[0].totalProducts);

            // console.log(`total productos en el carrito: ${total}`)
            return total;

        } catch (error) {
            console.log(`Error en ${__dirname} - getTotalProducts`, e);
            return { error: e.message }
        }
    }

    // Actualiza la cantidad de un producto en un carrito
    async updateCartProductQuantity(cid, product) {
        const pid = product.pid;
        const newQuantity = product.quantity;

        const cart = await CartModel.findOne({ _id: cid });
        if (!cart) throw new Error('not found')

        const productFound = await ProductModel.findOne({ _id: pid });
        if (!productFound) throw new Error('not found')

        // Verifica la existencia del producto en el carrito
        const found = cart.products.find((product) => {
            return (product.id).toString === pid;
        })

        if (!found) {
            console.log('Product not in cart');
            throw new Error('not found')
        }

        // Actualiza el quantity del producto
        try {
            const cartUpdate = CartModel.updateOne({ _id: cid, 'products.$._id': pid }, {
                $set: { 'products.$.quantity': newQuantity }
            })

            // console.log(`Carrito actualizado: ${cartUpdate}`)
            return cartUpdate;

        } catch (e) {
            console.log(`Error en ${__dirname} - updateCartProductQuantity`, e);
            return { error: e.message }
        }
    }

}
module.exports = { CartsStorage }
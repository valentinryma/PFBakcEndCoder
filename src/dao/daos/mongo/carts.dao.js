const mongoose = require('mongoose');

// Models
const CartModel = require(`${__dirname}/../../models/cart.model.js`);
const ProductModel = require(`${__dirname}/../../models/product.model.js`);
const TicketModel = require(`${__dirname}/../../models/ticket.model.js`);

class CartsMongoDAO {
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
            throw new Error(e)
        }
    }


    async getById(id) {
        try {
            const cart = await CartModel.findOne({ _id: id }).lean().populate('products._id');
            if (!cart) throw new Error('cart not found');
            // console.log(`Cart encontrado: ${cart}`);
            return cart;

        } catch (e) {
            console.log(`Error en ${__dirname} - getById`, e);
            throw new Error(e)
        }
    }


    // Crea nuevo carrito vacio
    async createOne() {
        try {
            const newCart = await CartModel.create({ products: [] });
            return newCart;

        } catch (e) {
            console.log(`Error en ${__dirname} - createOne`, e);
            throw new Error(e)
        }
    }


    async deleteById(id) {
        try {
            const cartDelete = await CartModel.deleteOne({ _id: id });
            if (cartDelete.deletedCount == 0) {
                throw new Error('cart not found');
            }
            // console.log(`Carrito eliminado: ${cartDelete}`);
            return cartDelete;

        } catch (e) {
            console.log(`Error en ${__dirname} - deleteById`, e);
            throw new Error(e)
        }
    }


    async addProductInCart(cid, product) {
        const { pid, quantity } = product

        const cart = await CartModel.findOne({ _id: cid });
        if (!cart) throw new Error('cart not found');

        const productToAdd = await ProductModel.findOne({ _id: pid });
        if (!productToAdd) throw new Error('product not found');

        // Verifica si el producto ya existe en el carrito.
        let found = cart.products.find((product) => {
            return (product._id._id.toString() === pid)
        });

        // Actualiza el quantity del producto del carrito, si esta ya existe en el mismo.
        if (found) {
            product.quantity += found.quantity;

            try {
                const cartUpdate = await CartModel.updateOne({ _id: cid, 'products._id': pid },
                    { $set: { 'products.$.quantity': product.quantity } }
                )

                // console.log(`Carrito actualizado: ${await CartModel.findOne({ _id: cid })}`);
                return cartUpdate;

            } catch (e) {
                console.log(`Error en ${__dirname} - addProductInCart \n`, e);
                throw new Error(e)
            }
        }

        try {
            // Agrega el producto en el carrito.
            const cartUpdate = await CartModel.updateOne({ _id: cid }, {
                $push: { products: { _id: pid, quantity } }
            });

            return cartUpdate;

        } catch (e) {
            console.log(`Error en ${__dirname} - addProductInCart`, e);
            throw new Error(e)
        }
    }

    async deleteProductInCart(cid, pid) {
        const cart = await CartModel.findOne({ _id: cid });
        if (!cart) throw new Error('cart not found');

        const product = await ProductModel.findOne({ _id: pid });
        if (!product) throw new Error('product not found');

        const cartUpdate = await CartModel.updateOne({ _id: cid }, {
            $pull: { products: { _id: pid } }
        })

        return cartUpdate;
    }

    // Pisa todos los productos del carrito con un array de productos | Sirve como clearCart (cid, [])
    async updateCartProductArray(cid, products) {
        try {
            const cart = await CartModel.findOne({ _id: cid });
            if (!cart) throw new Error('cart not found');

            const cartUpdate = await CartModel.updateOne({ _id: cid }, {
                $set: { products }
            })

            // console.log(`Carrito actualizado: ${cartUpdate}`);
            return cartUpdate;

        } catch (e) {
            console.log(`Error en ${__dirname} - updateCartProductArray`, e);
            throw new Error(e)
        }
    }

    // Retorna el numero total de productos dentro de un carrito (NO tiene en cuenta quantity.)
    async getTotalProducts(cid) {
        const cart = await CartModel.findOne({ _id: cid });
        if (!cart) throw new Error('cart not found');

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
            throw new Error(e)
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
            return (product.id).toString() === pid;
        })

        if (!found) {
            console.log('Product not in cart');
            throw new Error('not found')
        }

        // Actualiza el quantity del producto
        try {
            const cartUpdate = await CartModel.updateOne({ _id: cid, 'products._id': pid }, {
                $set: { 'products.$.quantity': newQuantity }
            })

            // console.log(`Carrito actualizado: ${cartUpdate}`)
            return cartUpdate;

        } catch (e) {
            console.log(`Error en ${__dirname} - updateCartProductQuantity`, e);
            throw new Error(e)
        }
    }

    // Proceso de Compra
    async purchase(cid, purchaserEmail) {
        // Carrito Inicial
        const cart = await CartModel.findOne({ _id: cid }).lean().populate('products._id');
        if (!cart) throw new Error('cart not found');

        // Almacena los Productos que no pudo comprar en un Array
        let productsCantBuy = [];

        for (const product of cart.products) {
            // Si la cantidad de compra supera el stock del producto.
            if (product._id.stock <= product.quantity) {
                const pid = product._id._id.toString()
                const quantity = product.quantity;

                let productCantBuy = { _id: pid, quantity }
                productsCantBuy.push(productCantBuy);
            }
        }

        // Actualiza el carrito quitando los productos que se pudieron comprar. (No disponible para compra)
        // Deja los que no pudo comprar, para reintentar en otro momento.
        try {
            await CartModel.updateOne({ _id: cid }, { $set: { products: productsCantBuy } })
        } catch (e) {
            console.log(`Error en ${__dirname} - purchase`, e);
            throw new Error(e)
        }

        // Monto total + Info del producto.
        let priceTotal = 0;
        let productsResume = [];

        for (const product of cart.products) {
            // Filtra por los productos con stock (Disponible para compra)
            if (product._id.stock >= product.quantity) {
                // Crea un producto simplificado para mostrar en el resumen del ticket.
                const quantity = product.quantity;
                const price = product._id.price

                const productResume = { quantity, pid: product._id._id.toString() }
                productsResume.push(productResume);

                // Monto total de la compra (NO tiene en cuenta los productos sin stock suficiente)
                priceTotal += product.quantity * product._id.price;
            }
        }

        // genera el ticket con los datos de la compra. 
        const ticket = {
            code: cid + Date.now(),
            purchase_datatime: new Date,
            purchaser: purchaserEmail,
            products: productsResume, // Agrega información de los productos comprados
            amount: priceTotal,
        }

        // Crea el ticket en el sistema
        const newTicket = await TicketModel.create(ticket);
        console.log(newTicket);

        // Filtra los productos que si seran comprados, para posteriormente actualizar su stock.
        const productsToUpdate = cart.products.filter(p => p._id.stock >= p.quantity);

        // Resta el stock de los productos comprados
        for (const product of productsToUpdate) {
            product._id.stock -= product.quantity;

            const pid = product._id._id.toString();
            const newQuantity = product._id.stock;

            // Actualiza el stock del producto comprado
            try {
                await ProductModel.updateOne({ _id: pid }, { $set: { stock: newQuantity } });

            } catch (e) {
                // console.log(`Error en ${__dirname} - purchase`, e);
                throw new Error(e)
            }
        }

        // Retorna el Ticket y un Array con los productos que no pudo comprar (Antes ya actualiza el carrito del user actual, con los productos que no pudo comprar).
        return [ticket, productsCantBuy];
    }
}

module.exports = { CartsMongoDAO }
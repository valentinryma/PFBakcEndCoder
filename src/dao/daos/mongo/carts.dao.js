const mongoose = require('mongoose');

// Models
const CartModel = require(`${__dirname}/../../models/cart.model.js`);
const ProductModel = require(`${__dirname}/../../models/product.model.js`);
const TicketModel = require(`${__dirname}/../../models/ticket.model.js`);

// Customs Errors & Validations
const { CustomError } = require(`../../../services/errors/CustomError.js`);
const { ErrorCodes } = require(`../../../services/errors/errorCodes.js`);

const { generateDBNotAlreadyError } = require(`../../../services/errors/generals/generals.error.js`); // Generals Errors
const { generateProductNotDeleteError } = require(`../../../services/products/products.error.js`); // Product Errors
const { generateCartNotDeleteError } = require(`../../../services/carts/carts.error.js`)

// Utils: Services
const { findAndValidateModelIsFound, validateModelIsFound } = require(`../../../services/util-services/utils.services.js`);
const userModel = require('../../models/user.model.js');
class CartsMongoDAO {
    constructor() { }

    async prepare() {
        const readyState = CartModel.db.readyState
        if (readyState != 1) {
            throw CustomError.createError({
                name: 'DBNotAlready',
                cause: generateDBNotAlreadyError({ readyState }),
                message: 'Data base is not already',
                code: ErrorCodes.DATABASE_ERROR
            });
        }
    }

    async getAll() {
        const results = await CartModel.find();
        const carts = results.map(cart => cart.toObject({ virtuals: true })); // Convierte los documentos Mongo en Objetos

        return carts;
    }


    async getById(id) {
        // Valida que haya encontrado un cart.
        const cart = await CartModel.findOne({ _id: id }).lean().populate('products._id');
        validateModelIsFound(cart, id, 'cart');

        return cart;
    }

    // Crea nuevo carrito vacio
    async createOne() {
        const newCart = await CartModel.create({ products: [] });
        return newCart;
    }


    async deleteById(id) {
        // Verifica la existencia del Cart y retorna el mismo.
        const cartDelete = await findAndValidateModelIsFound(CartModel, id, 'cart')

        if (cartDelete.deletedCount == 0) {
            throw CustomError.createError({
                name: 'CartNotDelete',
                cause: generateCartNotDeleteError({ id }),
                message: 'Cart can not delete',
                code: ErrorCodes.CART_DELETION_FAILED
            });
        }

        return cartDelete;
    }

    async addProductInCart(cid, pid, uid, quantity) {

        const user = await userModel.findById({ _id: uid });
        const product = await ProductModel.findById({ _id: pid });

        const productOwner = product.owner?.toString() || 'null';

        const isPremiumUser = user.role === 'premium';
        const isUserOwnerProduct = productOwner === uid.toString();

        if (isPremiumUser && isUserOwnerProduct) {
            throw CustomError.createError({
                name: 'PremiumUserDeleteOwnerProduct',
                cause: `Usuario Premium no puede agregar al carrito un producto propio`,
                message: 'Cart can not update',
                code: ErrorCodes.CART_UPDATE_FAILED
            });
        }

        // Verifica que exista el Cart
        const cart = await findAndValidateModelIsFound(CartModel, cid, 'cart');

        // Verifica que exista el Product
        await findAndValidateModelIsFound(ProductModel, pid, 'product');

        // Verifica si el producto ya existe en el carrito.
        let found = cart.products.find((product) => {
            return (product._id._id.toString() === pid)
        });

        // Actualiza el quantity del producto del carrito, si esta ya existe en el mismo.
        if (found) {
            quantity += found.quantity;

            // Try-catch?
            const cartUpdate = await CartModel.updateOne({ _id: cid, 'products._id': pid },
                { $set: { 'products.$.quantity': quantity } }
            )

            return cartUpdate;
        }

        // Agrega el producto en el carrito.
        // Try-catch?
        const cartUpdate = await CartModel.updateOne({ _id: cid }, {
            $push: { products: { _id: pid, quantity } }
        });

        return cartUpdate;

    }

    //generateProductNotDeleteError
    async deleteProductInCart(cid, pid, uid) {
        // Verifica que exista el Cart
        const cart = await findAndValidateModelIsFound(CartModel, cid, 'cart')
        const user = await userModel.findById({ _id: uid });
        // Verifica que exista el Product
        const product = await findAndValidateModelIsFound(ProductModel, pid, 'product')

        const productOwner = product.owner?.toString() || 'null';

        const isPremiumUser = user.role === 'premium';
        const isUserOwnerProduct = productOwner === uid.toString();

        if (isPremiumUser && isUserOwnerProduct) {
            throw CustomError.createError({
                name: 'PremiumUserDeleteOwnerProduct',
                cause: `Usuario Premium no puede agregar al carrito un producto propio`,
                message: 'Cart can not update',
                code: ErrorCodes.CART_UPDATE_FAILED
            });
        }

        const cartUpdate = await CartModel.updateOne({ _id: cid }, {
            $pull: { products: { _id: pid } }
        })


        return cartUpdate;
    }

    // Pisa todos los productos del carrito con un array de productos | Sirve como clearCart (cid, [])
    async updateCartProductArray(cid, products) {
        // Verifica la existencia del Cart.
        await findAndValidateModelIsFound(CartModel, cid, 'cart');

        const cartUpdate = await CartModel.updateOne({ _id: cid }, {
            $set: { products }
        })

        return cartUpdate;
    }

    // Retorna el numero total de productos dentro de un carrito (NO tiene en cuenta quantity.)
    async getTotalProducts(cid) {
        // Verifica que exista el Cart
        await findAndValidateModelIsFound(CartModel, cid, 'cart');

        const result = await CartModel.aggregate([ // Pipeline
            { // Stage 1: "Selecciona" el carrito 
                $match: { _id: new mongoose.Types.ObjectId(cid) }
            },
            { // Stage 2: Genera un campo "totalProducts" el cual contiene el tamaño del arreglo "prdoucts" (cantidad de productos)
                $project: { totalProducts: { $size: '$products' } }
            }
        ]);

        const total = +(result[0].totalProducts);
        return total;
    }

    // Actualiza la cantidad de un producto en un carrito
    async updateCartProductQuantity(cid, pid, newQuantity) {
        // Verifica que exista el Cart
        const cart = await findAndValidateModelIsFound(CartModel, cid, 'cart')

        // Verifica que exista el Product
        await findAndValidateModelIsFound(ProductModel, pid, 'product')

        // Verifica la existencia del producto en el carrito
        const productFound = cart.products.find((product) => {
            return (product.id).toString() === pid;
        })

        if (!productFound) {
            throw CustomError.createError({
                name: 'ProductNotInCart',
                cause: `Product not in cart`,
                message: 'Error trying to update product quantity in cart',
                code: ErrorCodes.CART_UPDATE_FAILED
            })
        }

        // Actualiza el quantity del producto
        const cartUpdate = await CartModel.updateOne({ _id: cid, 'products._id': pid }, {
            $set: { 'products.$.quantity': newQuantity }
        })

        // console.log(`Carrito actualizado: ${cartUpdate}`)
        return cartUpdate;

    }

    // Proceso de Compra
    async purchase(cid, purchaserEmail) {
        // Carrito Inicial
        const cart = await findAndValidateModelIsFound(CartModel, pid, 'cart');

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
        await CartModel.updateOne({ _id: cid }, { $set: { products: productsCantBuy } })

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
            await ProductModel.updateOne({ _id: pid }, { $set: { stock: newQuantity } });
        }

        // Retorna el Ticket y un Array con los productos que no pudo comprar (Antes ya actualiza el carrito del user actual, con los productos que no pudo comprar).
        return [ticket, productsCantBuy];
    }
}

module.exports = { CartsMongoDAO }
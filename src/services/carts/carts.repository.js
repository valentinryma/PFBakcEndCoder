// Custom Erros & Validations
const { CustomError } = require(`${__dirname}/../errors/CustomError.js`);
const { ErrorCodes } = require(`${__dirname}/../errors/errorCodes.js`);
const { validateIds } = require(`${__dirname}/../util-services/utils.services.js`);

class CartsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getAll() {
        return await this.dao.getAll();
    }

    async getById(id) {
        // Valida que sea un ObjectId valido.
        validateIds(id);
        return await this.dao.getById(id);
    }

    async createOne() {
        return await this.dao.createOne();
    }

    async deleteById(id) {
        // Valida que sea un ObjectId valido.
        validateIds(id);

        return await this.dao.deleteById(id);
    }

    async addProductInCart(cid, pid, uid, quantity) {
        // Valida que venga el productID dentro de product.
        if (!pid) {
            throw CustomError.createError({
                name: 'InvalidProductData',
                cause: `Invalid Product data:
            - product.pid: sholud be a non-empty [ String ], recived ${pid} - type [ ${typeof pid} ]
            `,
                message: 'Error trying to add product in cart',
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        if (!uid) {
            throw CustomError.createError({
                name: 'InvalidUserData',
                cause: `Invalid User data:
            - product.uid: sholud be a non-empty [ String ], recived ${uid} - type [ ${typeof uid} ]
            `,
                message: 'Error trying to add product in cart',
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        // Valida los id de cart y product.
        validateIds(cid, pid);

        return await this.dao.addProductInCart(cid, pid, uid, quantity);
    }

    async deleteProductInCart(cid, pid, uid) {
        // Valida los id de cart y product.
        validateIds(cid, pid);
        return await this.dao.deleteProductInCart(cid, pid, uid);
    }

    async updateCartProductArray(cid, products) {
        // Valida los id de cart y product.
        validateIds(cid);

        // TODO: Validar "products"
        return await this.dao.updateCartProductArray(cid, products); // products = [] => Limpia el carrito
    }

    async getTotalProducts(cid) {
        // Valida los id de cart y product.
        validateIds(cid);

        return await this.dao.getTotalProducts(cid);
    }

    async updateCartProductQuantity(cid, pid, quantity) {


        // Valida el id de cart y product
        validateIds(cid, pid);

        // Valida el resto de la Product Data
        if (!quantity) {
            throw CustomError.createError({
                name: 'InvalidProductData',
                cause: `Invalid Product data:
            - product.pid: sholud be a non-empty [ String ], recived ${pid} - type [ ${typeof pid} ]
            `,
                message: 'Error trying to add product in cart',
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        return await this.dao.updateCartProductQuantity(cid, pid, quantity);
    }

    async purchase(cid, purchaserEmail) {
        // Valida el id de cart
        validateIds(cid);
        if (!purchaserEmail || typeof purchaserEmail !== 'string') {
            throw CustomError.createError({
                name: 'InvalidPurchaseData',
                cause: `Invalid purchase data:
            - purchaserEmail: sholud be a non-empty [ String ], recived ${purchaserEmail} - type [ ${typeof purchaserEmail} ]
            `,
                message: 'Error trying purchase',
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        return await this.dao.purchase(cid, purchaserEmail);
    }

}
module.exports = { CartsRepository }
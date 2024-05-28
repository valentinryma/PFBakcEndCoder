class CartsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getAll() {
        return await this.dao.getAll();
    }

    async getById(id) {
        return await this.dao.getById(id);
    }

    async createOne() {
        return await this.dao.createOne();
    }

    async deleteById(id) {
        return await this.dao.deleteById(id);
    }

    async addProductInCart(cid, product) {
        if (!product || !product.pid) throw new Error('invalid parameters');
        product.quantity = product.quantity || 1;

        return await this.dao.addProductInCart(cid, product);
    }

    async deleteProductInCart(cid, pid) {
        return await this.dao.deleteProductInCart(cid, pid);
    }

    async updateCartProductArray(cid, products) {
        return await this.dao.updateCartProductArray(cid, products); // products = [] => Limpia el carrito
    }

    async getTotalProducts(cid) {
        if (cid === 'null') return 0;
        return await this.dao.getTotalProducts(cid);
    }

    async updateCartProductQuantity(cid, product) {
        if (!product || !product.pid || !product.quantity) throw new Error('invalid parameters');
        return await this.dao.updateCartProductQuantity(cid, product)
    }

    async purchase(cid, purchaserEmail) {
        return await this.dao.purchase(cid, purchaserEmail);
    }

}
module.exports = { CartsRepository }
class CartsService {
    constructor(storage) {
        this.storage = storage;
    }

    async getAll() {
        const carts = await this.storage.getAll();
        return carts
    }

    async getById(id) {
        return await this.storage.getById(id);
    }

    async createOne() {
        return await this.storage.createOne();
    }

    async deleteById(id) {
        return await this.storage.deleteById(id);
    }

    async addProductInCart(cid, product) {
        if (!product || !product.pid) throw new Error('invalid parameters');
        product.quantity = product.quantity || 1;

        return await this.storage.addProductInCart(cid, product);
    }

    async updateCartProductArray(cid, products) {
        return await this.storage.updateCartProductArray(cid, products); // products = [] => Limpia el carrito
    }

    async getTotalProducts(cid) {
        return await this.storage.getTotalProducts(cid);
    }

    async updateCartProductQuantity(cid, product) {
        if (!product || !product.pid || !product.quantity) throw new Error('invalid parameters');
        return await this.storage.updateCartProductQuantity(cid, product)
    }

}
module.exports = { CartsService }
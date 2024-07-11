class ProductDTO {
    constructor(product) {
        this.id = product._id;

        this.title = product.title;

        this.code = product.code;

        this.price = product.price;

        this.status = product.status;

        this.stock = product.stock;

        this.category = product.category;

        this.thumbnails = product.thumbnails;

        this.owner = product.owner;
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            code: this.code,
            price: this.price,
            status: this.status,
            stock: this.stock,
            category: this.category,
            thumbnails: this.thumbnails,
            owner: this.owner,
        }
    }
}
module.exports = ProductDTO;
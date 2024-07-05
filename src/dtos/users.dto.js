class ProductDTO {
    constructor(product) {
        this.id = product._id;

        this.code = product.code;

        this.price = product.price;

        this.status = product.status;

        this.stock = product.stock;

        this.category = product.category;

        this.thumbnails = product.thumbnails;

        this.owner = product.owner;
    }
}
module.exports = ProductDTO;
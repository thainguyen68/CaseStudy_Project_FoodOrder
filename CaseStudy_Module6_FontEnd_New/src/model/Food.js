export class Food {
    id
    name
    description
    quantity
    price
    image
    views
    statusProducts
    voucher
    shops
    categories

    constructor(id, name, description, quantity, price, image, views, statusProducts,voucher, shops, categories) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.price = price;
        this.image = image;
        this.views = views;
        this.statusProducts = statusProducts;
        this.voucher = voucher;
        this.shops = shops;
        this.categories = categories;
    }
}

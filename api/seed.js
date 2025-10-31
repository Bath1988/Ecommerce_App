// Sequelize seed script for initial categories and products
const db = require('./models');

async function seed() {
  await db.sequelize.sync({ force: false });

  // Seed categories
  const categories = await db.category.bulkCreate([
    { name: 'Electronics' },
    { name: 'Books' },
    { name: 'Clothing' },
    { name: 'Home & Kitchen' },
    { name: 'Toys' },
    { name: 'Sports' },
    { name: 'Beauty' },
  ], { ignoreDuplicates: true });

  // Seed products
  await db.product.bulkCreate([
    { name: 'Smartphone', price: 499.99, stock: 20, categoryId: categories[0].id },
    { name: 'Laptop', price: 899.99, stock: 10, categoryId: categories[0].id },
    { name: 'Bluetooth Headphones', price: 59.99, stock: 30, categoryId: categories[0].id },
    { name: 'Novel', price: 14.99, stock: 50, categoryId: categories[1].id },
    { name: 'Cookbook', price: 24.99, stock: 40, categoryId: categories[1].id },
    { name: 'T-Shirt', price: 9.99, stock: 100, categoryId: categories[2].id },
    { name: 'Jeans', price: 39.99, stock: 60, categoryId: categories[2].id },
    { name: 'Blender', price: 49.99, stock: 25, categoryId: categories[3].id },
    { name: 'Coffee Maker', price: 79.99, stock: 15, categoryId: categories[3].id },
    { name: 'Action Figure', price: 19.99, stock: 80, categoryId: categories[4].id },
    { name: 'Board Game', price: 29.99, stock: 35, categoryId: categories[4].id },
    { name: 'Football', price: 25.99, stock: 50, categoryId: categories[5].id },
    { name: 'Yoga Mat', price: 21.99, stock: 70, categoryId: categories[5].id },
    { name: 'Lipstick', price: 12.99, stock: 90, categoryId: categories[6].id },
    { name: 'Shampoo', price: 8.99, stock: 120, categoryId: categories[6].id },
  ], { ignoreDuplicates: true });

  // Fetch products for order/review seeding
  const products = await db.product.findAll();

  // Seed orders
  const orders = await db.order.bulkCreate([
    { customerName: 'Alice', productId: products[0].id, quantity: 2, total: products[0].price * 2 },
    { customerName: 'Bob', productId: products[1].id, quantity: 1, total: products[1].price * 1 },
    { customerName: 'Charlie', productId: products[2].id, quantity: 3, total: products[2].price * 3 },
  ], { ignoreDuplicates: true });

  // Seed reviews
  await db.review.bulkCreate([
    { orderId: orders[0].id, productId: products[0].id, itemName: products[0].name, reviewText: 'Great phone!', stars: 5 },
    { orderId: orders[1].id, productId: products[1].id, itemName: products[1].name, reviewText: 'Good laptop.', stars: 4 },
    { orderId: orders[2].id, productId: products[2].id, itemName: products[2].name, reviewText: 'Nice headphones.', stars: 5 },
  ], { ignoreDuplicates: true });

  console.log('Seed data inserted!');
  process.exit();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:postgres123@localhost:5432/fancy_store_db', {
  dialect: 'postgres',
  dialectOptions: process.env.NODE_ENV === 'production' ? {
    ssl: { require: true, rejectUnauthorized: false }
  } : {},
  logging: false,
});

// ========== MODELS ==========

const User = sequelize.define('User', {
  UserId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Name: { type: DataTypes.STRING, allowNull: false },
  Email: { type: DataTypes.STRING, allowNull: false, unique: true },
  Mobile: { type: DataTypes.STRING, allowNull: false, unique: true },
  PasswordHash: { type: DataTypes.STRING, allowNull: false },
  Role: { type: DataTypes.STRING, defaultValue: 'Customer' },
  IsBlocked: { type: DataTypes.BOOLEAN, defaultValue: false },
  CreatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'Users', timestamps: false });

const Category = sequelize.define('Category', {
  CategoryId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  CategoryName: { type: DataTypes.STRING, allowNull: false },
  ImageUrl: { type: DataTypes.STRING },
  IsActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  CreatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'Categories', timestamps: false });

const Product = sequelize.define('Product', {
  ProductId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  CategoryId: { type: DataTypes.INTEGER, allowNull: false },
  Name: { type: DataTypes.STRING, allowNull: false },
  Description: { type: DataTypes.TEXT },
  Price: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
  Discount: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  Stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  ImageUrl: { type: DataTypes.STRING },
  IsActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  IsTrending: { type: DataTypes.BOOLEAN, defaultValue: false },
  IsBestSeller: { type: DataTypes.BOOLEAN, defaultValue: false },
  IsNewArrival: { type: DataTypes.BOOLEAN, defaultValue: false },
  CreatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'Products', timestamps: false });

const Cart = sequelize.define('Cart', {
  CartId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  UserId: { type: DataTypes.INTEGER, allowNull: false },
  ProductId: { type: DataTypes.INTEGER, allowNull: false },
  Quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  SavedForLater: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'Carts', timestamps: false });

const Order = sequelize.define('Order', {
  OrderId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  UserId: { type: DataTypes.INTEGER, allowNull: false },
  AddressId: { type: DataTypes.INTEGER },
  TotalAmount: { type: DataTypes.DECIMAL(18, 2) },
  DiscountAmount: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0 },
  GstAmount: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0 },
  DeliveryCharge: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0 },
  GrandTotal: { type: DataTypes.DECIMAL(18, 2) },
  Status: { type: DataTypes.STRING, defaultValue: 'Pending' },
  PaymentMethod: { type: DataTypes.STRING },
  PaymentStatus: { type: DataTypes.STRING, defaultValue: 'Pending' },
  RazorpayOrderId: { type: DataTypes.STRING },
  CouponCode: { type: DataTypes.STRING },
  CreatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'Orders', timestamps: false });

const OrderItem = sequelize.define('OrderItem', {
  OrderItemId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  OrderId: { type: DataTypes.INTEGER, allowNull: false },
  ProductId: { type: DataTypes.INTEGER, allowNull: false },
  Quantity: { type: DataTypes.INTEGER, allowNull: false },
  Price: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
  Discount: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
}, { tableName: 'OrderItems', timestamps: false });

const Address = sequelize.define('Address', {
  AddressId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  UserId: { type: DataTypes.INTEGER, allowNull: false },
  AddressLine: { type: DataTypes.STRING },
  Landmark: { type: DataTypes.STRING },
  City: { type: DataTypes.STRING },
  State: { type: DataTypes.STRING },
  Pincode: { type: DataTypes.STRING },
  IsDefault: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'Addresses', timestamps: false });

const Coupon = sequelize.define('Coupon', {
  CouponId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Code: { type: DataTypes.STRING, unique: true },
  DiscountPercent: { type: DataTypes.DECIMAL(5, 2) },
  MinOrderAmount: { type: DataTypes.DECIMAL(18, 2) },
  MaxDiscount: { type: DataTypes.DECIMAL(18, 2) },
  UsageLimit: { type: DataTypes.INTEGER },
  UsageCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  IsActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  ValidUntil: { type: DataTypes.DATE },
  CreatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'Coupons', timestamps: false });

const Review = sequelize.define('Review', {
  ReviewId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ProductId: { type: DataTypes.INTEGER, allowNull: false },
  UserId: { type: DataTypes.INTEGER, allowNull: false },
  Rating: { type: DataTypes.INTEGER },
  Comment: { type: DataTypes.TEXT },
  IsApproved: { type: DataTypes.BOOLEAN, defaultValue: false },
  CreatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'Reviews', timestamps: false });

const PriceRange = sequelize.define('PriceRange', {
  Id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Label: { type: DataTypes.STRING, allowNull: false },
  MinPrice: { type: DataTypes.DECIMAL },
  MaxPrice: { type: DataTypes.DECIMAL },
  SortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'PriceRanges', timestamps: false });

const Wishlist = sequelize.define('Wishlist', {
  WishlistId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  UserId: { type: DataTypes.INTEGER, allowNull: false },
  ProductId: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'Wishlists', timestamps: false });

// ========== ASSOCIATIONS ==========
Product.belongsTo(Category, { foreignKey: 'CategoryId', as: 'Category' });
Category.hasMany(Product, { foreignKey: 'CategoryId', as: 'Products' });

Cart.belongsTo(Product, { foreignKey: 'ProductId', as: 'Product' });
Cart.belongsTo(User, { foreignKey: 'UserId', as: 'User' });

Order.belongsTo(User, { foreignKey: 'UserId', as: 'User' });
Order.belongsTo(Address, { foreignKey: 'AddressId', as: 'Address' });
Order.hasMany(OrderItem, { foreignKey: 'OrderId', as: 'OrderItems' });
User.hasMany(Order, { foreignKey: 'UserId', as: 'Orders' });

OrderItem.belongsTo(Product, { foreignKey: 'ProductId', as: 'Product' });
OrderItem.belongsTo(Order, { foreignKey: 'OrderId', as: 'Order' });

Review.belongsTo(Product, { foreignKey: 'ProductId', as: 'Product' });
Product.hasMany(Review, { foreignKey: 'ProductId', as: 'Reviews' });

Wishlist.belongsTo(Product, { foreignKey: 'ProductId', as: 'Product' });
Wishlist.belongsTo(User, { foreignKey: 'UserId', as: 'User' });

module.exports = { sequelize, User, Category, Product, Cart, Order, OrderItem, Address, Coupon, Review, PriceRange, Wishlist };

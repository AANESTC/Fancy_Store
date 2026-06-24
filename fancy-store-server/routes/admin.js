const express = require('express');
const router = express.Router();
const path = require('path');

const { Op, fn, col, literal, Sequelize } = require('sequelize');
const { User, Category, Product, Order, OrderItem, Coupon, PriceRange, Review, Cart } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate, requireAdmin);

// ==================== DASHBOARD ====================
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

    const allOrders = await Order.findAll({ where: { Status: { [Op.ne]: 'Cancelled' } } });
    const totalSales = allOrders.reduce((s, o) => s + parseFloat(o.GrandTotal), 0);
    const todayOrders = await Order.findAll({ where: { CreatedAt: { [Op.gte]: today, [Op.lt]: tomorrow } } });
    const todaySales = todayOrders.reduce((s, o) => s + parseFloat(o.GrandTotal), 0);

    const totalOrders = await Order.count();
    const todayOrderCount = todayOrders.length;
    const pendingOrders = await Order.count({ where: { Status: 'Pending' } });
    const totalCustomers = await User.count({ where: { Role: 'Customer' } });
    const totalProducts = await Product.count();
    const lowStockCount = await Product.count({ where: { Stock: { [Op.gt]: 0, [Op.lt]: 10 } } });

    const recentOrders = await Order.findAll({
      include: [{ model: User, as: 'User' }],
      order: [['CreatedAt', 'DESC']], limit: 10,
    });

    const sixMonthsAgo = new Date(); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const salesRaw = await Order.findAll({
      where: { CreatedAt: { [Op.gte]: sixMonthsAgo }, Status: { [Op.ne]: 'Cancelled' } },
      attributes: [
        [fn('date_trunc', 'month', col('CreatedAt')), 'month'],
        [fn('SUM', col('GrandTotal')), 'amount'],
        [fn('COUNT', col('OrderId')), 'orders'],
      ],
      group: [fn('date_trunc', 'month', col('CreatedAt'))],
      order: [[fn('date_trunc', 'month', col('CreatedAt')), 'ASC']],
      raw: true,
    });

    const topProductsRaw = await OrderItem.findAll({
      include: [{ model: Product, as: 'Product', attributes: ['Name', 'ImageUrl'] }],
      attributes: ['ProductId', [fn('SUM', col('Quantity')), 'totalSold'], [fn('SUM', literal('"OrderItem"."Price" * "OrderItem"."Quantity"')), 'revenue']],
      group: ['OrderItem.ProductId', 'Product.ProductId', 'Product.Name', 'Product.ImageUrl'],
      order: [[fn('SUM', col('Quantity')), 'DESC']],
      limit: 5,
    });

    return res.json({
      totalSales, todaySales, totalOrders, todayOrders: todayOrderCount,
      totalCustomers, totalProducts, lowStockProducts: lowStockCount, pendingOrders,
      recentOrders: recentOrders.map(o => ({
        orderId: o.OrderId, customerName: o.User?.Name,
        grandTotal: parseFloat(o.GrandTotal), status: o.Status, createdAt: o.CreatedAt,
      })),
      salesChart: salesRaw.map(r => ({
        label: new Date(r.month).toISOString().slice(0, 7),
        amount: parseFloat(r.amount), orders: parseInt(r.orders),
      })),
      topProducts: topProductsRaw.map(t => ({
        productId: t.ProductId, name: t.Product?.Name, imageUrl: t.Product?.ImageUrl,
        totalSold: parseInt(t.dataValues.totalSold), revenue: parseFloat(t.dataValues.revenue),
      })),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== PRODUCTS ====================
router.get('/products', async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search, categoryId, status } = req.query;
    const where = {};
    if (search) where[Op.or] = [{ Name: { [Op.iLike]: `%${search}%` } }, { Description: { [Op.iLike]: `%${search}%` } }];
    if (categoryId) where.CategoryId = parseInt(categoryId);
    if (status === 'active') where.IsActive = true;
    else if (status === 'inactive') where.IsActive = false;

    const totalCount = await Product.count({ where });
    const products = await Product.findAll({
      where, include: [{ model: Category, as: 'Category' }],
      order: [['CreatedAt', 'DESC']],
      offset: (parseInt(page) - 1) * parseInt(pageSize), limit: parseInt(pageSize),
    });

    return res.json({
      products: products.map(p => ({
        productId: p.ProductId, categoryId: p.CategoryId, categoryName: p.Category?.CategoryName,
        name: p.Name, description: p.Description, price: parseFloat(p.Price),
        discount: parseFloat(p.Discount),
        discountedPrice: parseFloat((parseFloat(p.Price) - parseFloat(p.Price) * parseFloat(p.Discount) / 100).toFixed(2)),
        stock: p.Stock, imageUrl: p.ImageUrl, isActive: p.IsActive,
        isTrending: p.IsTrending, isBestSeller: p.IsBestSeller, isNewArrival: p.IsNewArrival,
        createdAt: p.CreatedAt,
      })),
      totalCount, page: parseInt(page), pageSize: parseInt(pageSize),
      totalPages: Math.ceil(totalCount / parseInt(pageSize)),
    });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const p = await Product.findOne({ where: { ProductId: req.params.id }, include: [{ model: Category, as: 'Category' }] });
    if (!p) return res.status(404).json({ message: 'Not found' });
    return res.json({
      productId: p.ProductId, categoryId: p.CategoryId, categoryName: p.Category?.CategoryName,
      name: p.Name, description: p.Description, price: parseFloat(p.Price),
      discount: parseFloat(p.Discount),
      discountedPrice: parseFloat((parseFloat(p.Price) - parseFloat(p.Price) * parseFloat(p.Discount) / 100).toFixed(2)),
      stock: p.Stock, imageUrl: p.ImageUrl, isActive: p.IsActive,
      isTrending: p.IsTrending, isBestSeller: p.IsBestSeller, isNewArrival: p.IsNewArrival, createdAt: p.CreatedAt,
    });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/products', async (req, res) => {
  try {
    const { Name, CategoryId, Description, Price, Discount, Stock, ImageUrl, IsActive, IsTrending, IsBestSeller, IsNewArrival } = req.body;
    const product = await Product.create({ Name, CategoryId, Description, Price, Discount, Stock, ImageUrl, IsActive, IsTrending, IsBestSeller, IsNewArrival, CreatedAt: new Date() });
    return res.json({ message: 'Product created', productId: product.ProductId });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    const { Name, CategoryId, Description, Price, Discount, Stock, ImageUrl, IsActive, IsTrending, IsBestSeller, IsNewArrival } = req.body;
    await product.update({ Name, CategoryId, Description, Price, Discount, Stock, ImageUrl, IsActive, IsTrending, IsBestSeller, IsNewArrival });
    return res.json({ message: 'Product updated' });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    await product.destroy();
    return res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/products/:id/toggle-status', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    product.IsActive = !product.IsActive;
    await product.save();
    return res.json({ message: 'Status updated', isActive: product.IsActive });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/remove-duplicates', async (req, res) => {
  try {
    const allProducts = await Product.findAll({ order: [['ProductId', 'DESC']] });
    const seen = new Set(); const toDelete = [];
    for (const p of allProducts) {
      if (seen.has(p.Name)) toDelete.push(p.ProductId);
      else seen.add(p.Name);
    }
    await Product.destroy({ where: { ProductId: toDelete } });
    return res.json({ message: `Removed ${toDelete.length} duplicate products` });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== CATEGORIES ====================
router.get('/categories', async (req, res) => {
  try {
    const cats = await Category.findAll({ include: [{ model: Product, as: 'Products', required: false }] });
    return res.json(cats.map(c => ({
      categoryId: c.CategoryId, categoryName: c.CategoryName,
      imageUrl: c.ImageUrl, isActive: c.IsActive,
      productCount: (c.Products || []).length,
    })));
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const { CategoryName, ImageUrl } = req.body;
    const cat = await Category.create({ CategoryName, ImageUrl, IsActive: true });
    return res.json({ message: 'Category created', categoryId: cat.CategoryId });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Not found' });
    await cat.update({ CategoryName: req.body.CategoryName, ImageUrl: req.body.ImageUrl, IsActive: req.body.IsActive });
    return res.json({ message: 'Category updated' });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    const hasProducts = await Product.count({ where: { CategoryId: req.params.id } });
    if (hasProducts) return res.status(400).json({ message: 'Cannot delete category with existing products' });
    const cat = await Category.findByPk(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Not found' });
    await cat.destroy();
    return res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== ORDERS ====================
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, pageSize = 10, status, search } = req.query;
    const where = {};
    if (status) where.Status = status;

    const orders = await Order.findAll({
      include: [{ model: User, as: 'User' }, { model: OrderItem, as: 'OrderItems' }],
      order: [['CreatedAt', 'DESC']],
    });

    let filtered = orders;
    if (search) filtered = filtered.filter(o => o.User?.Name?.toLowerCase().includes(search.toLowerCase()) || o.OrderId.toString() === search);

    const totalCount = filtered.length;
    const paginated = filtered.slice((parseInt(page) - 1) * parseInt(pageSize), parseInt(page) * parseInt(pageSize));
    return res.json({
      orders: paginated.map(o => ({
        orderId: o.OrderId, customerName: o.User?.Name, customerEmail: o.User?.Email,
        customerMobile: o.User?.Mobile, totalAmount: parseFloat(o.TotalAmount),
        discountAmount: parseFloat(o.DiscountAmount), grandTotal: parseFloat(o.GrandTotal),
        status: o.Status, paymentMethod: o.PaymentMethod, paymentStatus: o.PaymentStatus,
        createdAt: o.CreatedAt, itemCount: (o.OrderItems || []).length,
      })),
      totalCount, page: parseInt(page), pageSize: parseInt(pageSize),
      totalPages: Math.ceil(totalCount / parseInt(pageSize)),
    });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { OrderId: req.params.id },
      include: [
        { model: User, as: 'User' },
        { model: OrderItem, as: 'OrderItems', include: [{ model: Product, as: 'Product' }] },
      ],
    });
    if (!order) return res.status(404).json({ message: 'Not found' });
    return res.json({
      orderId: order.OrderId,
      customer: { name: order.User?.Name, email: order.User?.Email, mobile: order.User?.Mobile },
      totalAmount: parseFloat(order.TotalAmount), discountAmount: parseFloat(order.DiscountAmount),
      gstAmount: parseFloat(order.GstAmount || 0), deliveryCharge: parseFloat(order.DeliveryCharge),
      grandTotal: parseFloat(order.GrandTotal), status: order.Status,
      paymentMethod: order.PaymentMethod, paymentStatus: order.PaymentStatus,
      couponCode: order.CouponCode, createdAt: order.CreatedAt,
      items: (order.OrderItems || []).map(i => ({
        productId: i.ProductId, productName: i.Product?.Name, imageUrl: i.Product?.ImageUrl,
        quantity: i.Quantity, price: parseFloat(i.Price), discount: parseFloat(i.Discount),
        subtotal: parseFloat((parseFloat(i.Price) * i.Quantity).toFixed(2)),
      })),
    });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Not found' });
    const validTransitions = {
      Pending: ['Confirmed', 'Cancelled'],
      Confirmed: ['Packed', 'Cancelled'],
      Packed: ['Shipped'],
      Shipped: ['Delivered'],
      Delivered: ['Refunded'],
    };
    const allowed = validTransitions[order.Status] || [];
    if (!allowed.includes(req.body.Status)) {
      return res.status(400).json({ message: `Cannot transition from ${order.Status} to ${req.body.Status}` });
    }
    order.Status = req.body.Status;
    await order.save();
    return res.json({ message: 'Order status updated' });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== CUSTOMERS ====================
router.get('/customers', async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search, isBlocked } = req.query;
    const where = { Role: 'Customer' };
    if (search) where[Op.or] = [{ Name: { [Op.iLike]: `%${search}%` } }, { Email: { [Op.iLike]: `%${search}%` } }, { Mobile: { [Op.iLike]: `%${search}%` } }];
    if (isBlocked !== undefined) where.IsBlocked = isBlocked === 'true';

    const totalCount = await User.count({ where });
    const customers = await User.findAll({
      where, include: [{ model: Order, as: 'Orders', required: false }],
      order: [['CreatedAt', 'DESC']],
      offset: (parseInt(page) - 1) * parseInt(pageSize), limit: parseInt(pageSize),
    });

    return res.json({
      customers: customers.map(u => ({
        userId: u.UserId, name: u.Name, email: u.Email, mobile: u.Mobile,
        role: u.Role, isBlocked: u.IsBlocked, createdAt: u.CreatedAt,
        orderCount: (u.Orders || []).length,
      })),
      totalCount, page: parseInt(page), pageSize: parseInt(pageSize),
      totalPages: Math.ceil(totalCount / parseInt(pageSize)),
    });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/customers/:id', async (req, res) => {
  try {
    const user = await User.findOne({
      where: { UserId: req.params.id, Role: 'Customer' },
      include: [{ model: Order, as: 'Orders', include: [{ model: OrderItem, as: 'OrderItems' }] }],
    });
    if (!user) return res.status(404).json({ message: 'Not found' });
    return res.json({
      userId: user.UserId, name: user.Name, email: user.Email,
      mobile: user.Mobile, isBlocked: user.IsBlocked, createdAt: user.CreatedAt,
      orders: (user.Orders || []).sort((a, b) => b.CreatedAt - a.CreatedAt).map(o => ({
        orderId: o.OrderId, grandTotal: parseFloat(o.GrandTotal),
        status: o.Status, createdAt: o.CreatedAt, itemCount: (o.OrderItems || []).length,
      })),
    });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/customers/:id/toggle-block', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user || user.Role === 'Admin') return res.status(404).json({ message: 'Not found' });
    user.IsBlocked = !user.IsBlocked;
    await user.save();
    return res.json({ message: user.IsBlocked ? 'Customer blocked' : 'Customer unblocked', isBlocked: user.IsBlocked });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== COUPONS ====================
router.get('/coupons', async (req, res) => {
  try {
    return res.json(await Coupon.findAll({ order: [['CouponId', 'DESC']] }));
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/coupons', async (req, res) => {
  try {
    const { Code, DiscountPercent, MinOrderAmount, MaxDiscount, UsageLimit, ValidUntil } = req.body;
    const exists = await Coupon.findOne({ where: { Code: Code.toUpperCase() } });
    if (exists) return res.status(400).json({ message: 'Coupon code already exists' });
    const coupon = await Coupon.create({ Code: Code.toUpperCase(), DiscountPercent, MinOrderAmount, MaxDiscount, UsageLimit, ValidUntil, IsActive: true });
    return res.json({ message: 'Coupon created', couponId: coupon.CouponId });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/coupons/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Not found' });
    const { Code, DiscountPercent, MinOrderAmount, MaxDiscount, UsageLimit, ValidUntil } = req.body;
    await coupon.update({ Code: Code.toUpperCase(), DiscountPercent, MinOrderAmount, MaxDiscount, UsageLimit, ValidUntil });
    return res.json({ message: 'Coupon updated' });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/coupons/:id/toggle', async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Not found' });
    coupon.IsActive = !coupon.IsActive;
    await coupon.save();
    return res.json({ message: 'Coupon status updated', isActive: coupon.IsActive });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/coupons/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Not found' });
    await coupon.destroy();
    return res.json({ message: 'Coupon deleted' });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== INVENTORY ====================
router.get('/inventory', async (req, res) => {
  try {
    const { filter } = req.query;
    const where = {};
    if (filter === 'low') where.Stock = { [Op.gt]: 0, [Op.lt]: 10 };
    else if (filter === 'out') where.Stock = 0;

    const items = await Product.findAll({ where, include: [{ model: Category, as: 'Category' }], order: [['Stock', 'ASC']] });
    return res.json(items.map(p => ({
      productId: p.ProductId, productName: p.Name, categoryName: p.Category?.CategoryName,
      stock: p.Stock, price: parseFloat(p.Price),
      stockStatus: p.Stock === 0 ? 'OutOfStock' : p.Stock < 10 ? 'LowStock' : 'InStock',
    })));
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/inventory/:id/stock', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    product.Stock = req.body.Stock;
    await product.save();
    return res.json({ message: 'Stock updated', stock: product.Stock });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

// ==================== IMAGE UPLOAD (Cloudinary) ====================
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage — we stream directly to Cloudinary, never touch disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.includes(ext) ? cb(null, true) : cb(new Error('Invalid file type'));
  },
});

router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file provided' });

  try {
    // Upload buffer directly to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'fancy-store/products', resource_type: 'image' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    return res.json({ url: result.secure_url, message: 'Image uploaded successfully' });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return res.status(500).json({ message: 'Image upload failed' });
  }
});

// ==================== PRICE RANGES ====================
router.get('/priceranges', async (req, res) => {
  try {
    const ranges = await PriceRange.findAll({ order: [['SortOrder', 'ASC']] });
    return res.json(ranges.map(r => ({ id: r.Id, label: r.Label, minPrice: r.MinPrice !== null ? parseFloat(r.MinPrice) : null, maxPrice: r.MaxPrice !== null ? parseFloat(r.MaxPrice) : null, sortOrder: r.SortOrder })));
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/priceranges', async (req, res) => {
  try {
    const { Label, MinPrice, MaxPrice, SortOrder } = req.body;
    const pr = await PriceRange.create({ Label, MinPrice, MaxPrice, SortOrder });
    return res.json({ id: pr.Id, label: pr.Label, minPrice: pr.MinPrice, maxPrice: pr.MaxPrice, sortOrder: pr.SortOrder });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/priceranges/:id', async (req, res) => {
  try {
    const pr = await PriceRange.findByPk(req.params.id);
    if (!pr) return res.status(404).json({ message: 'Not found' });
    await pr.update({ Label: req.body.Label, MinPrice: req.body.MinPrice, MaxPrice: req.body.MaxPrice, SortOrder: req.body.SortOrder });
    return res.json({ id: pr.Id, label: pr.Label, minPrice: pr.MinPrice, maxPrice: pr.MaxPrice, sortOrder: pr.SortOrder });
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/priceranges/:id', async (req, res) => {
  try {
    const pr = await PriceRange.findByPk(req.params.id);
    if (!pr) return res.status(404).json({ message: 'Not found' });
    await pr.destroy();
    return res.status(204).send();
  } catch (err) {
    console.error(err); return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

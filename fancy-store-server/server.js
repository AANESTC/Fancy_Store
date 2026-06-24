require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

const { sequelize, User, Category, Coupon, Product, PriceRange } = require('./models');

const app = express();
const PORT = process.env.PORT || 5126;

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.FRONTEND_URL || '',
  ].filter(Boolean),
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Normalize request body: convert camelCase keys (from React frontend) to PascalCase (for DB models)
// e.g. { name, categoryId, isActive } → { Name, CategoryId, IsActive }
const toPascalCase = (key) => key.charAt(0).toUpperCase() + key.slice(1);
const normalizeBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    const normalized = {};
    for (const [key, value] of Object.entries(req.body)) {
      normalized[toPascalCase(key)] = value;
    }
    req.body = normalized;
  }
  next();
};
app.use(normalizeBody);

// Serve uploaded product images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==================== API ROUTES ====================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// ==================== SERVE REACT FRONTEND (production) ====================
if (process.env.NODE_ENV === 'production') {
  const frontendBuild = path.join(__dirname, '..', 'fancy-store-client', 'dist');
  app.use(express.static(frontendBuild));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuild, 'index.html'));
  });
}

// ==================== DATABASE SYNC & SEED ====================
const seedDatabase = async () => {
  // Seed Admin if missing
  const adminExists = await User.findOne({ where: { Role: 'Admin' } });
  if (!adminExists) {
    const hash = await bcrypt.hash('queenakka@123', 11);
    await User.create({
      Name: 'Fancy Store Admin',
      Email: 'admin@gmail.com',
      Mobile: '9999999999',
      PasswordHash: hash,
      Role: 'Admin',
      IsBlocked: false,
      CreatedAt: new Date('2024-01-01'),
    });
    console.log('✅ Admin user seeded');
  }

  // Seed Categories if missing
  const catCount = await Category.count();
  if (catCount === 0) {
    await Category.bulkCreate([
      { CategoryId: 1, CategoryName: 'Bangles', ImageUrl: '/images/categories/bangles.jpg', IsActive: true },
      { CategoryId: 2, CategoryName: 'Dollar Chains', ImageUrl: '/images/categories/dollar-chains.jpg', IsActive: true },
      { CategoryId: 3, CategoryName: 'Invisible Chains', ImageUrl: '/images/categories/invisible-chains.jpg', IsActive: true },
      { CategoryId: 4, CategoryName: 'Hair Clips', ImageUrl: '/images/categories/earrings.jpg', IsActive: true },
      { CategoryId: 5, CategoryName: 'Hair Accessories', ImageUrl: '/images/categories/hair-accessories.jpg', IsActive: true },
      { CategoryId: 6, CategoryName: 'Fancy Items', ImageUrl: '/images/categories/fancy-items.jpg', IsActive: true },
      { CategoryId: 7, CategoryName: 'Gift Items', ImageUrl: '/images/categories/gift-items.jpg', IsActive: true },
    ]);
    console.log('✅ Categories seeded');
  }

  // Seed Coupons if missing
  const couponCount = await Coupon.count();
  if (couponCount === 0) {
    await Coupon.bulkCreate([
      { Code: 'WELCOME10', DiscountPercent: 10, MinOrderAmount: 200, MaxDiscount: 100, UsageLimit: 1000, IsActive: true, ValidUntil: new Date('2027-12-31') },
      { Code: 'FANCY20', DiscountPercent: 20, MinOrderAmount: 500, MaxDiscount: 200, UsageLimit: 500, IsActive: true, ValidUntil: new Date('2027-12-31') },
    ]);
    console.log('✅ Coupons seeded');
  }

  // Seed PriceRanges if missing
  const priceRangeCount = await PriceRange.count();
  if (priceRangeCount === 0) {
    await PriceRange.bulkCreate([
      { Label: 'Under ₹500', MinPrice: 0, MaxPrice: 499, SortOrder: 1 },
      { Label: '₹500 - ₹1000', MinPrice: 500, MaxPrice: 1000, SortOrder: 2 },
      { Label: '₹1000 - ₹2000', MinPrice: 1000, MaxPrice: 2000, SortOrder: 3 },
      { Label: 'Over ₹2000', MinPrice: 2001, MaxPrice: null, SortOrder: 4 },
    ]);
    console.log('✅ Price ranges seeded');
  }

  // Seed Products if missing
  const productCount = await Product.count();
  if (productCount === 0) {
    await Product.bulkCreate([
      { Name: 'Elegant Bridal Bangles Set', Description: 'Premium gold-plated bangles with intricate craftsmanship.', Price: 1299, Discount: 10, CategoryId: 1, Stock: 50, ImageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop', IsActive: true },
      { Name: 'Premium Invisible Chain', Description: 'Minimalist and modern invisible chain for daily wear.', Price: 499, Discount: 20, CategoryId: 3, Stock: 100, ImageUrl: 'https://images.unsplash.com/photo-1599643478514-4a888f6188dc?w=800&auto=format&fit=crop', IsActive: true },
      { Name: 'Korean Drop Earrings', Description: 'Trending Korean style elegant drop earrings.', Price: 299, Discount: 0, CategoryId: 4, Stock: 200, ImageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop', IsActive: true },
      { Name: 'Gold Plated Dollar Chain', Description: 'Thick, luxurious dollar chain design.', Price: 899, Discount: 15, CategoryId: 2, Stock: 30, ImageUrl: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&auto=format&fit=crop', IsActive: true },
      { Name: 'Ruby Studded Bangles', Description: 'Traditional bangles embedded with premium artificial rubies.', Price: 1599, Discount: 5, CategoryId: 1, Stock: 20, ImageUrl: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=800&auto=format&fit=crop', IsActive: true },
      { Name: 'Diamond Accent Hoops', Description: 'Stunning hoop earrings with delicate diamond accents.', Price: 599, Discount: 10, CategoryId: 4, Stock: 80, ImageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop', IsActive: true },
      { Name: 'Classic Pearl Necklace', Description: 'Timeless pearl necklace perfect for evening wear.', Price: 1899, Discount: 25, CategoryId: 2, Stock: 15, ImageUrl: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop', IsActive: true },
      { Name: 'Crystal Hair Pin Set', Description: 'Sparkling crystal hair accessories for bridal and party wear.', Price: 349, Discount: 0, CategoryId: 5, Stock: 150, ImageUrl: 'https://images.unsplash.com/photo-1569397288884-4d43e667d264?w=800&auto=format&fit=crop', IsActive: true },
      { Name: 'Rose Gold Cuff Bangle', Description: 'Modern rose gold cuff with a sleek, minimalist aesthetic.', Price: 899, Discount: 20, CategoryId: 1, Stock: 45, ImageUrl: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop', IsActive: true },
      { Name: 'Sapphire Tear Drop Earrings', Description: 'Elegant teardrop earrings featuring deep blue sapphire replicas.', Price: 649, Discount: 15, CategoryId: 4, Stock: 60, ImageUrl: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&auto=format&fit=crop', IsActive: true },
      { Name: 'Layered Gold Chain', Description: 'Fashion-forward multi-layered gold chain.', Price: 1199, Discount: 30, CategoryId: 2, Stock: 25, ImageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop', IsActive: true },
      { Name: 'Premium Velvet Jewelry Box', Description: 'Perfect gift item for storing precious jewelry securely.', Price: 1299, Discount: 0, CategoryId: 7, Stock: 40, ImageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop', IsActive: true },
    ]);
    console.log('✅ Products seeded');
  }
};

// ==================== START SERVER ====================
const start = async () => {
  try {
    // sync creates tables that don't exist without dropping existing ones
    await sequelize.sync({ alter: false });
    
    // Automatically migrate old "Earrings" category to "Hair Clips" on remote DBs
    await Category.update({ CategoryName: 'Hair Clips' }, { where: { CategoryName: 'Earrings' } });
    
    console.log('✅ Database connected and synced');

    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Fancy Store API running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

start();

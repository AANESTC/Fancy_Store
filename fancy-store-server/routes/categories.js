const express = require('express');
const router = express.Router();
const { Category, Product, PriceRange } = require('../models');

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { IsActive: true },
      include: [{ model: Product, as: 'Products', where: { IsActive: true }, required: false }],
    });
    return res.json(categories.map(c => ({
      categoryId: c.CategoryId,
      categoryName: c.CategoryName,
      imageUrl: c.ImageUrl,
      isActive: c.IsActive,
      productCount: (c.Products || []).length,
    })));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/categories/priceranges
router.get('/priceranges', async (req, res) => {
  try {
    const ranges = await PriceRange.findAll({ order: [['SortOrder', 'ASC']] });
    return res.json(ranges.map(r => ({
      id: r.Id, label: r.Label,
      minPrice: r.MinPrice !== null ? parseFloat(r.MinPrice) : null,
      maxPrice: r.MaxPrice !== null ? parseFloat(r.MaxPrice) : null,
      sortOrder: r.SortOrder,
    })));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { Op, fn, col, literal } = require('sequelize');
const { Product, Category, Review } = require('../models');

const toProductDto = (p) => {
  const price = parseFloat(p.Price);
  const discount = parseFloat(p.Discount);
  const discountedPrice = price - (price * discount / 100);
  const approvedReviews = (p.Reviews || []).filter(r => r.IsApproved);
  const avgRating = approvedReviews.length > 0
    ? approvedReviews.reduce((sum, r) => sum + r.Rating, 0) / approvedReviews.length
    : 0;

  return {
    productId: p.ProductId, categoryId: p.CategoryId,
    categoryName: p.Category ? p.Category.CategoryName : '',
    name: p.Name, description: p.Description,
    price, discount, discountedPrice: parseFloat(discountedPrice.toFixed(2)),
    stock: p.Stock, imageUrl: p.ImageUrl,
    isActive: p.IsActive, isTrending: p.IsTrending,
    isBestSeller: p.IsBestSeller, isNewArrival: p.IsNewArrival,
    averageRating: parseFloat(avgRating.toFixed(2)),
    reviewCount: approvedReviews.length,
  };
};

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { categoryId, category, minPrice, maxPrice, searchKeyword, page = 1, pageSize = 12 } = req.query;
    const where = { IsActive: true };
    const categoryWhere = {};

    if (categoryId) where.CategoryId = parseInt(categoryId);
    if (category && category.toLowerCase() !== 'all') {
      const formatted = category.replace(/-/g, ' ');
      categoryWhere.CategoryName = { [Op.iLike]: `%${formatted}%` };
    }
    if (searchKeyword) {
      where[Op.or] = [
        { Name: { [Op.iLike]: `%${searchKeyword}%` } },
        { Description: { [Op.iLike]: `%${searchKeyword}%` } },
      ];
    }

    const allProducts = await Product.findAll({
      where,
      include: [
        { model: Category, as: 'Category', where: Object.keys(categoryWhere).length ? categoryWhere : undefined },
        { model: Review, as: 'Reviews', required: false },
      ],
    });

    // Apply price filtering in JS (after discounted price calculation)
    let filtered = allProducts;
    if (minPrice) filtered = filtered.filter(p => {
      const dp = parseFloat(p.Price) - (parseFloat(p.Price) * parseFloat(p.Discount) / 100);
      return dp >= parseFloat(minPrice);
    });
    if (maxPrice) filtered = filtered.filter(p => {
      const dp = parseFloat(p.Price) - (parseFloat(p.Price) * parseFloat(p.Discount) / 100);
      return dp <= parseFloat(maxPrice);
    });

    const totalCount = filtered.length;
    const pageNum = parseInt(page);
    const pageSizeNum = parseInt(pageSize);
    const paginated = filtered.slice((pageNum - 1) * pageSizeNum, pageNum * pageSizeNum);

    return res.json({
      products: paginated.map(toProductDto),
      totalCount, page: pageNum, pageSize: pageSizeNum,
      totalPages: Math.ceil(totalCount / pageSizeNum),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findOne({
      where: { ProductId: req.params.id, IsActive: true },
      include: [
        { model: Category, as: 'Category' },
        { model: Review, as: 'Reviews', required: false },
      ],
    });
    if (!p) return res.status(404).json({ message: 'Not found' });
    return res.json(toProductDto(p));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

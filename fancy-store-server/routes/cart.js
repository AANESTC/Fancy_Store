const express = require('express');
const router = express.Router();
const { Cart, Product, Order, Address } = require('../models');
const { authenticate, getUserId } = require('../middleware/auth');

router.use(authenticate);

// GET /api/cart
router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    const cartItems = await Cart.findAll({
      where: { UserId: userId, SavedForLater: false },
      include: [{ model: Product, as: 'Product' }],
    });

    const items = cartItems.map(c => {
      const price = parseFloat(c.Product.Price);
      const discount = parseFloat(c.Product.Discount);
      const discountedPrice = price - (price * discount / 100);
      return {
        cartId: c.CartId, productId: c.ProductId,
        productName: c.Product.Name, imageUrl: c.Product.ImageUrl,
        price, discount, discountedPrice: parseFloat(discountedPrice.toFixed(2)),
        quantity: c.Quantity, maxStock: c.Product.Stock,
        subtotal: parseFloat((discountedPrice * c.Quantity).toFixed(2)),
      };
    });

    const productTotal = items.reduce((s, i) => s + i.subtotal, 0);
    const deliveryCharge = productTotal > 500 ? 0 : 50;
    return res.json({
      items, productTotal: parseFloat(productTotal.toFixed(2)),
      deliveryCharge, grandTotal: parseFloat((productTotal + deliveryCharge).toFixed(2)),
      itemCount: items.reduce((s, i) => s + i.quantity, 0),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/cart
router.post('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { ProductId, Quantity } = req.body;

    const product = await Product.findByPk(ProductId);
    if (!product || !product.IsActive) return res.status(404).json({ message: 'Product not available' });
    if (product.Stock < Quantity) return res.status(400).json({ message: 'Insufficient stock' });

    const existing = await Cart.findOne({ where: { UserId: userId, ProductId } });
    if (existing) {
      if (existing.Quantity + Quantity > product.Stock) return res.status(400).json({ message: 'Insufficient stock' });
      existing.Quantity += Quantity;
      await existing.save();
    } else {
      await Cart.create({ UserId: userId, ProductId, Quantity });
    }

    return res.json({ message: 'Added to cart' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/cart/:id
router.put('/:id', async (req, res) => {
  try {
    const userId = getUserId(req);
    const cartItem = await Cart.findOne({
      where: { CartId: req.params.id, UserId: userId },
      include: [{ model: Product, as: 'Product' }],
    });
    if (!cartItem) return res.status(404).json({ message: 'Not found' });
    if (cartItem.Product.Stock < req.body.Quantity) return res.status(400).json({ message: 'Insufficient stock' });

    cartItem.Quantity = req.body.Quantity;
    await cartItem.save();
    return res.json({ message: 'Updated' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/cart/:id
router.delete('/:id', async (req, res) => {
  try {
    const userId = getUserId(req);
    const cartItem = await Cart.findOne({ where: { CartId: req.params.id, UserId: userId } });
    if (!cartItem) return res.status(404).json({ message: 'Not found' });
    await cartItem.destroy();
    return res.json({ message: 'Removed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

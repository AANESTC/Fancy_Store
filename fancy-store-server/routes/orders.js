const express = require('express');
const router = express.Router();
const { Order, OrderItem, Cart, Product, Address, User } = require('../models');
const { authenticate, getUserId } = require('../middleware/auth');

router.use(authenticate);

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { AddressId, PaymentMethod, RazorpayOrderId, CouponCode } = req.body;

    const cartItems = await Cart.findAll({
      where: { UserId: userId, SavedForLater: false },
      include: [{ model: Product, as: 'Product' }],
    });
    if (!cartItems.length) return res.status(400).json({ message: 'Cart is empty' });

    const address = await Address.findOne({ where: { AddressId, UserId: userId } });
    if (!address) return res.status(400).json({ message: 'Invalid address' });

    const productTotal = cartItems.reduce((s, c) => {
      const price = parseFloat(c.Product.Price);
      const discount = parseFloat(c.Product.Discount);
      const dp = price - (price * discount / 100);
      return s + dp * c.Quantity;
    }, 0);
    const discountAmount = 0;
    const deliveryCharge = productTotal > 500 ? 0 : 50;
    const grandTotal = productTotal - discountAmount + deliveryCharge;

    const order = await Order.create({
      UserId: userId, AddressId,
      TotalAmount: productTotal.toFixed(2),
      DiscountAmount: discountAmount,
      DeliveryCharge: deliveryCharge,
      GrandTotal: grandTotal.toFixed(2),
      PaymentMethod,
      PaymentStatus: PaymentMethod === 'COD' ? 'Pending' : 'Paid',
      RazorpayOrderId, CouponCode,
    });

    for (const item of cartItems) {
      await OrderItem.create({
        OrderId: order.OrderId, ProductId: item.ProductId,
        Quantity: item.Quantity, Price: item.Product.Price,
        Discount: item.Product.Discount,
      });
      item.Product.Stock -= item.Quantity;
      await item.Product.save();
    }

    await Cart.destroy({ where: { UserId: userId, SavedForLater: false } });
    return res.json({ orderId: order.OrderId, message: 'Order placed successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    const orders = await Order.findAll({
      where: { UserId: userId },
      include: [
        { model: Address, as: 'Address' },
        { model: OrderItem, as: 'OrderItems', include: [{ model: Product, as: 'Product' }] },
      ],
      order: [['CreatedAt', 'DESC']],
    });

    return res.json(orders.map(o => ({
      orderId: o.OrderId,
      totalAmount: parseFloat(o.TotalAmount),
      grandTotal: parseFloat(o.GrandTotal),
      status: o.Status,
      paymentMethod: o.PaymentMethod,
      paymentStatus: o.PaymentStatus,
      createdAt: o.CreatedAt,
      items: (o.OrderItems || []).map(i => {
        const price = parseFloat(i.Price);
        const discount = parseFloat(i.Discount);
        return {
          productId: i.ProductId,
          productName: i.Product?.Name,
          imageUrl: i.Product?.ImageUrl,
          quantity: i.Quantity, price, discount,
          subtotal: parseFloat(((price - (price * discount / 100)) * i.Quantity).toFixed(2)),
        };
      }),
    })));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

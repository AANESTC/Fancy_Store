using System.Security.Claims;
using FancyStore.API.Data;
using FancyStore.API.DTOs;
using FancyStore.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FancyStore.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
    {
        var userId = GetUserId();
        
        var cartItems = await _context.Carts
            .Include(c => c.Product)
            .Where(c => c.UserId == userId && !c.SavedForLater)
            .ToListAsync();

        if (!cartItems.Any()) return BadRequest("Cart is empty");

        var address = await _context.Addresses.FirstOrDefaultAsync(a => a.AddressId == dto.AddressId && a.UserId == userId);
        if (address == null) return BadRequest("Invalid address");

        // Calculate totals
        decimal productTotal = cartItems.Sum(c => c.Product!.DiscountedPrice * c.Quantity);
        decimal discountAmount = 0; // Handle coupon logic here
        decimal deliveryCharge = productTotal > 500 ? 0 : 50;
        decimal grandTotal = productTotal - discountAmount + deliveryCharge;

        var order = new Order
        {
            UserId = userId,
            AddressId = dto.AddressId,
            TotalAmount = productTotal,
            DiscountAmount = discountAmount,
            DeliveryCharge = deliveryCharge,
            GrandTotal = grandTotal,
            PaymentMethod = dto.PaymentMethod,
            PaymentStatus = dto.PaymentMethod == "COD" ? "Pending" : "Paid",
            RazorpayOrderId = dto.RazorpayOrderId,
            CouponCode = dto.CouponCode
        };

        foreach (var item in cartItems)
        {
            order.OrderItems.Add(new OrderItem
            {
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                Price = item.Product!.Price,
                Discount = item.Product.Discount
            });
            
            // Reduce stock
            item.Product.Stock -= item.Quantity;
        }

        _context.Orders.Add(order);
        _context.Carts.RemoveRange(cartItems); // Clear cart
        await _context.SaveChangesAsync();

        return Ok(new { orderId = order.OrderId, message = "Order placed successfully" });
    }

    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var userId = GetUserId();
        var orders = await _context.Orders
            .Include(o => o.OrderItems).ThenInclude(i => i.Product)
            .Include(o => o.Address)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderDto
            {
                OrderId = o.OrderId,
                TotalAmount = o.TotalAmount,
                GrandTotal = o.GrandTotal,
                Status = o.Status,
                PaymentMethod = o.PaymentMethod,
                PaymentStatus = o.PaymentStatus,
                CreatedAt = o.CreatedAt,
                Items = o.OrderItems.Select(i => new OrderItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product!.Name,
                    ImageUrl = i.Product.ImageUrl,
                    Quantity = i.Quantity,
                    Price = i.Price,
                    Discount = i.Discount,
                    Subtotal = (i.Price - (i.Price * i.Discount / 100)) * i.Quantity
                }).ToList()
            }).ToListAsync();

        return Ok(orders);
    }
}

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
public class CartController : ControllerBase
{
    private readonly AppDbContext _context;

    public CartController(AppDbContext context)
    {
        _context = context;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = GetUserId();
        var cartItems = await _context.Carts
            .Include(c => c.Product)
            .Where(c => c.UserId == userId && !c.SavedForLater)
            .Select(c => new CartItemDto
            {
                CartId = c.CartId,
                ProductId = c.ProductId,
                ProductName = c.Product!.Name,
                ImageUrl = c.Product.ImageUrl,
                Price = c.Product.Price,
                Discount = c.Product.Discount,
                DiscountedPrice = c.Product.DiscountedPrice,
                Quantity = c.Quantity,
                MaxStock = c.Product.Stock,
                Subtotal = c.Product.DiscountedPrice * c.Quantity
            }).ToListAsync();

        var productTotal = cartItems.Sum(c => c.Subtotal);
        var deliveryCharge = productTotal > 500 ? 0 : 50;

        return Ok(new CartSummaryDto
        {
            Items = cartItems,
            ProductTotal = productTotal,
            DeliveryCharge = deliveryCharge,
            GrandTotal = productTotal + deliveryCharge,
            ItemCount = cartItems.Sum(c => c.Quantity)
        });
    }

    [HttpPost]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
    {
        var userId = GetUserId();
        var product = await _context.Products.FindAsync(dto.ProductId);
        if (product == null || !product.IsActive) return NotFound("Product not available");
        if (product.Stock < dto.Quantity) return BadRequest("Insufficient stock");

        var cartItem = await _context.Carts.FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == dto.ProductId);
        if (cartItem != null)
        {
            if (cartItem.Quantity + dto.Quantity > product.Stock) return BadRequest("Insufficient stock");
            cartItem.Quantity += dto.Quantity;
        }
        else
        {
            _context.Carts.Add(new Cart { UserId = userId, ProductId = dto.ProductId, Quantity = dto.Quantity });
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Added to cart" });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCartItem(int id, [FromBody] UpdateCartDto dto)
    {
        var userId = GetUserId();
        var cartItem = await _context.Carts.Include(c => c.Product).FirstOrDefaultAsync(c => c.CartId == id && c.UserId == userId);
        if (cartItem == null) return NotFound();

        if (cartItem.Product!.Stock < dto.Quantity) return BadRequest("Insufficient stock");
        
        cartItem.Quantity = dto.Quantity;
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveFromCart(int id)
    {
        var userId = GetUserId();
        var cartItem = await _context.Carts.FirstOrDefaultAsync(c => c.CartId == id && c.UserId == userId);
        if (cartItem == null) return NotFound();

        _context.Carts.Remove(cartItem);
        await _context.SaveChangesAsync();
        return Ok();
    }
}

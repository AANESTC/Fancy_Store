namespace FancyStore.API.Models;

public class Product
{
    public int ProductId { get; set; }
    public int CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal Discount { get; set; } = 0;
    public int Stock { get; set; } = 0;
    public string? ImageUrl { get; set; }
    public string? VideoUrl { get; set; }
    public string? Material { get; set; }
    public string? Color { get; set; }
    public string? Size { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsTrending { get; set; } = false;
    public bool IsBestSeller { get; set; } = false;
    public bool IsNewArrival { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Category? Category { get; set; }
    public ICollection<Cart> CartItems { get; set; } = new List<Cart>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();

    public decimal DiscountedPrice => Price - (Price * Discount / 100);
}

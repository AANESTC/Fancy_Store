namespace FancyStore.API.Models;

public class User
{
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Mobile { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "Customer"; // Customer | Admin
    public bool IsBlocked { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Cart> CartItems { get; set; } = new List<Cart>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<Address> Addresses { get; set; } = new List<Address>();
}

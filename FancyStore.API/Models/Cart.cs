namespace FancyStore.API.Models;

public class Cart
{
    public int CartId { get; set; }
    public int UserId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; } = 1;
    public bool SavedForLater { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
    public Product? Product { get; set; }
}

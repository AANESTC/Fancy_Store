namespace FancyStore.API.Models;

public class Review
{
    public int ReviewId { get; set; }
    public int UserId { get; set; }
    public int ProductId { get; set; }
    public int Rating { get; set; } // 1-5
    public string Comment { get; set; } = string.Empty;
    public bool IsApproved { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
    public Product? Product { get; set; }
}

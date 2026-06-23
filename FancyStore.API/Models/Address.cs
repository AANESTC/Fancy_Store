namespace FancyStore.API.Models;

public class Address
{
    public int AddressId { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Mobile { get; set; } = string.Empty;
    public string AddressLine { get; set; } = string.Empty;
    public string? Landmark { get; set; }
    public string Pincode { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public bool IsDefault { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
}

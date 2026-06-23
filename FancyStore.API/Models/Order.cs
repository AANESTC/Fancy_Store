namespace FancyStore.API.Models;

public class Order
{
    public int OrderId { get; set; }
    public int UserId { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal DiscountAmount { get; set; } = 0;
    public decimal GstAmount { get; set; } = 0;
    public decimal DeliveryCharge { get; set; } = 0;
    public decimal GrandTotal { get; set; }
    public string Status { get; set; } = "Placed"; // Placed, Confirmed, Packed, Shipped, OutForDelivery, Delivered, Cancelled
    public string PaymentMethod { get; set; } = "COD"; // UPI, CreditCard, DebitCard, NetBanking, COD
    public string PaymentStatus { get; set; } = "Pending"; // Pending, Paid, Failed, Refunded
    public string? RazorpayOrderId { get; set; }
    public string? CouponCode { get; set; }
    public int AddressId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public User? User { get; set; }
    public Address? Address { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}

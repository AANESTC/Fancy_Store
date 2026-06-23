namespace FancyStore.API.Models;

public class Coupon
{
    public int CouponId { get; set; }
    public string Code { get; set; } = string.Empty;
    public decimal DiscountPercent { get; set; }
    public decimal? MinOrderAmount { get; set; }
    public decimal? MaxDiscount { get; set; }
    public int UsageLimit { get; set; } = 100;
    public int UsedCount { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public DateTime ValidUntil { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

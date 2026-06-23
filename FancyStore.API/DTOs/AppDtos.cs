namespace FancyStore.API.DTOs;

public class CartItemDto
{
    public int CartId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public decimal Price { get; set; }
    public decimal Discount { get; set; }
    public decimal DiscountedPrice { get; set; }
    public int Quantity { get; set; }
    public int MaxStock { get; set; }
    public bool SavedForLater { get; set; }
    public decimal Subtotal { get; set; }
}

public class CartSummaryDto
{
    public List<CartItemDto> Items { get; set; } = new();
    public List<CartItemDto> SavedItems { get; set; } = new();
    public decimal ProductTotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal GstAmount { get; set; }
    public decimal DeliveryCharge { get; set; }
    public decimal GrandTotal { get; set; }
    public int ItemCount { get; set; }
}

public record AddToCartDto(int ProductId, int Quantity = 1);
public record UpdateCartDto(int Quantity);
public record ApplyCouponDto(string CouponCode, decimal CartTotal);

public class CouponResultDto
{
    public bool IsValid { get; set; }
    public string Message { get; set; } = string.Empty;
    public decimal DiscountAmount { get; set; }
    public decimal FinalTotal { get; set; }
}

// Order DTOs
public class CreateOrderDto
{
    public int AddressId { get; set; }
    public string PaymentMethod { get; set; } = "COD";
    public string? CouponCode { get; set; }
    public string? RazorpayOrderId { get; set; }
    public string? RazorpayPaymentId { get; set; }
    public string? RazorpaySignature { get; set; }
}

public class OrderDto
{
    public int OrderId { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal GstAmount { get; set; }
    public decimal DeliveryCharge { get; set; }
    public decimal GrandTotal { get; set; }
    public string Status { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public string? CouponCode { get; set; }
    public DateTime CreatedAt { get; set; }
    public AddressDto? Address { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderItemDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal Discount { get; set; }
    public decimal Subtotal { get; set; }
}

public record UpdateOrderStatusDto(string Status);

// Address DTOs
public class AddressDto
{
    public int AddressId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Mobile { get; set; } = string.Empty;
    public string AddressLine { get; set; } = string.Empty;
    public string? Landmark { get; set; }
    public string Pincode { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public bool IsDefault { get; set; }
}

public class CreateAddressDto
{
    public string Name { get; set; } = string.Empty;
    public string Mobile { get; set; } = string.Empty;
    public string AddressLine { get; set; } = string.Empty;
    public string? Landmark { get; set; }
    public string Pincode { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public bool IsDefault { get; set; } = false;
}

// Review DTOs
public class ReviewDto
{
    public int ReviewId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public bool IsApproved { get; set; }
    public DateTime CreatedAt { get; set; }
}

public record CreateReviewDto(int ProductId, int Rating, string Comment);

// Wishlist DTOs
public class WishlistItemDto
{
    public int WishlistId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public decimal Price { get; set; }
    public decimal Discount { get; set; }
    public decimal DiscountedPrice { get; set; }
    public bool InStock { get; set; }
}

// Admin DTOs
public class DashboardDto
{
    public decimal TotalSales { get; set; }
    public decimal TodaySales { get; set; }
    public int TotalOrders { get; set; }
    public int TodayOrders { get; set; }
    public int TotalCustomers { get; set; }
    public int TotalProducts { get; set; }
    public int LowStockProducts { get; set; }
    public int PendingOrders { get; set; }
    public List<SalesChartDto> SalesChart { get; set; } = new();
    public List<TopProductDto> TopProducts { get; set; } = new();
    public List<RecentOrderDto> RecentOrders { get; set; } = new();
}

public class SalesChartDto
{
    public string Label { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public int Orders { get; set; }
}

public class TopProductDto
{
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public int TotalSold { get; set; }
    public decimal Revenue { get; set; }
}

public class RecentOrderDto
{
    public int OrderId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public decimal GrandTotal { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class InventoryItemDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public int Stock { get; set; }
    public string StockStatus { get; set; } = string.Empty; // InStock, LowStock, OutOfStock
    public decimal Price { get; set; }
}

// Razorpay
public class CreateRazorpayOrderDto
{
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "INR";
}

public class RazorpayOrderResponseDto
{
    public string OrderId { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
    public long Amount { get; set; }
    public string KeyId { get; set; } = string.Empty;
}

// Banner & Coupon DTOs
public class CreateBannerDto
{
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? LinkUrl { get; set; }
    public int SortOrder { get; set; } = 0;
}

public class CreateCouponDto
{
    public string Code { get; set; } = string.Empty;
    public decimal DiscountPercent { get; set; }
    public decimal? MinOrderAmount { get; set; }
    public decimal? MaxDiscount { get; set; }
    public int UsageLimit { get; set; } = 100;
    public DateTime ValidUntil { get; set; }
}

namespace FancyStore.API.DTOs;

public class ProductDto
{
    public int ProductId { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal Discount { get; set; }
    public decimal DiscountedPrice { get; set; }
    public int Stock { get; set; }
    public string? ImageUrl { get; set; }
    public string? VideoUrl { get; set; }
    public string? Material { get; set; }
    public string? Color { get; set; }
    public string? Size { get; set; }
    public bool IsActive { get; set; }
    public bool IsTrending { get; set; }
    public bool IsBestSeller { get; set; }
    public bool IsNewArrival { get; set; }
    public double AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public DateTime CreatedAt { get; set; }
}


public class ProductFilterDto
{
    public int? CategoryId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? Color { get; set; }
    public string? Material { get; set; }
    public bool? InStock { get; set; }
    public string? SortBy { get; set; } // price_asc, price_desc, newest, best_selling, popular
    public string? SearchKeyword { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 12;
}

public class ProductListResponseDto
{
    public List<ProductDto> Products { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

public class CategoryDto
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; }
    public int ProductCount { get; set; }
}

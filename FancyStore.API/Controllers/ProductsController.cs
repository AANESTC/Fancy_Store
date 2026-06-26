using FancyStore.API.Data;
using FancyStore.API.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FancyStore.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] ProductFilterDto filter, [FromQuery] string? category)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .Include(p => p.Reviews)
            .Where(p => p.IsActive);

        if (filter.CategoryId.HasValue)
            query = query.Where(p => p.CategoryId == filter.CategoryId);

        if (!string.IsNullOrEmpty(category) && category.ToLower() != "all")
        {
            var formattedCategory = category.Replace("-", " ").ToLower();
            query = query.Where(p => p.Category!.CategoryName.ToLower().Contains(formattedCategory));
        }

        if (filter.MinPrice.HasValue)
            query = query.Where(p => (p.Price - (p.Price * p.Discount / 100)) >= filter.MinPrice);

        if (filter.MaxPrice.HasValue)
            query = query.Where(p => (p.Price - (p.Price * p.Discount / 100)) <= filter.MaxPrice);

        if (!string.IsNullOrEmpty(filter.SearchKeyword))
            query = query.Where(p => p.Name.Contains(filter.SearchKeyword) || p.Description.Contains(filter.SearchKeyword));

        var totalCount = await query.CountAsync();

        var products = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(p => new ProductDto
            {
                ProductId = p.ProductId,
                CategoryId = p.CategoryId,
                CategoryName = p.Category!.CategoryName,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Discount = p.Discount,
                DiscountedPrice = p.DiscountedPrice,
                Stock = p.Stock,
                ImageUrl = p.ImageUrl,
                IsActive = p.IsActive,
                IsTrending = p.IsTrending,
                IsBestSeller = p.IsBestSeller,
                IsNewArrival = p.IsNewArrival,
                AverageRating = p.Reviews.Any(r => r.IsApproved) ? p.Reviews.Where(r => r.IsApproved).Average(r => r.Rating) : 0,
                ReviewCount = p.Reviews.Count(r => r.IsApproved)
            })
            .ToListAsync();

        return Ok(new ProductListResponseDto
        {
            Products = products,
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)filter.PageSize)
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        var p = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Reviews)
            .FirstOrDefaultAsync(p => p.ProductId == id && p.IsActive);

        if (p == null) return NotFound();

        return Ok(new ProductDto
        {
            ProductId = p.ProductId,
            CategoryId = p.CategoryId,
            CategoryName = p.Category!.CategoryName,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            Discount = p.Discount,
            DiscountedPrice = p.DiscountedPrice,
            Stock = p.Stock,
            ImageUrl = p.ImageUrl,
            IsTrending = p.IsTrending,
            IsBestSeller = p.IsBestSeller,
            IsNewArrival = p.IsNewArrival,
            AverageRating = p.Reviews.Any(r => r.IsApproved) ? p.Reviews.Where(r => r.IsApproved).Average(r => r.Rating) : 0,
            ReviewCount = p.Reviews.Count(r => r.IsApproved)
        });
    }
}

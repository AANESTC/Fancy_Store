using FancyStore.API.Data;
using FancyStore.API.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FancyStore.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.Categories
            .Where(c => c.IsActive)
            .Select(c => new CategoryDto
            {
                CategoryId = c.CategoryId,
                CategoryName = c.CategoryName,
                ImageUrl = c.ImageUrl,
                IsActive = c.IsActive,
                ProductCount = c.Products.Count(p => p.IsActive)
            }).ToListAsync();

        return Ok(categories);
    }

    [HttpGet("priceranges")]
    public async Task<IActionResult> GetPriceRanges()
    {
        var ranges = await _context.PriceRanges.OrderBy(p => p.SortOrder).ToListAsync();
        return Ok(ranges);
    }
}

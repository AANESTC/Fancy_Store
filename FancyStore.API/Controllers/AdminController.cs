using FancyStore.API.Data;
using FancyStore.API.DTOs;
using FancyStore.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FancyStore.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public AdminController(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    // ==================== DASHBOARD ====================

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var today = DateTime.UtcNow.Date;

        var totalSales = await _context.Orders.Where(o => o.Status != "Cancelled").SumAsync(o => (decimal?)o.GrandTotal) ?? 0;
        
        var nextDay = today.AddDays(1);
        var todaySales = await _context.Orders.Where(o => o.CreatedAt >= today && o.CreatedAt < nextDay && o.Status != "Cancelled").SumAsync(o => (decimal?)o.GrandTotal) ?? 0;

        var totalOrders = await _context.Orders.CountAsync();
        var todayOrders = await _context.Orders.CountAsync(o => o.CreatedAt >= today && o.CreatedAt < nextDay);
        var pendingOrders = await _context.Orders.CountAsync(o => o.Status == "Pending");

        var totalCustomers = await _context.Users.CountAsync(u => u.Role == "Customer");
        var totalProducts = await _context.Products.CountAsync();
        var lowStockCount = await _context.Products.CountAsync(p => p.Stock > 0 && p.Stock < 10);

        var recentOrders = await _context.Orders
            .Include(o => o.User)
            .OrderByDescending(o => o.CreatedAt)
            .Take(10)
            .Select(o => new RecentOrderDto
            {
                OrderId = o.OrderId,
                CustomerName = o.User!.Name,
                GrandTotal = o.GrandTotal,
                Status = o.Status,
                CreatedAt = o.CreatedAt
            }).ToListAsync();

        // Monthly sales chart (last 6 months)
        var sixMonthsAgo = DateTime.UtcNow.AddMonths(-6);
        var salesChartData = await _context.Orders
            .Where(o => o.CreatedAt >= sixMonthsAgo && o.Status != "Cancelled")
            .GroupBy(o => new { o.CreatedAt.Year, o.CreatedAt.Month })
            .Select(g => new
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                Amount = g.Sum(o => o.GrandTotal),
                Orders = g.Count()
            })
            .ToListAsync();

        var salesChart = salesChartData.Select(g => new SalesChartDto
            {
                Label = $"{g.Year}-{g.Month:D2}",
                Amount = g.Amount,
                Orders = g.Orders
            })
            .OrderBy(x => x.Label)
            .ToList();

        // Top products
        var topProducts = await _context.OrderItems
            .Include(i => i.Product)
            .GroupBy(i => new { i.ProductId, i.Product!.Name, i.Product.ImageUrl })
            .Select(g => new TopProductDto
            {
                ProductId = g.Key.ProductId,
                Name = g.Key.Name,
                ImageUrl = g.Key.ImageUrl,
                TotalSold = g.Sum(i => i.Quantity),
                Revenue = g.Sum(i => i.Price * i.Quantity)
            })
            .OrderByDescending(t => t.TotalSold)
            .Take(5)
            .ToListAsync();

        return Ok(new DashboardDto
        {
            TotalSales = totalSales,
            TodaySales = todaySales,
            TotalOrders = totalOrders,
            TodayOrders = todayOrders,
            TotalCustomers = totalCustomers,
            TotalProducts = totalProducts,
            LowStockProducts = lowStockCount,
            PendingOrders = pendingOrders,
            RecentOrders = recentOrders,
            SalesChart = salesChart,
            TopProducts = topProducts
        });
    }

    // ==================== PRODUCTS ====================

    [HttpGet("products")]
    public async Task<IActionResult> GetProducts([FromQuery] int page = 1, [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null, [FromQuery] int? categoryId = null, [FromQuery] string? status = null)
    {
        var query = _context.Products.Include(p => p.Category).AsQueryable();

        if (!string.IsNullOrEmpty(search))
            query = query.Where(p => p.Name.Contains(search) || p.Description.Contains(search));

        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId);

        if (status == "active")
            query = query.Where(p => p.IsActive);
        else if (status == "inactive")
            query = query.Where(p => !p.IsActive);

        var totalCount = await query.CountAsync();

        var products = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new AdminProductDto
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
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();

        return Ok(new { products, totalCount, page, pageSize, totalPages = (int)Math.Ceiling(totalCount / (double)pageSize) });
    }

    [HttpGet("products/{id}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        var p = await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.ProductId == id);
        if (p == null) return NotFound();

        return Ok(new AdminProductDto
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
            CreatedAt = p.CreatedAt
        });
    }

    [HttpPost("products")]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            CategoryId = dto.CategoryId,
            Description = dto.Description,
            Price = dto.Price,
            Discount = dto.Discount,
            Stock = dto.Stock,
            ImageUrl = dto.ImageUrl,
            IsActive = dto.IsActive,
            IsTrending = dto.IsTrending,
            IsBestSeller = dto.IsBestSeller,
            IsNewArrival = dto.IsNewArrival,
            CreatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Product created", productId = product.ProductId });
    }

    [HttpPut("products/{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] CreateProductDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        product.Name = dto.Name;
        product.CategoryId = dto.CategoryId;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.Discount = dto.Discount;
        product.Stock = dto.Stock;
        product.ImageUrl = dto.ImageUrl;
        product.IsActive = dto.IsActive;
        product.IsTrending = dto.IsTrending;
        product.IsBestSeller = dto.IsBestSeller;
        product.IsNewArrival = dto.IsNewArrival;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Product updated" });
    }

    [HttpDelete("products/{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Product deleted" });
    }

    [HttpDelete("remove-duplicates")]
    public async Task<IActionResult> RemoveDuplicates()
    {
        var duplicates = await _context.Products
            .GroupBy(p => p.Name)
            .Where(g => g.Count() > 1)
            .SelectMany(g => g.OrderByDescending(p => p.ProductId).Skip(1))
            .ToListAsync();

        _context.Products.RemoveRange(duplicates);
        await _context.SaveChangesAsync();
        return Ok(new { message = $"Removed {duplicates.Count} duplicate products" });
    }

    [HttpPatch("products/{id}/toggle-status")]
    public async Task<IActionResult> ToggleProductStatus(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        product.IsActive = !product.IsActive;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Status updated", isActive = product.IsActive });
    }

    // ==================== CATEGORIES ====================

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.Categories
            .Select(c => new AdminCategoryDto
            {
                CategoryId = c.CategoryId,
                CategoryName = c.CategoryName,
                ImageUrl = c.ImageUrl,
                IsActive = c.IsActive,
                ProductCount = c.Products.Count
            }).ToListAsync();
        return Ok(categories);
    }

    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDto dto)
    {
        var category = new Category
        {
            CategoryName = dto.CategoryName,
            ImageUrl = dto.ImageUrl,
            IsActive = true
        };
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Category created", categoryId = category.CategoryId });
    }

    [HttpPut("categories/{id}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] CreateCategoryDto dto)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound();

        category.CategoryName = dto.CategoryName;
        category.ImageUrl = dto.ImageUrl;
        category.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Category updated" });
    }

    [HttpDelete("categories/{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound();

        var hasProducts = await _context.Products.AnyAsync(p => p.CategoryId == id);
        if (hasProducts)
            return BadRequest(new { message = "Cannot delete category with existing products" });

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Category deleted" });
    }

    // ==================== ORDERS ====================

    [HttpGet("orders")]
    public async Task<IActionResult> GetAllOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 10,
        [FromQuery] string? status = null, [FromQuery] string? search = null)
    {
        var query = _context.Orders.Include(o => o.User).Include(o => o.OrderItems).AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(o => o.Status == status);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(o => o.User!.Name.Contains(search) || o.OrderId.ToString() == search);

        var totalCount = await query.CountAsync();

        var orders = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(o => new AdminOrderDto
            {
                OrderId = o.OrderId,
                CustomerName = o.User!.Name,
                CustomerEmail = o.User.Email,
                CustomerMobile = o.User.Mobile,
                TotalAmount = o.TotalAmount,
                DiscountAmount = o.DiscountAmount,
                GrandTotal = o.GrandTotal,
                Status = o.Status,
                PaymentMethod = o.PaymentMethod,
                PaymentStatus = o.PaymentStatus,
                CreatedAt = o.CreatedAt,
                ItemCount = o.OrderItems.Count
            }).ToListAsync();

        return Ok(new { orders, totalCount, page, pageSize, totalPages = (int)Math.Ceiling(totalCount / (double)pageSize) });
    }

    [HttpGet("orders/{id}")]
    public async Task<IActionResult> GetOrderDetails(int id)
    {
        var order = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.Address)
            .Include(o => o.OrderItems).ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.OrderId == id);

        if (order == null) return NotFound();

        return Ok(new
        {
            order.OrderId,
            Customer = new { order.User!.Name, order.User.Email, order.User.Mobile },
            Address = order.Address == null ? null : new
            {
                order.Address.AddressLine,
                order.Address.Landmark,
                order.Address.City,
                order.Address.State,
                order.Address.Pincode
            },
            order.TotalAmount,
            order.DiscountAmount,
            order.GstAmount,
            order.DeliveryCharge,
            order.GrandTotal,
            order.Status,
            order.PaymentMethod,
            order.PaymentStatus,
            order.CouponCode,
            order.CreatedAt,
            Items = order.OrderItems.Select(i => new
            {
                i.ProductId,
                ProductName = i.Product?.Name,
                ImageUrl = i.Product?.ImageUrl,
                i.Quantity,
                i.Price,
                i.Discount,
                Subtotal = i.Price * i.Quantity
            })
        });
    }

    [HttpPut("orders/{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound();

        var validTransitions = new Dictionary<string, List<string>>
        {
            { "Pending", new List<string> { "Confirmed", "Cancelled" } },
            { "Confirmed", new List<string> { "Packed", "Cancelled" } },
            { "Packed", new List<string> { "Shipped" } },
            { "Shipped", new List<string> { "Delivered" } },
            { "Delivered", new List<string> { "Refunded" } }
        };

        if (validTransitions.ContainsKey(order.Status) && !validTransitions[order.Status].Contains(dto.Status))
            return BadRequest(new { message = $"Cannot transition from {order.Status} to {dto.Status}" });

        order.Status = dto.Status;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Order status updated" });
    }

    // ==================== CUSTOMERS ====================

    [HttpGet("customers")]
    public async Task<IActionResult> GetCustomers([FromQuery] int page = 1, [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null, [FromQuery] bool? isBlocked = null)
    {
        var query = _context.Users.Where(u => u.Role == "Customer").AsQueryable();

        if (!string.IsNullOrEmpty(search))
            query = query.Where(u => u.Name.Contains(search) || u.Email.Contains(search) || u.Mobile.Contains(search));

        if (isBlocked.HasValue)
            query = query.Where(u => u.IsBlocked == isBlocked);

        var totalCount = await query.CountAsync();

        var customers = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new UserDto
            {
                UserId = u.UserId,
                Name = u.Name,
                Email = u.Email,
                Mobile = u.Mobile,
                Role = u.Role,
                IsBlocked = u.IsBlocked,
                CreatedAt = u.CreatedAt,
                OrderCount = u.Orders.Count
            }).ToListAsync();

        return Ok(new { customers, totalCount, page, pageSize, totalPages = (int)Math.Ceiling(totalCount / (double)pageSize) });
    }

    [HttpGet("customers/{id}")]
    public async Task<IActionResult> GetCustomerDetails(int id)
    {
        var user = await _context.Users
            .Include(u => u.Orders).ThenInclude(o => o.OrderItems)
            .FirstOrDefaultAsync(u => u.UserId == id && u.Role == "Customer");

        if (user == null) return NotFound();

        return Ok(new
        {
            user.UserId,
            user.Name,
            user.Email,
            user.Mobile,
            user.IsBlocked,
            user.CreatedAt,
            Orders = user.Orders.OrderByDescending(o => o.CreatedAt).Select(o => new
            {
                o.OrderId,
                o.GrandTotal,
                o.Status,
                o.CreatedAt,
                ItemCount = o.OrderItems.Count
            })
        });
    }

    [HttpPatch("customers/{id}/toggle-block")]
    public async Task<IActionResult> ToggleBlockCustomer(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null || user.Role == "Admin") return NotFound();

        user.IsBlocked = !user.IsBlocked;
        await _context.SaveChangesAsync();
        return Ok(new { message = user.IsBlocked ? "Customer blocked" : "Customer unblocked", isBlocked = user.IsBlocked });
    }

    // ==================== COUPONS ====================

    [HttpGet("coupons")]
    public async Task<IActionResult> GetCoupons()
    {
        var coupons = await _context.Coupons.OrderByDescending(c => c.CouponId).ToListAsync();
        return Ok(coupons);
    }

    [HttpPost("coupons")]
    public async Task<IActionResult> CreateCoupon([FromBody] CreateCouponDto dto)
    {
        var exists = await _context.Coupons.AnyAsync(c => c.Code == dto.Code);
        if (exists) return BadRequest(new { message = "Coupon code already exists" });

        var coupon = new Coupon
        {
            Code = dto.Code.ToUpper(),
            DiscountPercent = dto.DiscountPercent,
            MinOrderAmount = dto.MinOrderAmount,
            MaxDiscount = dto.MaxDiscount,
            UsageLimit = dto.UsageLimit,
            ValidUntil = dto.ValidUntil,
            IsActive = true
        };
        _context.Coupons.Add(coupon);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Coupon created", couponId = coupon.CouponId });
    }

    [HttpPut("coupons/{id}")]
    public async Task<IActionResult> UpdateCoupon(int id, [FromBody] CreateCouponDto dto)
    {
        var coupon = await _context.Coupons.FindAsync(id);
        if (coupon == null) return NotFound();

        coupon.Code = dto.Code.ToUpper();
        coupon.DiscountPercent = dto.DiscountPercent;
        coupon.MinOrderAmount = dto.MinOrderAmount;
        coupon.MaxDiscount = dto.MaxDiscount;
        coupon.UsageLimit = dto.UsageLimit;
        coupon.ValidUntil = dto.ValidUntil;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Coupon updated" });
    }

    [HttpPatch("coupons/{id}/toggle")]
    public async Task<IActionResult> ToggleCoupon(int id)
    {
        var coupon = await _context.Coupons.FindAsync(id);
        if (coupon == null) return NotFound();

        coupon.IsActive = !coupon.IsActive;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Coupon status updated", isActive = coupon.IsActive });
    }

    [HttpDelete("coupons/{id}")]
    public async Task<IActionResult> DeleteCoupon(int id)
    {
        var coupon = await _context.Coupons.FindAsync(id);
        if (coupon == null) return NotFound();

        _context.Coupons.Remove(coupon);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Coupon deleted" });
    }

    // ==================== INVENTORY ====================

    [HttpGet("inventory")]
    public async Task<IActionResult> GetInventory([FromQuery] string? filter = null)
    {
        var query = _context.Products.Include(p => p.Category).AsQueryable();

        if (filter == "low") query = query.Where(p => p.Stock > 0 && p.Stock < 10);
        else if (filter == "out") query = query.Where(p => p.Stock == 0);

        var items = await query.OrderBy(p => p.Stock)
            .Select(p => new InventoryItemDto
            {
                ProductId = p.ProductId,
                ProductName = p.Name,
                CategoryName = p.Category!.CategoryName,
                Stock = p.Stock,
                Price = p.Price,
                StockStatus = p.Stock == 0 ? "OutOfStock" : p.Stock < 10 ? "LowStock" : "InStock"
            }).ToListAsync();

        return Ok(items);
    }

    [HttpPatch("inventory/{id}/stock")]
    public async Task<IActionResult> UpdateStock(int id, [FromBody] UpdateStockDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        product.Stock = dto.Stock;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Stock updated", stock = product.Stock });
    }

    // ==================== IMAGE UPLOAD ====================

    [HttpPost("upload")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file provided" });

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(ext))
            return BadRequest(new { message = "Invalid file type" });

        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(new { message = "File size exceeds 5MB" });

        var uploadFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads", "products");
        Directory.CreateDirectory(uploadFolder);

        var fileName = $"{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(uploadFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
            await file.CopyToAsync(stream);

        var baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
        var url = $"{baseUrl}/uploads/products/{fileName}";
        return Ok(new { url, message = "Image uploaded successfully" });
    }

    [HttpPost("fix-images")]
    public async Task<IActionResult> FixImageUrls()
    {
        var baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
        
        var products = await _context.Products.Where(p => p.ImageUrl != null && p.ImageUrl.StartsWith("/uploads")).ToListAsync();
        foreach (var p in products)
            p.ImageUrl = baseUrl + p.ImageUrl;

        var categories = await _context.Categories.Where(c => c.ImageUrl != null && c.ImageUrl.StartsWith("/uploads")).ToListAsync();
        foreach (var c in categories)
            c.ImageUrl = baseUrl + c.ImageUrl;

        await _context.SaveChangesAsync();
        return Ok(new { message = $"Fixed {products.Count} products and {categories.Count} categories" });
    }

    // ==================== REPORTS ====================

    [HttpGet("reports/sales")]
    public async Task<IActionResult> GetSalesReport([FromQuery] string period = "monthly",
        [FromQuery] DateTime? from = null, [FromQuery] DateTime? to = null)
    {
        var query = _context.Orders.Where(o => o.Status != "Cancelled");

        if (from.HasValue) query = query.Where(o => o.CreatedAt >= from.Value);
        if (to.HasValue) query = query.Where(o => o.CreatedAt <= to.Value);

        var orders = await query
            .GroupBy(o => period == "daily"
                ? o.CreatedAt.Date.ToString()
                : $"{o.CreatedAt.Year}-{o.CreatedAt.Month:D2}")
            .Select(g => new { Label = g.Key, Amount = g.Sum(o => o.GrandTotal), Orders = g.Count() })
            .OrderBy(x => x.Label)
            .ToListAsync();

        return Ok(orders);
    }

    [HttpGet("reports/products")]
    public async Task<IActionResult> GetProductReport()
    {
        var products = await _context.OrderItems
            .Include(i => i.Product).ThenInclude(p => p!.Category)
            .GroupBy(i => new { i.ProductId, i.Product!.Name, CategoryName = i.Product.Category!.CategoryName })
            .Select(g => new
            {
                g.Key.ProductId,
                g.Key.Name,
                g.Key.CategoryName,
                TotalSold = g.Sum(i => i.Quantity),
                Revenue = g.Sum(i => i.Price * i.Quantity)
            })
            .OrderByDescending(p => p.Revenue)
            .ToListAsync();

        return Ok(products);
    }

    [HttpGet("priceranges")]
    public async Task<IActionResult> GetPriceRanges()
    {
        return Ok(await _context.PriceRanges.OrderBy(p => p.SortOrder).ToListAsync());
    }

    [HttpPost("priceranges")]
    public async Task<IActionResult> CreatePriceRange(PriceRange pr)
    {
        _context.PriceRanges.Add(pr);
        await _context.SaveChangesAsync();
        return Ok(pr);
    }

    [HttpPut("priceranges/{id}")]
    public async Task<IActionResult> UpdatePriceRange(int id, PriceRange pr)
    {
        if (id != pr.Id) return BadRequest();
        _context.Entry(pr).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return Ok(pr);
    }

    [HttpDelete("priceranges/{id}")]
    public async Task<IActionResult> DeletePriceRange(int id)
    {
        var pr = await _context.PriceRanges.FindAsync(id);
        if (pr == null) return NotFound();
        _context.PriceRanges.Remove(pr);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

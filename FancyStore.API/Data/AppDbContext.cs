using Microsoft.EntityFrameworkCore;
using FancyStore.API.Models;

namespace FancyStore.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.ConfigureWarnings(warnings => warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Wishlist> Wishlists => Set<Wishlist>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<Banner> Banners => Set<Banner>();
    public DbSet<PriceRange> PriceRanges => Set<PriceRange>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Product - Category (many-to-one)
        modelBuilder.Entity<Product>()
            .HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // Order relationships (prevent multiple cascade paths)
        modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.Address)
            .WithMany()
            .HasForeignKey(o => o.AddressId)
            .OnDelete(DeleteBehavior.Restrict);

        // Cart unique constraint
        modelBuilder.Entity<Cart>()
            .HasIndex(c => new { c.UserId, c.ProductId })
            .IsUnique();

        // Wishlist unique constraint
        modelBuilder.Entity<Wishlist>()
            .HasIndex(w => new { w.UserId, w.ProductId })
            .IsUnique();

        // Product price precision
        modelBuilder.Entity<Product>()
            .Property(p => p.Price)
            .HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Product>()
            .Property(p => p.Discount)
            .HasColumnType("decimal(5,2)");

        // Order precision
        modelBuilder.Entity<Order>()
            .Property(o => o.TotalAmount).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Order>()
            .Property(o => o.GrandTotal).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Order>()
            .Property(o => o.DiscountAmount).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Order>()
            .Property(o => o.GstAmount).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Order>()
            .Property(o => o.DeliveryCharge).HasColumnType("decimal(18,2)");

        // OrderItem precision
        modelBuilder.Entity<OrderItem>()
            .Property(i => i.Price).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<OrderItem>()
            .Property(i => i.Discount).HasColumnType("decimal(5,2)");

        // Coupon precision
        modelBuilder.Entity<Coupon>()
            .Property(c => c.DiscountPercent).HasColumnType("decimal(5,2)");
        modelBuilder.Entity<Coupon>()
            .Property(c => c.MinOrderAmount).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Coupon>()
            .Property(c => c.MaxDiscount).HasColumnType("decimal(18,2)");

        // Seed data
        modelBuilder.Entity<Category>().HasData(
            new Category { CategoryId = 1, CategoryName = "Bangles", ImageUrl = "/images/categories/bangles.jpg", IsActive = true },
            new Category { CategoryId = 2, CategoryName = "Dollar Chains", ImageUrl = "/images/categories/dollar-chains.jpg", IsActive = true },
            new Category { CategoryId = 3, CategoryName = "Invisible Chains", ImageUrl = "/images/categories/invisible-chains.jpg", IsActive = true },
            new Category { CategoryId = 4, CategoryName = "Earrings", ImageUrl = "/images/categories/earrings.jpg", IsActive = true },
            new Category { CategoryId = 5, CategoryName = "Hair Accessories", ImageUrl = "/images/categories/hair-accessories.jpg", IsActive = true },
            new Category { CategoryId = 6, CategoryName = "Fancy Items", ImageUrl = "/images/categories/fancy-items.jpg", IsActive = true },
            new Category { CategoryId = 7, CategoryName = "Gift Items", ImageUrl = "/images/categories/gift-items.jpg", IsActive = true }
        );

        // Seed Admin User
        modelBuilder.Entity<User>().HasData(
            new User
            {
                UserId = 1,
                Name = "Fancy Store Admin",
                Email = "admin@gmail.com",
                Mobile = "9999999999",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin@123"),
                Role = "Admin",
                IsBlocked = false,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );

        modelBuilder.Entity<Coupon>().HasData(
            new Coupon { CouponId = 1, Code = "WELCOME10", DiscountPercent = 10, MinOrderAmount = 200, MaxDiscount = 100, UsageLimit = 1000, IsActive = true, ValidUntil = new DateTime(2027, 12, 31, 0, 0, 0, DateTimeKind.Utc) },
            new Coupon { CouponId = 2, Code = "FANCY20", DiscountPercent = 20, MinOrderAmount = 500, MaxDiscount = 200, UsageLimit = 500, IsActive = true, ValidUntil = new DateTime(2027, 12, 31, 0, 0, 0, DateTimeKind.Utc) }
        );

        modelBuilder.Entity<Product>().HasData(
            new Product { ProductId = 1, Name = "Elegant Bridal Bangles Set", Description = "Premium gold-plated bangles with intricate craftsmanship.", Price = 1299, Discount = 10, CategoryId = 1, Stock = 50, ImageUrl = "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop", IsActive = true, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Product { ProductId = 2, Name = "Premium Invisible Chain", Description = "Minimalist and modern invisible chain for daily wear.", Price = 499, Discount = 20, CategoryId = 3, Stock = 100, ImageUrl = "https://images.unsplash.com/photo-1599643478514-4a888f6188dc?w=800&auto=format&fit=crop", IsActive = true, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Product { ProductId = 3, Name = "Korean Drop Earrings", Description = "Trending Korean style elegant drop earrings.", Price = 299, Discount = 0, CategoryId = 4, Stock = 200, ImageUrl = "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop", IsActive = true, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Product { ProductId = 4, Name = "Gold Plated Dollar Chain", Description = "Thick, luxurious dollar chain design.", Price = 899, Discount = 15, CategoryId = 2, Stock = 30, ImageUrl = "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&auto=format&fit=crop", IsActive = true, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            
            // Adding more products to populate the store
            new Product { ProductId = 5, Name = "Ruby Studded Bangles", Description = "Traditional bangles embedded with premium artificial rubies.", Price = 1599, Discount = 5, CategoryId = 1, Stock = 20, ImageUrl = "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=800&auto=format&fit=crop", IsActive = true, CreatedAt = new DateTime(2024, 1, 2, 0, 0, 0, DateTimeKind.Utc) },
            new Product { ProductId = 6, Name = "Diamond Accent Hoops", Description = "Stunning hoop earrings with delicate diamond accents.", Price = 599, Discount = 10, CategoryId = 4, Stock = 80, ImageUrl = "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop", IsActive = true, CreatedAt = new DateTime(2024, 1, 3, 0, 0, 0, DateTimeKind.Utc) },
            new Product { ProductId = 7, Name = "Classic Pearl Necklace", Description = "Timeless pearl necklace perfect for evening wear.", Price = 1899, Discount = 25, CategoryId = 2, Stock = 15, ImageUrl = "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop", IsActive = true, CreatedAt = new DateTime(2024, 1, 4, 0, 0, 0, DateTimeKind.Utc) },
            new Product { ProductId = 8, Name = "Crystal Hair Pin Set", Description = "Sparkling crystal hair accessories for bridal and party wear.", Price = 349, Discount = 0, CategoryId = 5, Stock = 150, ImageUrl = "https://images.unsplash.com/photo-1569397288884-4d43e667d264?w=800&auto=format&fit=crop", IsActive = true, CreatedAt = new DateTime(2024, 1, 5, 0, 0, 0, DateTimeKind.Utc) },
            new Product { ProductId = 9, Name = "Rose Gold Cuff Bangle", Description = "Modern rose gold cuff with a sleek, minimalist aesthetic.", Price = 899, Discount = 20, CategoryId = 1, Stock = 45, ImageUrl = "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop", IsActive = true, CreatedAt = new DateTime(2024, 1, 6, 0, 0, 0, DateTimeKind.Utc) },
            new Product { ProductId = 10, Name = "Sapphire Tear Drop Earrings", Description = "Elegant teardrop earrings featuring deep blue sapphire replicas.", Price = 649, Discount = 15, CategoryId = 4, Stock = 60, ImageUrl = "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&auto=format&fit=crop", IsActive = true, CreatedAt = new DateTime(2024, 1, 7, 0, 0, 0, DateTimeKind.Utc) },
            new Product { ProductId = 11, Name = "Layered Gold Chain", Description = "Fashion-forward multi-layered gold chain.", Price = 1199, Discount = 30, CategoryId = 2, Stock = 25, ImageUrl = "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop", IsActive = true, CreatedAt = new DateTime(2024, 1, 8, 0, 0, 0, DateTimeKind.Utc) },
            new Product { ProductId = 12, Name = "Premium Velvet Jewelry Box", Description = "Perfect gift item for storing precious jewelry securely.", Price = 1299, Discount = 0, CategoryId = 7, Stock = 40, ImageUrl = "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop", IsActive = true, CreatedAt = new DateTime(2024, 1, 9, 0, 0, 0, DateTimeKind.Utc) }
        );

        modelBuilder.Entity<PriceRange>().HasData(
            new PriceRange { Id = 1, Label = "Under ₹500", MinPrice = 0, MaxPrice = 499, SortOrder = 1 },
            new PriceRange { Id = 2, Label = "₹500 - ₹1000", MinPrice = 500, MaxPrice = 1000, SortOrder = 2 },
            new PriceRange { Id = 3, Label = "₹1000 - ₹2000", MinPrice = 1000, MaxPrice = 2000, SortOrder = 3 },
            new PriceRange { Id = 4, Label = "Over ₹2000", MinPrice = 2001, MaxPrice = null, SortOrder = 4 }
        );
    }
}

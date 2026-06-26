namespace FancyStore.API.Models;

public class ProductImage
{
    public int ProductImageId { get; set; }
    public int ProductId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int DisplayOrder { get; set; } = 0;
    public int RotationAngle { get; set; } = 0;

    public Product? Product { get; set; }
}

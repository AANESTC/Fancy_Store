using System.ComponentModel.DataAnnotations;

namespace FancyStore.API.Models;

public class PriceRange
{
    [Key]
    public int Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public int SortOrder { get; set; }
}

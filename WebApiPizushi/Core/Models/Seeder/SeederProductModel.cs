namespace Core.Models.Seeder;

public class SeederProductModel
{
    public string Name { get; set; } = string.Empty;
    public string CategorySlug { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Weight { get; set; }
    public string Image { get; set; } = string.Empty;
}

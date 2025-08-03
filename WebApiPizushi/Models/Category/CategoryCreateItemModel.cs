namespace WebApiPizushi.Models.Category
{
    public class CategoryCreateItemModel
    {
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public IFormFile Image { get; set; } = null!;
    }
}

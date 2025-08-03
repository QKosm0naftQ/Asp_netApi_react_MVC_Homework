using System.ComponentModel.DataAnnotations;
using WebProgram.Models.Helpers;

namespace WebProgram.Models.Product;

public class ProductSearchViewModel
{
    [Display(Name="Назва")]
    public string Name { get; set; } = String.Empty;
    [Display(Name = "Опис")]
    public string Description { get; set; } = string.Empty;
    [Display(Name = "Категорія")]
    public int CategoryId { get; set; }
    public List<SelectItemViewModel> Categories { get; set; } = new ();
    
    // Нові властивості для пагінації
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public List<int> AvailablePageSizes { get; } = new List<int> { 5, 10, 20, 50 };

    
}
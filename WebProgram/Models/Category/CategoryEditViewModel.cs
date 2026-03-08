using System.ComponentModel.DataAnnotations;

namespace WebProgram.Models.Category;

public class CategoryEditViewModel
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Добра закушуйте. Вкажіть назву :)")]
    [Display(Name = "Назва категорії")]
    public string Name { get; set; } = string.Empty;

    [Display(Name = "Опис")]
    public string? Description { get; set; } = string.Empty;

    public string? ViewImage { get; set; } = string.Empty;

    [Display(Name = "Оберіть фото")]
    public IFormFile ? ImageFile { get; set; } = null!;
}

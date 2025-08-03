using System.ComponentModel.DataAnnotations;

namespace WebProgram.Models.Account;

public class RegisterViewModel
{
    [Display(Name = "Ім'я")]
    [Required(ErrorMessage = "Вкажіть своє ім'я")]
    public string FirstName { get; set; } = string.Empty;

    [Display(Name = "Прізвище")]
    [Required(ErrorMessage = "Вкажіть своє прізвище")]
    public string LastName { get; set; } = string.Empty;

    [Display(Name = "Електронна пошта")]
    [Required(ErrorMessage = "Вкажіть електронну пошту")]
    [EmailAddress(ErrorMessage = "Пошту вказано неправильно")]
    [DataType(DataType.EmailAddress)]
    public string Email { get; set; } = string.Empty;

    [Display(Name = "Фотка")]
    public IFormFile? Image { get; set; }

    [Display(Name = "Пароль")]
    [Required(ErrorMessage = "Вкажіть пароль")]
    [DataType(DataType.Password)]
    public string Password { get; set; } = string.Empty;

    [Display(Name = "Підтвердіть пароль")]
    [Required(ErrorMessage = "Напишіть пароль ще раз")]
    [DataType(DataType.Password)]
    [Compare("Password", ErrorMessage = "Паролі не співпадають")]
    public string ConfirmPassword { get; set; } = string.Empty;
}

using System.ComponentModel.DataAnnotations;

namespace WebProgram.Areas.Admin.Models.Users
{
    public class UserEditViewModel
    {
        [Required(ErrorMessage = "Будь ласка, введіть ім'я")]
        [Display(Name = "Ваше ім'я")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Будь ласка, введіть прізвище")]
        [Display(Name = "Ваше прізвище")]
        public string LastName { get; set; } = string.Empty;

        public string? ImageName { get; set; }
        public IFormFile? ImageFile { get; set; }

        [Required(ErrorMessage = "Будь ласка, введіть електронну пошту")]
        [Display(Name = "Електронна пошта")]
        public string Email { get; set; } = string.Empty;

        public List<string> Roles { get; set; } = new List<string>();
    }
}

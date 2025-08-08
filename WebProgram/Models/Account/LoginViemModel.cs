using Newtonsoft.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace WebProgram.Models.Account
{
    public class LoginViemModel
    {
        [Display(Name = "Електронна пошта")]
        [Required(ErrorMessage = "Поле {0} обов'язкове для заповнення")]
        [EmailAddress(ErrorMessage = "Поле {0} повинно містити коректну електронну пошту")]
        public string Email { get; set; } = string.Empty;
        [Display(Name = "Пароль")]
        [Required(ErrorMessage = "Поле {0} обов'язкове для заповнення")]
        public string Password { get; set; } = string.Empty;
    }
}

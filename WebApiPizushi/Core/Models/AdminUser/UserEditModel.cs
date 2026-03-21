using Microsoft.AspNetCore.Http;

namespace Core.Models.AdminUser;

public class UserEditModel
{
    public long Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    // IFormFile для отримання файлу з React (FormData)
    public IFormFile? Image { get; set; }
}

namespace WebProgram.Areas.Admin.Models.Users;

public class UserItemViewModel
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new List<string>();

}

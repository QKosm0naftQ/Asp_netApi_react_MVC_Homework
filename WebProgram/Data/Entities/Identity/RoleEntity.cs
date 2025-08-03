using Microsoft.AspNetCore.Identity;

namespace WebProgram.Data.Entities.Identity
{
    public class RoleEntity : IdentityRole<int>
    {
        public ICollection<UserRoleEntity>? UserRoles { get; set; }

    }
}

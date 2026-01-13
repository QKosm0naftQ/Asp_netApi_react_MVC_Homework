namespace Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
public class UserLoginEntity : IdentityUserLogin<long>{
    public UserEntity User { get; set; }// = new();
}
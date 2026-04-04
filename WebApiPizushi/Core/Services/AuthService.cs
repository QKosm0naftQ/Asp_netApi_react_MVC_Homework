using System.Security.Claims;
using Core.Interface;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace Core.Services;

public class AuthService(
    IHttpContextAccessor httpContextAccessor,
    UserManager<UserEntity> userManager
) : IAuthService
{
    public async Task<long> GetUserId()
    {
        // Шукаємо клейм саме по типу Email
        var email = httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Email);

        if (string.IsNullOrEmpty(email))
            throw new UnauthorizedAccessException("User is not authenticated");

        var user = await userManager.FindByEmailAsync(email);

        if (user == null)
            throw new Exception($"Користувача з поштою {email} не знайдено в базі");

        return user.Id;
    }
}


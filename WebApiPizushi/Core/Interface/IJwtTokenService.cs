using Domain.Entities.Identity;

namespace Core.Interface;

public interface IJwtTokenService
{
    Task<string> CreateTokenAsync(UserEntity user);
}
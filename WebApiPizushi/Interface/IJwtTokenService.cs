using WebApiPizushi.Data.Entities;

namespace WebApiPizushi.Interfaces;

public interface IJwtTokenService
{
    Task<string> CreateTokenAsync(UserEntity user);
}
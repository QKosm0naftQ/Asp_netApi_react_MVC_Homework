namespace Core.Interface;

public interface IAuthService
{
    Task<long> GetUserId();
}
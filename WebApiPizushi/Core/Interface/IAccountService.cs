namespace Core.Interface;

public interface IAccountService
{
    public Task<string> LoginByGoogle(string token);
}
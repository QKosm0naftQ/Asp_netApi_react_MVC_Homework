using Core.Models.Account;

namespace Core.Interface;

public interface IUserService
{
    Task<List<AdminUserItemModel>> GetAllUsersAsync();
}
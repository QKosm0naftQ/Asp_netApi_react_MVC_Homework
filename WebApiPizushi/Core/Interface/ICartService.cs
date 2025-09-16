using Core.Models.Cart;

namespace Core.Interface;

public interface ICartService
{
    Task CreateUpdate(CartCreateUpdateModel model);
    Task<List<CartItemModel>> GetCartItems();
}

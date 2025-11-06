using Core.Models.Order;

namespace Core.Interface;

public interface IOrderService
{
    Task<List<OrderModel>> GetOrdersAsync();
}
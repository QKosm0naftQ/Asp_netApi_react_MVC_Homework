using System.Diagnostics.Eventing.Reader;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.Interface;
using Core.Models.Cart;
using Domain;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Core.Services;

public class CartService(AppDbPizushiContext pizushiContext, 
    IAuthService authService, IMapper mapper) : ICartService
{
    public async Task CreateUpdate(CartCreateUpdateModel model)
    {
        var userId = await authService.GetUserId();
        var entity = pizushiContext.Carts
            .SingleOrDefault(x => x.UserId == userId && x.ProductId == model.ProductId);
        if (entity != null)
            entity.Quantity = model.Quantity;
        else
        {
            entity = new CartEntity
            {
                UserId = userId,
                ProductId = model.ProductId,
                Quantity = model.Quantity
            };
            pizushiContext.Carts.Add(entity);
        }
        await pizushiContext.SaveChangesAsync();
    }

    public async Task<List<CartItemModel>> GetCartItems()
    {
        var userId = await authService.GetUserId();

        var items = await pizushiContext.Carts
            .Where(x => x.UserId == userId)
            .ProjectTo<CartItemModel>(mapper.ConfigurationProvider)
            .ToListAsync();

        return items;
    }
    public async Task Delete(long id)
    {
        var userId = await authService.GetUserId();
        var item = await pizushiContext.Carts
            .SingleOrDefaultAsync(x => x.UserId == userId && x.ProductId == id);
        if (item != null)
        {
            pizushiContext.Carts.Remove(item);
            await pizushiContext.SaveChangesAsync();
        }
    }
}
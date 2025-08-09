using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.Interface;
using Core.Models.Product;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Core.Services;

public class ProductService(IMapper mapper, AppDbPizushiContext context) : IProductService
{
    public async Task<ProductItemModel> GetById(int id)
    {
        var model = await context.Products
            .Where(x => x.Id == id)
            .ProjectTo<ProductItemModel>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();

        return model;
    }

    public async Task<List<ProductItemModel>> GetBySlug(string slug)
    {
        var model = await context.Products
            .Where(x => x.Slug == slug)
            .ProjectTo<ProductItemModel>(mapper.ConfigurationProvider)
            .ToListAsync();

        return model;
    }

    public async Task<List<ProductItemModel>> List()
    {
        var model = await context.Products
            .ProjectTo<ProductItemModel>(mapper.ConfigurationProvider)
            .ToListAsync();

        return model;
    }
}
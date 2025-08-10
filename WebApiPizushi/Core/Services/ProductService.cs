using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.Interface;
using Core.Models.Product;
using Domain;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Core.Services;

public class ProductService(
    IMapper mapper,
    AppDbPizushiContext context,
    IImageService imageService) : IProductService{
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
    
    public async Task<ProductEntity> Create(ProductCreateModel model)
    {
        var entity = mapper.Map<ProductEntity>(model);
        context.Products.Add(entity);
        await context.SaveChangesAsync();
        foreach (var ingId in model.IngredientIds!)        {
            var productIngredient = new ProductIngredientEntity
            {
                ProductId = entity.Id,
                IngredientId = ingId
            };
            context.ProductIngredients.Add(productIngredient);
        }
        await context.SaveChangesAsync();


        for (short i = 0; i < model.ImageFiles!.Count; i++)
        {
            try
            {
                var productImage = new ProductImageEntity
                {
                    ProductId = entity.Id,
                    Name = await imageService.SaveImageAsync(model.ImageFiles[i]),
                    Priority = i
                };
                context.ProductImages.Add(productImage);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error Json Parse Data for PRODUCT IMAGE", ex.Message);
            }
        }
        await context.SaveChangesAsync();
        return entity;
    }
    public async Task<IEnumerable<ProductIngredientModel>> GetIngredientsAsync()
    {
        var ingredients = await context.Ingredients
            .ProjectTo<ProductIngredientModel>(mapper.ConfigurationProvider)
            .ToListAsync();
        return ingredients;
    }

    public async Task<IEnumerable<ProductSizeModel>> GetSizesAsync()
    {
        var sizes = await context.ProductSizes
            .ProjectTo<ProductSizeModel>(mapper.ConfigurationProvider)
            .ToListAsync();
        return sizes;
    }
}
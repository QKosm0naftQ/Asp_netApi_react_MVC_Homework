using Core.Models.Product;
using Domain.Entities;

namespace Core.Interface;

public interface IProductService
{
    Task<List<ProductItemModel>> List();
    Task<ProductItemModel> GetById(int id);
    Task<List<ProductItemModel>> GetBySlug(string slug);
    Task<ProductEntity> Create(ProductCreateModel model);
    public Task<IEnumerable<ProductIngredientModel>> GetIngredientsAsync();
    public Task<IEnumerable<ProductSizeModel>> GetSizesAsync();
}
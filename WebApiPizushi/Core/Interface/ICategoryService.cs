using Core.Models.Category;

namespace Core.Interface;

public interface ICategoryService
{
    Task<List<CategoryItemModel>> List();
    Task<CategoryItemModel?> GetItemById(int id);
    Task<CategoryItemModel> Create(CategoryCreateItemModel model);
    Task<CategoryItemModel> Update(CategoryEditItemModel model);
    Task<int> Delete(int id);
    //     Task Delete(long id);
}
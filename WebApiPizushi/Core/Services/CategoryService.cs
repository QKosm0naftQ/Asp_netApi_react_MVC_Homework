using AutoMapper;
using Core.Interface;
using Core.Models.Category;
using Domain;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Core.Services;

public class CategoryService(AppDbPizushiContext pizushiContext,
    IMapper mapper, IImageService imageService) : ICategoryService
{
    public async Task<CategoryItemModel> Create(CategoryCreateItemModel model)
    {
        var entity = mapper.Map<CategoryEntity>(model);
        entity.Image = await imageService.SaveImageAsync(model.Image!);
        await pizushiContext.Categories.AddAsync(entity);
        await pizushiContext.SaveChangesAsync();
        var item = mapper.Map<CategoryItemModel>(entity);
        return item;
    }

    public async Task<CategoryItemModel?> GetItemById(int id)
    {
        var model = await mapper
            .ProjectTo<CategoryItemModel>(pizushiContext.Categories.Where(x => x.Id == id))
            .SingleOrDefaultAsync();
        return model;
    }

    public async Task<List<CategoryItemModel>> List()
    {
        var model = await mapper.ProjectTo<CategoryItemModel>(pizushiContext.Categories)
            .ToListAsync();
        return model;
    }

    public async Task<CategoryItemModel> Update(CategoryEditItemModel model)
    {
        var existing = await pizushiContext.Categories.FirstOrDefaultAsync(x => x.Id == model.Id);

        existing = mapper.Map(model, existing);

        if (model.Image != null)
        {
            await imageService.DeleteImageAsync(existing.Image);
            existing.Image = await imageService.SaveImageAsync(model.Image);
        }
        await pizushiContext.SaveChangesAsync();

        var item = mapper.Map<CategoryItemModel>(existing);
        return item;
    }
    public async Task<int> Delete(int id)
    {
        try
        {
            var existing = await pizushiContext.Categories.FirstOrDefaultAsync(x => x.Id == id);
            if (existing == null)
                return -1;

            await imageService.DeleteImageAsync(existing.Image);
            pizushiContext.Categories.Remove(existing);
            await pizushiContext.SaveChangesAsync();

            return 1;
        }
        catch (Exception ex)
        {
            return 0;
        }
    }
    /*
      public async Task Delete(long id)
          {
              var entity = await pizushiContext.Categories.Where(x => x.Id == id)
                  .FirstOrDefaultAsync();
              entity!.IsDeleted = true;
              await pizushiContext.SaveChangesAsync();
          }     
     */
}
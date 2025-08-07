using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApiPizushi.Data;
using WebApiPizushi.Data.Entities;
using WebApiPizushi.Interfaces;
using WebApiPizushi.Models.Category;
using WebApiPizushi.Services;

namespace WebApiPizushi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController 
        (AppDbPizushiContext appDbPizushiContext ,IMapper mapper , IImageService imageService): ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<IActionResult> GetElement(int id)
        {
            var model = await appDbPizushiContext.Categories.SingleOrDefaultAsync(x => x.Id == id);
            if (model == null)
            {
                return NotFound();
            }
            return Ok(model);
        }
        [HttpGet]
        public async Task<IActionResult> List()
        {
            var model = await mapper.ProjectTo<CategoryItemModel>(appDbPizushiContext.Categories)
                .ToListAsync();
            return Ok(model);
        }
        [HttpPost]
        //[Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateCategory([FromForm] CategoryCreateItemModel model)
        {
            try
            {
                var entity = await appDbPizushiContext.Categories.SingleOrDefaultAsync(x => x.Name == model.Name);
                if (entity != null)
                {
                    return BadRequest("Така категорія вже існує!");
                }
                entity = mapper.Map<CategoryEntity>(model);
                entity.Image = await imageService.SaveImageAsync(model.Image);
                await appDbPizushiContext.Categories.AddAsync(entity);
                await appDbPizushiContext.SaveChangesAsync();
                return Ok("Успішно додана категорія");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditCategory(int id , [FromForm] CategoryCreateItemModel model)
        {
            try
            {
                var entity = await appDbPizushiContext.Categories.FirstOrDefaultAsync(x => x.Id == id);
                if (entity == null)
                    return NotFound();

                // Перевіряємо чи існує інша категорія з таким іменем
                var existingCategory = await appDbPizushiContext.Categories
                    .FirstOrDefaultAsync(x => x.Name == model.Name && x.Id != id);
                if (existingCategory != null)
                    return BadRequest("Така категорія вже існує!");

                if (model.Image != null && model.Image.Length > 0)
                {
                    // Видаляємо старе зображення
                    if (!string.IsNullOrEmpty(entity.Image))
                        await imageService.DeleteImageAsync(entity.Image);
            
                    entity.Image = await imageService.SaveImageAsync(model.Image);
                }

                entity.Name = model.Name;
                entity.Slug = model.Slug;

                await appDbPizushiContext.SaveChangesAsync();
                return Ok("Категорію успішно оновлено");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}

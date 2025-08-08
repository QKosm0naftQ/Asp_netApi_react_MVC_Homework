using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApiPizushi.Constants;
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
        [Authorize(Roles = $"{Roles.Admin}")]
        public async Task<IActionResult> GetElement(int id)
        {
            //var model = await appDbPizushiContext.Categories.SingleOrDefaultAsync(x => x.Id == id); 
            var model = await mapper
                        .ProjectTo<CategoryItemModel>(appDbPizushiContext.Categories.Where(x => x.Id == id))
                        .SingleOrDefaultAsync();
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
                //var entity = await appDbPizushiContext.Categories.SingleOrDefaultAsync(x => x.Name == model.Name);
                //if (entity != null)
                //{
                //    return BadRequest("Така категорія вже існує!");
                //}
                var entity = mapper.Map<CategoryEntity>(model);
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
        public async Task<IActionResult> EditCategory(int id , [FromForm] CategoryEditItemModel model)
        {
            try
            {
                var existing = await appDbPizushiContext.Categories.FirstOrDefaultAsync(x => x.Id == model.Id);
                if (existing == null)
                {
                    return NotFound();
                }

                existing = mapper.Map(model, existing);
                
                if (model.Image != null)
                {
                    await imageService.DeleteImageAsync(existing.Image);
                    existing.Image = await imageService.SaveImageAsync(model.Image);
                }
                await appDbPizushiContext.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                var existing = await appDbPizushiContext.Categories.FirstOrDefaultAsync(x => x.Id == id);
                if (existing == null)
                    return NotFound();

                await imageService.DeleteImageAsync(existing.Image);
                appDbPizushiContext.Categories.Remove(existing);
                await appDbPizushiContext.SaveChangesAsync();

                return Ok(new { message = "Категорію успішно видалено" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Сталася помилка при видаленні");
            }
        }

        
        
        
        
        
        
    }
}

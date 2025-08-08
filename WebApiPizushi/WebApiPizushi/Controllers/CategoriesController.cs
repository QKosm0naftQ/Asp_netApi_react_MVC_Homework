using AutoMapper;
using Core.Interface;
using Core.Models.Category;
using Domain;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApiPizushi.Constants;
using WebApiPizushi;


namespace WebApiPizushi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController 
        (ICategoryService categoryService): ControllerBase
    {
        [Authorize(Roles = $"{Roles.Admin}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetItemById(int id)
        {
            var model = await categoryService.GetItemById(id);
            if (model == null)
            {
                return NotFound();
            }
            return Ok(model);
        }
        [HttpGet]
        public async Task<IActionResult> List()
        {
            var model = await categoryService.List();
            return Ok(model);
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CategoryCreateItemModel model)
        {
            var category = await categoryService.Create(model);
            return Ok(category);
        }

        //public async Task<IActionResult> Update(int id , [FromForm] CategoryEditItemModel model)
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id ,[FromForm] CategoryEditItemModel model) ///////////////// Дописати і рішити з edit бо не загружається нічого на сайті  
        {
            // try
            // {
            //     var existing = await appDbPizushiContext.Categories.FirstOrDefaultAsync(x => x.Id == model.Id);
            //     if (existing == null)
            //     {
            //         return NotFound();
            //     }
            //
            //     existing = mapper.Map(model, existing);
            //     
            //     if (model.Image != null)
            //     {
            //         await imageService.DeleteImageAsync(existing.Image);
            //         existing.Image = await imageService.SaveImageAsync(model.Image);
            //     }
            //     await appDbPizushiContext.SaveChangesAsync();
            //
            //     return Ok();
            // }
            // catch (Exception ex)
            // {
            //     return BadRequest(ex.Message);
            // }
            var category = await categoryService.Update(model);

            return Ok(category);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await categoryService.Delete(id);
            if (deleted == 1)
            {
                return Ok(new { message = "Категорію успішно видалено" });
            }
            if(deleted == 0)
            {
                return StatusCode(500, "Сталася помилка при видаленні");
            }
            if (deleted == -1)
            {
                return NotFound();
            };
            return Ok(new { message = "Кінець операції - Видалення категорії" });
            // try
            // {
            //     var existing = await appDbPizushiContext.Categories.FirstOrDefaultAsync(x => x.Id == id);
            //     if (existing == null)
            //         return NotFound();
            //
            //     await imageService.DeleteImageAsync(existing.Image);
            //     appDbPizushiContext.Categories.Remove(existing);
            //     await appDbPizushiContext.SaveChangesAsync();
            //
            //     return Ok(new { message = "Категорію успішно видалено" });
            // }
            // catch (Exception ex)
            // {
            //     return StatusCode(500, "Сталася помилка при видаленні");
            // }
        }

        
        
        
        
        
        
    }
}

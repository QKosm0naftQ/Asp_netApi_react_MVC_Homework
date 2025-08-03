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
                if (model.Image == null || model.Image.Length == 0)
                {
                    return BadRequest("Погане фото/bad");
                }
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


    }
}

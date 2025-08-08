using System.Security.Cryptography;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;
using WebProgram.Constants;
using WebProgram.Data;
using WebProgram.Data.Entities;
using WebProgram.Interface;
using WebProgram.Models.Category;

namespace WebProgram.Controllers;

public class CategoriesController(AppProgramDbContext context, 
    IMapper mapper, IImageService imageService) : Controller
{

    public IActionResult Index() //Це будь-який web результат - View - сторінка, Файл, PDF, Excel
    {
        ViewBag.Title = "Категорії";
        var model = mapper.ProjectTo<CategoryItemViewModel>(context.Categories).ToList();
        return View(model);
    }

    [HttpGet] //Тепер він працює методом GET - це щоб побачити форму
    public IActionResult Create()
    {
        return View();
    }

    [HttpPost] //Тепер він працює методом GET - це щоб побачити форму
    public async Task<IActionResult> Create(CategoryCreateViewModel model)
    {
        var entity = await context.Categories.SingleOrDefaultAsync(x => x.Name == model.Name);
        if (entity != null) 
        {
            ModelState.AddModelError("Name", "Така категорія уже є!!!");
            return View(model);
        }

        entity = mapper.Map<CategoryEntity>(model);
        entity.ImageUrl = await imageService.SaveImageAsync(model.ImageFile);
        await context.Categories.AddAsync(entity);
        await context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [Authorize(Roles = $"{Roles.Admin}")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await context.Categories.SingleOrDefaultAsync(x=>x.Id==id);
        if (category == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrEmpty(category.ImageUrl))
        {
            await imageService.DeleteImageAsync(category.ImageUrl);
        }

        context.Categories.Remove(category);
        await context.SaveChangesAsync();

        return RedirectToAction(nameof(Index));
    }

    [HttpGet] //Тепер він працює методом GET - це щоб побачити форму
    public async Task<IActionResult> Edit(int id)
    {
        var category = await context.Categories.FindAsync(id);
        if (category == null)
        {
            return NotFound();
        }
        //Динамічна колекція, яка збергає динамічні дані, які можна вкиористати на View
        ViewBag.ImageName = category.ImageUrl;

        //TempData["ImageUrl"] = category.ImageUrl;

        var model = mapper.Map<CategoryEditViewModel>(category);
        return View(model);
    }

    [HttpPost] //Тепер він працює методом GET - це щоб побачити форму
    public async Task<IActionResult> Edit(CategoryEditViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return View(model);
        }

        var existing = await context.Categories.FirstOrDefaultAsync(x => x.Id == model.Id);
        if (existing == null)
        {
            return NotFound();
        }

        var duplicate = await context.Categories
            .FirstOrDefaultAsync(x => x.Name == model.Name && x.Id != model.Id);
        if (duplicate != null)
        {
            ModelState.AddModelError("Name", "Another category with this name already exists");
            return View(model);
        }

        existing = mapper.Map(model, existing);

        if (model.ImageFile != null)
        {
            await imageService.DeleteImageAsync(existing.ImageUrl);
            existing.ImageUrl = await imageService.SaveImageAsync(model.ImageFile);
        }
        await context.SaveChangesAsync();

        return RedirectToAction(nameof(Index));
    }
}

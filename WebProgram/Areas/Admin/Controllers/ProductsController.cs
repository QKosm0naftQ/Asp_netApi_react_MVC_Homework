using System.Text.RegularExpressions;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebProgram.Areas.Admin.Models.Product;
using WebProgram.Constants;
using WebProgram.Data;
using WebProgram.Data.Entities;
using WebProgram.Interface;
using WebProgram.Models.Product;
using ProductItemViewModel = WebProgram.Models.Product.ProductItemViewModel;

namespace WebProgram.Areas.Admin.Controllers;

[Area("Admin")] 
[Authorize(Roles = Roles.Admin)]
public class ProductsController(AppProgramDbContext context,
    IMapper mapper, IImageService imageService , IConfiguration configuration) : Controller
{
    private static List<string> ExtractImageSrc(string html)
    {
        var imgRegex = new Regex(@"<img[^>]*src\s*=\s*""([^""]*)""[^>]*>");
        return imgRegex.Matches(html)
            .Select(m => m.Groups[1].Value)
            .ToList();
    }
    public IActionResult Index()
    {
        ViewBag.Title = "Продукти";
        var model = mapper.ProjectTo<ProductItemViewModel>(context.Products).ToList();
        return View(model);
    }

    [HttpGet]
    public IActionResult Create()
    {
        ViewBag.Title = "Створити продукт";
        ViewBag.Categories = context.Categories.ToList();
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProductViewModel model)
    {
        var existingProduct = await context.Products.SingleOrDefaultAsync(x => x.Name == model.Name);

        if (existingProduct != null)
        {
            ModelState.AddModelError("Name", "Такий продукт вже є!!!");
            return View(model);
        }
        //----------------------
        // Process TinyMCE content
        var newHtml = model.Description;
        newHtml = Regex.Replace(newHtml,
            @"https?://[^""]+/images/100_([^"" ]+)",
            "/images/$1", RegexOptions.IgnoreCase);

        var imgSrcs = ExtractImageSrc(newHtml);

        var productEntity = mapper.Map<ProductEntity>(model);
        
        var descriptionImages = imgSrcs.Select(src =>
        {
            var fileName = Path.GetFileName(src);
            return new ProductDescriptionImageEntity
            {
                Name = fileName,
                Product = productEntity
            };
        }).ToList();

        newHtml = Regex.Replace(newHtml, @"/images/([^""\s]+)", "/images/100_$1");
        productEntity.Description = newHtml;
        productEntity.DescriptionImages = descriptionImages;
        //----------------------
        productEntity.Category = await context.Categories
            .SingleOrDefaultAsync(x => x.Name == model.CategoryName);

        var savedImages = await Task.WhenAll(
            model.Images.Select(async image => new ProductImageEntity
            {
                Name = await imageService.SaveImageFromBase64Async(image.Name),
                Priotity = image.Priority
            })
        );

        productEntity.ProductImages = savedImages.ToList();

        context.Products.Add(productEntity);
        await context.SaveChangesAsync();

        return RedirectToAction(nameof(Index));
    }
    [HttpPost]
    public async Task<IActionResult> UploadDescriptionImage(IFormFile file)
    {
        try
        {
            var fileName = await imageService.SaveImageAsync(file);
            return Json(new { location = $"/{configuration["ImagesDir"]}/100_{fileName}" });
        }
        catch (Exception ex)
        {
            return Json(new { error = ex.Message });
        }
    }
    [HttpPost]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await context.Products
            .Include(p => p.ProductImages)
            .Include(p => p.DescriptionImages)
            .FirstOrDefaultAsync(p => p.Id == id);
        
        if (product == null)
            return NotFound();
        
        // Видаляємо файли зображень
        foreach (var image in product.ProductImages)
        {
            await imageService.DeleteImageAsync(image.Name);
        }
    
        foreach (var image in product.DescriptionImages)
        {
            await imageService.DeleteImageAsync(image.Name);
        }
    
        // Видаляємо записи з бази даних
        context.Products.Remove(product);
        await context.SaveChangesAsync();
    
        return RedirectToAction(nameof(Index));
    }

}
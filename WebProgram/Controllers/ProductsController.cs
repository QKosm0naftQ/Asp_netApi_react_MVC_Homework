using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebProgram.Data;
using WebProgram.Models.Helpers;
using WebProgram.Models.Product;

namespace WebProgram.Controllers;

public class ProductsController(AppProgramDbContext context, 
    IMapper mapper) : Controller
{
    // GET
    [HttpGet]
    public async Task<IActionResult> Index(ProductSearchViewModel searchModel){
        ViewBag.Title = "Продукти";
        // Завантажуємо категорії
        searchModel.Categories = await mapper.ProjectTo<SelectItemViewModel>(context.Categories)
            .ToListAsync();

        searchModel.Categories.Insert(0, new SelectItemViewModel
        {
            Id = 0,
            Name = "Оберіть категорію"
        });
        // Фільтрація
        var query = context.Products.AsQueryable();
        
        if(!string.IsNullOrEmpty(searchModel.Name))
        {
            string textSearch = searchModel.Name.Trim();
            query = query.Where(p => p.Name.ToLower().Contains(textSearch.ToLower()));
        }

        if (searchModel.CategoryId != 0)
            query = query.Where(p => p.CategoryId==searchModel.CategoryId);

        if (!string.IsNullOrEmpty(searchModel.Description))
        {
            string textSearch = searchModel.Description.Trim();
            query = query.Where(p => p.Description.ToLower().Contains(textSearch.ToLower()));
        }
        // Загальна кількість елементів (для пагінації)
        int totalCount = await query.CountAsync();
        
        // Валідація сторінки (щоб не вилізти за межі)
        int totalPages = (int)Math.Ceiling(totalCount / (double)searchModel.PageSize);
        if (searchModel.Page < 1)
            searchModel.Page = 1;
        else if (searchModel.Page > totalPages)
            searchModel.Page = totalPages;

        // Пагінація
        var products = await query
            .OrderBy(p => p.Id) // Можна змінити сортування
            .Skip((searchModel.Page - 1) * searchModel.PageSize)
            .Take(searchModel.PageSize)
            .ProjectTo<ProductItemViewModel>(mapper.ConfigurationProvider)
            .ToListAsync();

        // Формуємо модель
        var model = new ProductListViewModel
        {
            Count = totalCount,
            Products = products,
            Search = searchModel
        };

        return View(model);
    }
}
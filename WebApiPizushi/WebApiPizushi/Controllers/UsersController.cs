using System.Diagnostics;
using Core.Interface;
using Core.Models;
using Core.Models.AdminUser;
using Core.Models.Search.Params;
using Core.Models.Seeder;
using Microsoft.AspNetCore.Mvc;

namespace WebApiPizushi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController(IUserService userService) : Controller
{
    [HttpGet("list")]
    public async Task<IActionResult> GetAllUsers()
    {
        var model = await userService.GetAllUsersAsync();

        return Ok(model);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchUsers([FromQuery] UserSearchModel model)
    {
        Stopwatch stopWatch = new Stopwatch();
        stopWatch.Start();
        var result = await userService.SearchUsersAsync(model);
        stopWatch.Stop();
        // Get the elapsed time as a TimeSpan value.
        TimeSpan ts = stopWatch.Elapsed;

        // Format and display the TimeSpan value.
        string elapsedTime = String.Format(
            "{0:00}:{1:00}:{2:00}.{3:00}",
            ts.Hours,
            ts.Minutes,
            ts.Seconds,
            ts.Milliseconds / 10
        );
        Console.WriteLine("-----------Elapsed Time------------: " + elapsedTime);
        return Ok(result);
    }

    [HttpGet("seed")]
    public async Task<IActionResult> SeedUsers([FromQuery] SeedItemsModel model)
    {
        var result = await userService.SeedAsync(model);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(long id)
    {
        var user = await userService.GetByIdAsync(id);
        if (user == null)
            return NotFound(new { message = "Користувача не знайдено" });
        return Ok(user);
    }

    // 2. Додаємо метод редагування (приймає FormData з фото)
    [HttpPost("edit")]
    public async Task<IActionResult> Edit([FromForm] UserEditModel model)
    {
        // Тут логіка сервісу, яка оновить ПІБ та замінить фото
        var result = await userService.UpdateUserAsync(model);

        if (!result.IsSuccess)
            return BadRequest(result.Message);

        return Ok(result);
    }
}


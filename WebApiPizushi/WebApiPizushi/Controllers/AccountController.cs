using AutoMapper;
using Core.Interface;
using Core.Models.Account;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebApiPizushi.Constants;


namespace WebApiPizushi.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class AccountController(
    IJwtTokenService jwtTokenService,
    IMapper mapper, 
    IImageService imageService,
    UserManager<UserEntity> userManager,
    IAccountService accountService
    ) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var user = await userManager.FindByEmailAsync(model.Email);
        if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
        {
            var token = await jwtTokenService.CreateTokenAsync(user);
            return Ok(new { Token = token });
        }
        return Unauthorized("Invalid email or password");
    }
    
    
    [HttpPost]
    public async Task<IActionResult> Register([FromForm] RegisterModel model)
    {
        var user = mapper.Map<UserEntity>(model);

        user.Image = await imageService.SaveImageAsync(model.ImageFile!);

        var result = await userManager.CreateAsync(user, model.Password);
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(user, Roles.User);
            var token = await jwtTokenService.CreateTokenAsync(user);
            return Ok(new
            {
                Token = token
            });
        }
        else
        {
            return BadRequest(new
            {
                status = 400,
                isValid = false,
                errors = "Registration failed"
            });
        }
    }
    
    
    [HttpPost]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequestModel model)
    {
        string result = await accountService.LoginByGoogle(model.Token);
        if (string.IsNullOrEmpty(result))
        {
            return BadRequest(new
            {
                Status = 400,
                IsValid = false,
                Errors = new { Email = "Помилка реєстрації" }
            });
        }
        return Ok(new
        {
            Token = result
        });
    }
}
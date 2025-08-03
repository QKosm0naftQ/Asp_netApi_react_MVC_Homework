using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebProgram.Data.Entities.Identity;
using WebProgram.Interface;
using WebProgram.Models.Account;
using WebProgram.Service;
using WebProgram.SMTP;

namespace WebProgram.Controllers
{
    public class AccountController(UserManager<UserEntity> userManager, 
        SignInManager<UserEntity> signInManager,
        IImageService imageService,
        ISMTPService sMTPService,
        IMapper mapper) : Controller
    {
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginViemModel model)
        {
            if(!ModelState.IsValid) 
                return View(model);
            
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user!=null)
            {
                var res = await signInManager.PasswordSignInAsync(user, model.Password, false, false);
                if (res.Succeeded)
                {
                    await signInManager.SignInAsync(user, isPersistent: false);
                    return Redirect("/");
                }
                
            }
            ModelState.AddModelError("", "Дані вказано не вірно!");
            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await signInManager.SignOutAsync();
            return Redirect("/");
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }


        [HttpPost]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            var user = mapper.Map<UserEntity>(model);
            user.Image = await imageService.SaveImageAsync(model.Image) ?? null;

            var res = await userManager.CreateAsync(user, model.Password);
            if (res.Succeeded)
            {
                await signInManager.SignInAsync(user, isPersistent: false);
                return Redirect("/");
            }
            foreach (var error in res.Errors)
            {
                ModelState.AddModelError("", error.Description);
            }
            return View(model);
        }
        
        
        
        [HttpGet]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var user = await userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                ModelState.AddModelError("", "Користувача по даній пошті не існує!");
                return View(model);
            }

            var token = await userManager.GeneratePasswordResetTokenAsync(user);

            var resetUrl = Url.Action(
                "ResetPassword",                  // Назва дії
                "Account",                        // Назва контролера
                new { email = user.Email, token },// Параметри GET
                protocol: Request.Scheme);       // http або https

            Message msgEmail = new Message
            {
                Body = $"Для скидання паролю перейдіть за посиланням: <a href='{resetUrl}'>скинути пароль</a>",
                Subject = $"Скидання паролю",
                To = model.Email
            };

            var result = await sMTPService.SendMessageAsync(msgEmail);

            if (!result)
            {
                ModelState.AddModelError("", "Помилка надсилання листа. Зверністься у підтримку!");
                return View(model);
            }

            return RedirectToAction(nameof(ForgotPasswordSend));
        }

        //Відовлення паролю. Надіслали лист
        [HttpGet]
        public IActionResult ForgotPasswordSend()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> ResetPassword(string email, string token)
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);
            var result = await userManager.ResetPasswordAsync(user, model.Token, model.ConfirmPassword);
            return Redirect("/");
        }
    }
}

using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebProgram.Data.Entities.Identity;
using WebProgram.Models.Account;

namespace WebProgram.ViewComponents
{
    public class UserLinkViewComponent(UserManager<UserEntity> userManager,
        IMapper mapper) 
        : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            var userName = User.Identity?.Name;
            var model = new UserLinkViewModel();

            if (userName != null)
            {
                var user = userManager.FindByNameAsync(userName).Result;
                model = mapper.Map<UserLinkViewModel>(user);
            }
            return View(model);
        }
    }
}

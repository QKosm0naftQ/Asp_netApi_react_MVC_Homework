using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebProgram.Data.Entities.Identity;
using WebProgram.Areas.Admin.Models.Users;
using Microsoft.AspNetCore.Mvc.Rendering;
using WebProgram.Service;
using WebProgram.Interface;

namespace WebProgram.Areas.Admin.Controllers;

[Area("Admin")]
public class UsersController(UserManager<UserEntity> userManager, RoleManager<RoleEntity> roleManager,
    IMapper mapper , IImageService imageService) : Controller
{
    public async Task<IActionResult> Index()
    {
        var model = await userManager.Users
            .ProjectTo<UserItemViewModel>(mapper.ConfigurationProvider)
            .ToListAsync();

        model.ForEach(user =>
        {
            user.Roles = userManager.GetRolesAsync((userManager.FindByEmailAsync(user.Email).Result)).Result.ToList();
        });

        model = model.OrderBy(m => m.Id).ToList();

        return View(model);
    }

    [HttpGet]
    public async Task<IActionResult> Edit(int id)
    {
        var user = await userManager.FindByIdAsync(id.ToString());
        if (user == null)
        {
            return NotFound();
        }

        var model = mapper.Map<UserEditViewModel>(user);
        model.Roles = (await userManager.GetRolesAsync(user)).ToList();
        //
        var allRoles = roleManager.Roles.Select(r => r.Name).ToList();
        ViewBag.AvailableRoles = new SelectList(allRoles);
        ViewBag.SelectedRole = model.Roles.FirstOrDefault(); 

        return View(model);
    }
    [HttpPost]
    public async Task<IActionResult> Edit(UserEditViewModel model)
    {
        if (!ModelState.IsValid)
            return View(model);

        var user = await userManager.FindByEmailAsync(model.Email);
        if (user == null)
            return NotFound();

        var currentRoles = await userManager.GetRolesAsync(user);

        mapper.Map(model, user);

        if (model.ImageFile != null && !string.IsNullOrEmpty(model.ImageFile.FileName) &&
            !model.ImageFile.FileName.Equals(model.ImageName, StringComparison.OrdinalIgnoreCase))
        {
            user.Image = await imageService.SaveImageAsync(model.ImageFile);
        }

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
                ModelState.AddModelError(string.Empty, error.Description);

            return View(model);
        }
        var selectedRole = model.Roles.FirstOrDefault();
        if (currentRoles.Any())
            await userManager.RemoveFromRolesAsync(user, currentRoles);
        if (!string.IsNullOrEmpty(selectedRole))
            await userManager.AddToRoleAsync(user, selectedRole);

        return RedirectToAction("Index");
    }




}

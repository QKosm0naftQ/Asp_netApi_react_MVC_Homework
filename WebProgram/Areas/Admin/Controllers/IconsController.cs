using Microsoft.AspNetCore.Mvc;

namespace WebProgram.Areas.Admin.Controllers;

[Area("Admin")]
public class IconsController : Controller
{
  public IActionResult RiIcons() => View();
}

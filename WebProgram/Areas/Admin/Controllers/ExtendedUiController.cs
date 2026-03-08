using Microsoft.AspNetCore.Mvc;

namespace WebProgram.Areas.Admin.Controllers;

[Area("Admin")]
public class ExtendedUiController : Controller
{
  public IActionResult PerfectScrollbar() => View();
  public IActionResult TextDivider() => View();
}

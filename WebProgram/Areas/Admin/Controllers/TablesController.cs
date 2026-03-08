using Microsoft.AspNetCore.Mvc;

namespace WebProgram.Areas.Admin.Controllers;

[Area("Admin")]
public class TablesController : Controller
{
  public IActionResult Basic() => View();
}

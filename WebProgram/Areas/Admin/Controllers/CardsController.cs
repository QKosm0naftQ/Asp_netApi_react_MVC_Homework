using Microsoft.AspNetCore.Mvc;

namespace WebProgram.Areas.Admin.Controllers;

[Area("Admin")]
public class CardsController : Controller
{
  public IActionResult Basic() => View();
}

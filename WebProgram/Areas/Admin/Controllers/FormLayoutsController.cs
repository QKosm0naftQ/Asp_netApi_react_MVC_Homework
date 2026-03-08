using Microsoft.AspNetCore.Mvc;

namespace WebProgram.Areas.Admin.Controllers;

[Area("Admin")]
public class FormLayoutsController : Controller
{
public IActionResult Horizontal() => View();
public IActionResult Vertical() => View();
}

using Microsoft.AspNetCore.Mvc;

namespace WebProgram.Areas.Admin.Controllers;

[Area("Admin")]
public class DashboardsController : Controller
{
  public IActionResult Index() => View();
}

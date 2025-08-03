using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.FileProviders.Physical;  
using WebProgram.Data;
using WebProgram.Data.Entities.Identity;
using WebProgram.Interface;
using WebProgram.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppProgramDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

//Додаємо налаштування для UserManager і RoleManager і SigninManager - займається cookies
builder.Services.AddIdentity<UserEntity, RoleEntity>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 1;
})
    .AddEntityFrameworkStores<AppProgramDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<ISMTPService, SMTPService>();
//у нас будуть View - це такі сторінки - де можна писати на C# Index.cshtml
//Велика перевага цих сторінок у тому, що вони перевіряються на c# і компілюються у збірку
//WebSmoder.dll - вихідний файл проекту.
//контролер - це клас на C#, який приймає запити від клієнта і виконує усію логіку роботи.
//Результати роботи (Model) контролера передають на View для відображення
builder.Services.AddControllersWithViews(); //Налаштування контейнерів, сервісів. Репозиторій.

var app = builder.Build();   //Створється збірка на основі даних налаштувать вище

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error"); //якщо виника помилка, то нас кидає на сторінку /Home/Error
}
app.UseRouting(); //Підтримка маршрутизаці - це коли ми можемо писатив в url localhost:2345/login

app.UseAuthorization();  //Підтримка авторизації - це будемо вивчали коли перейдемо до Identity

app.MapStaticAssets();  //Використання статичних файлі, тобто у нас буде працювати папка wwwroot

//Нашатування для маршрутів. У нас є контролери - Вони мають називатися HomeController
//При цьому враховується лише Home. Методи цього класу називаються Action - тобто обробники
//Для того, щоб при запуску сайту ми бачили, щось визивається згідного налаштувань HomeController
//і його метод Index при цьому може бути параметер у маршруті id - але там є знак питання, тобто
//може бути null
app.UseEndpoints(endpoints =>
{
    endpoints.MapAreaControllerRoute(
      name: "admin_area",
      areaName: "Admin",
      pattern: "admin/{controller=Users}/{action=Index}/{id?}"
    );
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller=Categories}/{action=Index}/{id?}"
    );
});

var dir = builder.Configuration["ImagesDir"];
string path = Path.Combine(Directory.GetCurrentDirectory(), dir);
Directory.CreateDirectory(path);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(path),
    RequestPath = $"/{dir}"
});

await app.SeedData();

app.Run(); //Запускає наш хост (Сервер) і ми бачимо консоль

// тут код писати не можна він працювати не буде 😒😒😒

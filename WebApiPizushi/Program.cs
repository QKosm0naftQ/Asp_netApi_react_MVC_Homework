using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using Microsoft.Extensions.FileProviders;
using WebApiPizushi.Data;
using WebApiPizushi.Filters;
using WebApiPizushi.Interfaces;
using WebApiPizushi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<AppDbPizushiContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IImageService,ImageService>();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

builder.Services.AddValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddMvc(options =>
{
    options.Filters.Add<ValidationFilter>();
});

builder.Services.AddSwaggerGen();

builder.Services.AddCors();

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseCors(x => x.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()); 

app.UseSwagger();

app.UseSwaggerUI();


app.UseAuthorization();

app.MapControllers();


var dir = builder.Configuration["ImagesDir"];
string path = Path.Combine(Directory.GetCurrentDirectory(), dir);
Directory.CreateDirectory(path);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(path),
    RequestPath = $"/{dir}"
});

await app.SeedData();
app.Run();

using System.Text.Json;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebProgram.Constants;
using WebProgram.Data.Entities;
using WebProgram.Data.Entities.Identity;
using WebProgram.Models.Seeder;
using WebProgram.Interface;
using WebProgram.SMTP;

namespace WebProgram.Data
{
    public static class DbSeeder
    {
        public static async Task SeedData(this WebApplication webApplication)
        {
            using var scope = webApplication.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppProgramDbContext>();
            
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<UserEntity>>();

            var mapper = scope.ServiceProvider.GetRequiredService<IMapper>();
            var smtpService = scope.ServiceProvider.GetRequiredService<ISMTPService>();
            
            context.Database.Migrate();

            if (!context.Categories.Any()) 
            {
                var imageService = scope.ServiceProvider.GetRequiredService<IImageService>();
                var jsonFile = Path.Combine(Directory.GetCurrentDirectory(), "Helpers", "JsonData", "CategoriesJson.json");
                if (File.Exists(jsonFile))
                {
                    var jsonData = await File.ReadAllTextAsync(jsonFile);
                    try
                    {
                        var categories = JsonSerializer.Deserialize<List<SeederCategoryModel>>(jsonData);
                        var categoryEntities = mapper.Map<List<CategoryEntity>>(categories);
                        foreach (var categoryEntity in categoryEntities)
                        {
                            categoryEntity.ImageUrl = 
                                await imageService.SaveImageFromUrlAsync(categoryEntity.ImageUrl);
                        }

                        await context.AddRangeAsync(categoryEntities);
                        await context.SaveChangesAsync();

                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Error Json Parse Data {0}", ex.Message);
                    }
                }
                else 
                {
                    Console.WriteLine("Not Found File Categories.json");
                }
            }

            if (!context.Products.Any())
            {
                var imageService = scope.ServiceProvider.GetRequiredService<IImageService>();
                var jsonFile = Path.Combine(Directory.GetCurrentDirectory(), "Helpers", "JsonData", "Products.json");

                if (File.Exists(jsonFile))
                {
                    var jsonData = await File.ReadAllTextAsync(jsonFile);
                    try
                    {
                        var products = JsonSerializer.Deserialize<List<SeederProductModel>>(jsonData);

                        foreach (var product in products)
                        {
                            // Знайти відповідну категорію
                            var category = await context.Categories
                                .FirstOrDefaultAsync(c => c.Name == product.CategoryName);

                            if (category == null)
                            {
                                Console.WriteLine($"Category '{product.CategoryName}' not found for product '{product.Name}'");
                                continue;
                            }

                            var productEntity = new ProductEntity
                            {
                                Name = product.Name,
                                Description = product.Description,
                                CategoryId = category.Id,
                                ProductImages = new List<ProductImageEntity>()
                            };

                            int priority = 0;
                            try
                            {
                                foreach (var imageUrl in product.Images)
                                {
                                    var savedImageUrl = await imageService.SaveImageFromUrlAsync(imageUrl);
                                    productEntity.ProductImages.Add(new ProductImageEntity
                                    {
                                        Name = savedImageUrl,
                                        Priotity = priority++
                                    });
                                }
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine("-----Error Add {0}------", ex.Message);
                                continue;
                            }

                            await context.Products.AddAsync(productEntity);
                        }

                        await context.SaveChangesAsync();
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Error Json Parse Product Data: {0}", ex.Message);
                    }
                }
                else
                {
                    Console.WriteLine("Products.json file not found");
                }
            }


            if (!context.Roles.Any())
            {
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<RoleEntity>>();
                var admin = new RoleEntity { Name = Roles.Admin };
                var result = await roleManager.CreateAsync(admin);
                if (result.Succeeded) 
                {
                    Console.WriteLine($"Роль {Roles.Admin} створено успішно");
                }
                else
                {
                    Console.WriteLine($"Помилка створення ролі:");
                    foreach (var error in result.Errors)
                    {
                        Console.WriteLine($"- {error.Code}: {error.Description}");
                    }
                }

                var user = new RoleEntity { Name = Roles.User };
                result = await roleManager.CreateAsync(user);
                if (result.Succeeded)
                {
                    Console.WriteLine($"Роль {Roles.User} створено успішно");
                }
                else
                {
                    Console.WriteLine($"Помилка створення ролі:");
                    foreach (var error in result.Errors)
                    {
                        Console.WriteLine($"- {error.Code}: {error.Description}");
                    }
                }

            }

            if (!context.Users.Any())
            {
                string email = "admin@gmail.com";
                var user = new UserEntity
                {
                    UserName = email,
                    Email = email,
                    LastName = "Марко",
                    FirstName = "Онутрій"
                };

                var result = await userManager.CreateAsync(user, "123456");
                if (result.Succeeded)
                {
                    Console.WriteLine($"Користувача успішно створено {user.LastName} {user.FirstName}!");
                    await userManager.AddToRoleAsync(user, Roles.Admin);
                }
                else
                {
                    Console.WriteLine($"Помилка створення користувача:");
                    foreach (var error in result.Errors)
                    {
                        Console.WriteLine($"- {error.Code}: {error.Description}");
                    }
                }
            }
            /*
            webApplication.Use(async (context, next) =>
            {
                var host = context.Request.Host.Host;
                Message msgEmail = new Message
                {
                    Body = $"Додаток успішно запущено {DateTime.Now}",
                    Subject = $"Запуск сайту {host}",
                    To="kostya190807@gmail.com"
                };
                await smtpService.SendMessage(msgEmail);
                Console.WriteLine($"---------{host}----------");
                await next.Invoke();
            });
            */
        }
    }
}

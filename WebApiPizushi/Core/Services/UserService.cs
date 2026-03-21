using System.Diagnostics;
using System.Text.Json;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Bogus;
using Core.Constants;
using Core.Interface;
using Core.Models;
using Core.Models.AdminUser;
using Core.Models.Search;
using Core.Models.Search.Params;
using Core.Models.Seeder;
using Domain;
using Domain.Entities.Identity;
using MailKit;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using static Bogus.DataSets.Name;

namespace Core.Services;

public class UserService(
    UserManager<UserEntity> userManager,
    IMapper mapper,
    IImageService imageService,
    RoleManager<RoleEntity> roleManager,
    AppDbPizushiContext context
) : IUserService
{
    public async Task<AdminUserItemModel> GetByIdAsync(long id)
    {
        // Отримуємо базові дані через AutoMapper
        var user = await userManager
            .Users.Where(u => u.Id == id)
            .ProjectTo<AdminUserItemModel>(mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

        if (user == null)
            return null;

        // Довантажуємо типи логінів (Google, Facebook тощо)
        var logins = await context
            .UserLogins.Where(l => l.UserId == id)
            .Select(l => l.LoginProvider)
            .ToListAsync();

        user.LoginTypes.AddRange(logins);

        // Перевіряємо наявність пароля (як у вашому списку)
        var entity = await userManager.FindByIdAsync(id.ToString());
        if (entity != null && !string.IsNullOrEmpty(entity.PasswordHash))
        {
            if (!user.LoginTypes.Contains("Password"))
                user.LoginTypes.Add("Password");

            user.IsLoginPassword = true;
        }

        user.IsLoginGoogle = user.LoginTypes.Contains("Google");

        return user;
    }

    public async Task<List<AdminUserItemModel>> GetAllUsersAsync()
    {
        var users = await userManager
            .Users.ProjectTo<AdminUserItemModel>(mapper.ConfigurationProvider)
            .ToListAsync();

        await context.UserLogins.ForEachAsync(login =>
        {
            var user = users.FirstOrDefault(u => u.Id == login.UserId);
            if (user != null)
            {
                user.LoginTypes.Add(login.LoginProvider);
            }
        });

        await context.Users.ForEachAsync(user =>
        {
            var adminUser = users.FirstOrDefault(u => u.Id == user.Id);
            if (adminUser != null)
            {
                if (!string.IsNullOrEmpty(user.PasswordHash))
                {
                    adminUser.LoginTypes.Add("Password");
                }
            }
        });

        return users;
    }

    public async Task<SearchResult<AdminUserItemModel>> SearchUsersAsync(UserSearchModel model)
    {
        var query = userManager.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(model.Name))
        {
            string nameFilter = model.Name.Trim().ToLower().Normalize();

            query = query.Where(u =>
                (u.FirstName + " " + u.LastName).ToLower().Contains(nameFilter)
                || u.FirstName.ToLower().Contains(nameFilter)
                || u.LastName.ToLower().Contains(nameFilter)
            );
        }

        if (model?.StartDate != null)
        {
            query = query.Where(u => u.DateCreated >= model.StartDate);
        }

        if (model?.EndDate != null)
        {
            query = query.Where(u => u.DateCreated <= model.EndDate);
        }

        if (model.Roles != null && model.Roles.Any())
        {
            var roles = model.Roles.Where(x => !string.IsNullOrEmpty(x));
            if (roles.Count() > 0)
                query = query.Where(user =>
                    roles.Any(role => user.UserRoles.Select(x => x.Role.Name).Contains(role))
                );
        }

        var totalCount = await query.CountAsync();

        var safeItemsPerPage = model.ItemPerPAge < 1 ? 10 : model.ItemPerPAge;
        var totalPages = (int)Math.Ceiling(totalCount / (double)safeItemsPerPage);
        var safePage = Math.Min(Math.Max(1, model.Page), Math.Max(1, totalPages));

        var users = await query
            .OrderBy(u => u.Id)
            .Skip((safePage - 1) * safeItemsPerPage)
            .Take(safeItemsPerPage)
            .ProjectTo<AdminUserItemModel>(mapper.ConfigurationProvider)
            .ToListAsync();

        //await LoadLoginsAndRolesAsync(users);

        return new SearchResult<AdminUserItemModel>
        {
            Items = users,
            Pagination = new PaginationModel
            {
                TotalCount = totalCount,
                TotalPages = totalPages,
                ItemsPerPage = safeItemsPerPage,
                CurrentPage = safePage,
            },
        };
    }

    public async Task<string> SeedAsync(SeedItemsModel model)
    {
        Stopwatch stopWatch = new Stopwatch();
        stopWatch.Start();
        var fakeUsers = new Faker<SeederUserModel>("uk")
            .RuleFor(u => u.Gender, f => f.PickRandom<Gender>())
            //Pick some fruit from a basket
            .RuleFor(u => u.FirstName, (f, u) => f.Name.FirstName(u.Gender))
            .RuleFor(u => u.LastName, (f, u) => f.Name.LastName(u.Gender))
            .RuleFor(u => u.Email, (f, u) => f.Internet.Email(u.FirstName, u.LastName))
            .RuleFor(u => u.Password, (f, u) => f.Internet.Password(8))
            .RuleFor(
                u => u.Roles,
                f => new List<string>() { f.PickRandom(Constants.Roles.AllRoles) }
            )
            .RuleFor(u => u.Image, f => "https://thispersondoesnotexist.com");

        var genUsers = fakeUsers.Generate(model.Count);

        try
        {
            foreach (var user in genUsers)
            {
                var entity = mapper.Map<UserEntity>(user);
                entity.UserName = user.Email;
                entity.Image = await imageService.SaveImageFromUrlAsync(user.Image);
                var result = await userManager.CreateAsync(entity, user.Password);
                if (!result.Succeeded)
                {
                    Console.WriteLine("Error Create User {0}", user.Email);
                    continue;
                }
                foreach (var role in user.Roles)
                {
                    if (await roleManager.RoleExistsAsync(role))
                    {
                        await userManager.AddToRoleAsync(entity, role);
                    }
                    else
                    {
                        Console.WriteLine("Not Found Role {0}", role);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error Json Parse Data {0}", ex.Message);
        }

        stopWatch.Stop();
        // Get the elapsed time as a TimeSpan value.
        TimeSpan ts = stopWatch.Elapsed;

        // Format and display the TimeSpan value.
        string elapsedTime = String.Format(
            "{0:00}:{1:00}:{2:00}.{3:00}",
            ts.Hours,
            ts.Minutes,
            ts.Seconds,
            ts.Milliseconds / 10
        );

        return elapsedTime;
    }

    public async Task<ServiceResponse> UpdateUserAsync(UserEditModel model)
    {
        // 1. Пошук користувача за long Id
        var user = await userManager.FindByIdAsync(model.Id.ToString());

        if (user == null)
        {
            return new ServiceResponse { IsSuccess = false, Message = "Користувача не знайдено." };
        }

        // 2. Логіка оновлення імені (розбиваємо FullName на FirstName та LastName)
        if (!string.IsNullOrWhiteSpace(model.FullName))
        {
            var parts = model.FullName.Trim().Split(' ', 2);
            user.FirstName = parts[0];
            user.LastName = parts.Length > 1 ? parts[1] : string.Empty;
        }

        // 3. Оновлення Email (якщо потрібно)
        if (!string.IsNullOrWhiteSpace(model.Email) && user.Email != model.Email)
        {
            user.Email = model.Email;
            user.UserName = model.Email;
        }

        // 4. Робота з фото через ваш IImageService
        if (model.Image != null)
        {
            try
            {
                // Видаляємо стару картинку, якщо вона є
                if (!string.IsNullOrEmpty(user.Image))
                {
                    await imageService.DeleteImageAsync(user.Image);
                }

                // Зберігаємо нову (SaveImageAsync має приймати IFormFile)
                user.Image = await imageService.SaveImageAsync(model.Image);
            }
            catch (Exception ex)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = $"Помилка при завантаженні зображення: {ex.Message}",
                };
            }
        }

        // 5. Збереження змін через UserManager
        var result = await userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = string.Join(", ", result.Errors.Select(e => e.Description)),
            };
        }

        return new ServiceResponse { IsSuccess = true };
    }
}


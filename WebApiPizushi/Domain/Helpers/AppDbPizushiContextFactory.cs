using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Domain.Helpers;

public class AppDbPizushiContextFactory: IDesignTimeDbContextFactory<AppDbPizushiContext>
{
    public AppDbPizushiContext CreateDbContext(string[] args)
    {
        // 1. Отримуємо конфігурацію, щоб прочитати рядок підключення
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "..", "WebApiPizushi"))
            .AddJsonFile("appsettings.json")
            .Build();

        // 2. Витягуємо Connection String з конфігурації
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        // 3. Створюємо налаштування для DbContext
        var builder = new DbContextOptionsBuilder<AppDbPizushiContext>();
        builder.UseNpgsql(connectionString);

        // 4. Повертаємо новий екземпляр DbContext, використовуючи ці налаштування
        return new AppDbPizushiContext(builder.Options);
    }
}
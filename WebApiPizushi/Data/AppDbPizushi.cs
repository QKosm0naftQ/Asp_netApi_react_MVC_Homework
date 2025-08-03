using Microsoft.EntityFrameworkCore;
using WebApiPizushi.Data.Entities;

namespace WebApiPizushi.Data
{
    public class AppDbPizushiContext :DbContext
    {
        public AppDbPizushiContext(DbContextOptions<AppDbPizushiContext> options) : base(options) {}

        public DbSet<CategoryEntity> Categories { get; set; }

        // Define your DbSet properties for entities here
        // public DbSet<YourEntity> YourEntities { get; set; }
    }
}

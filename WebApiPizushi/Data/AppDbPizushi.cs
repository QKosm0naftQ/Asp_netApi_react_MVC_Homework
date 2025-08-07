using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebApiPizushi.Data.Entities;

namespace WebApiPizushi.Data
{
    public class AppDbPizushiContext : IdentityDbContext<UserEntity, RoleEntity, long>
    {
        public AppDbPizushiContext(DbContextOptions<AppDbPizushiContext> options) : base(options) {}

        public DbSet<CategoryEntity> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<UserRoleEntity>(ur =>
            {
                ur.HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(r => r.RoleId)
                    .IsRequired();

                ur.HasOne(ur => ur.User)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(u => u.UserId)
                    .IsRequired();
            });
        }
        
        
        // Define your DbSet properties for entities here
        // public DbSet<YourEntity> YourEntities { get; set; }
    }
}

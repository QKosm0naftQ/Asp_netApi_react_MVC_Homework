using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebProgram.Areas.Admin.Models.Product;
using WebProgram.Data.Entities.Identity;
using WebProgram.Data.Entities;

namespace WebProgram.Data
{
    public class AppProgramDbContext : IdentityDbContext<UserEntity, RoleEntity,int>
    {
        public AppProgramDbContext(DbContextOptions<AppProgramDbContext> options) : base(options) { }

        public DbSet<CategoryEntity> Categories { get; set; }
        
        public DbSet<ProductEntity> Products { get; set; }
        
        public DbSet<ProductImageEntity> ProductImages { get; set; }
        
        public DbSet<ProductDescriptionImageEntity> ProductDescriptionImages { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // identity 
            modelBuilder.Entity<UserRoleEntity>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);

            modelBuilder.Entity<UserRoleEntity>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);

        }
    }
}

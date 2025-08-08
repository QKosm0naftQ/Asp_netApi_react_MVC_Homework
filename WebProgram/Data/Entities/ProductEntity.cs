using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebProgram.Areas.Admin.Models.Product;

namespace WebProgram.Data.Entities;

[Table("tblProducts")]
public class ProductEntity
{
    [Key]
    public int Id { get; set; }
    [Required, StringLength(500)]
    public string Name { get; set; }
    [Required, StringLength(40000)]
    public string Description { get; set; }

    [ForeignKey("Category")]
    public int CategoryId { get; set; }
    public CategoryEntity? Category { get; set; }
    public ICollection<ProductImageEntity>? ProductImages { get; set; }
    public ICollection<ProductDescriptionImageEntity> DescriptionImages { get; set; }

}
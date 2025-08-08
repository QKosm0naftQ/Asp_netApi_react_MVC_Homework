using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebProgram.Data.Entities;

namespace WebProgram.Areas.Admin.Models.Product;

[Table("tblProductDescriptionImages")]
public class ProductDescriptionImageEntity
{
    [Key]
    public int Id { get; set; }
    
    [Required, StringLength(255)]
    public string Name { get; set; }
    
    [ForeignKey("Product")]
    public int ProductId { get; set; }
    
    public ProductEntity Product { get; set; }

}
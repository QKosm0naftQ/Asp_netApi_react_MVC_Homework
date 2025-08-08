using AutoMapper;
using WebProgram.Data.Entities;
using WebProgram.Models.Product;

namespace WebProgram.Mapper;


public class ProductMapper: Profile
{
    public ProductMapper() 
    {
        CreateMap<ProductEntity, ProductItemViewModel>()
            .ForMember(x => x.CategoryName, opt => opt.MapFrom(x => x.Category.Name))
            .ForMember(x => x.Images, opt => opt.MapFrom(x => x.ProductImages.Select(x=>x.Name)));
    }
}
using AutoMapper;
using WebApiPizushi.Data.Entities;
using WebApiPizushi.Models.Category;
using WebApiPizushi.Models.Seeder;

namespace WebApiPizushi.Mapper
{
    public class CategoryMapper : Profile
    {
        public CategoryMapper() 
        {
            CreateMap<SeederCategoryModel, CategoryEntity>();
            CreateMap<CategoryEntity, CategoryItemModel>();
            CreateMap<CategoryCreateItemModel, CategoryEntity>()
                .ForMember(x => x.Name, opt => opt.MapFrom(x=>x.Name.Trim()))
                .ForMember(x => x.Slug, opt => opt.MapFrom(x => x.Slug.Trim()))
                .ForMember(x => x.Image, opt => opt.Ignore());

            CreateMap<CategoryEditItemModel, CategoryEntity>()
                .ForMember(x => x.Name, opt => opt.MapFrom(x => x.Name.Trim()))
                .ForMember(x => x.Slug, opt => opt.MapFrom(x => x.Slug.Trim()))
                .ForMember(x => x.Image, opt => opt.Ignore());

        }
    }
}

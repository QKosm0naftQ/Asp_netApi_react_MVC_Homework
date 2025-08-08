using AutoMapper;
using WebProgram.Data.Entities;
using WebProgram.Models.Seeder;

namespace WebProgram.Mapper;

public class SeederMapper : Profile
{
    public SeederMapper() 
    {
        CreateMap<SeederCategoryModel, CategoryEntity>()
            .ForMember(x => x.ImageUrl, opt => opt.MapFrom(x => x.Image));
    }
}

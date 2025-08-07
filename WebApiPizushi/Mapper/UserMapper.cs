using AutoMapper;
using WebApiPizushi.Data.Entities;
using WebApiPizushi.Models.Seeder;

namespace WebApiPizushi.Mapper;

public class UserMapper: Profile
{
    public UserMapper()
    {
        CreateMap<SeederUserModel, UserEntity>()
            .ForMember(opt=>opt.UserName, opt=>opt.MapFrom(x=>x.Email));
    }
}
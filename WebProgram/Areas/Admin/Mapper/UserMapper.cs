using AutoMapper;
using WebProgram.Data.Entities.Identity;
using WebProgram.Areas.Admin.Models.Users;

namespace WebProgram.Areas.Admin.Mapper;

public class UserMapper : Profile
{
    public UserMapper()
    {
        CreateMap<UserEntity, UserItemViewModel>()
            .ForMember(x => x.Image, opt => opt.MapFrom(x => x.Image))
            .ReverseMap();
        CreateMap<UserEntity, UserEditViewModel>()
               .ForMember(dest => dest.Roles, opt => opt.Ignore())
               .ForMember(dest => dest.ImageName, opt => opt.MapFrom(x => string.IsNullOrEmpty(x.Image) ? "/DefaultImage/RegImage.png" : $"/images/200_{x.Image}"));

        CreateMap<UserEditViewModel, UserEntity>()
            .ForMember(dest => dest.Image, opt => opt.Ignore())
            .ForMember(dest => dest.UserRoles, opt => opt.Ignore())
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.SecurityStamp, opt => opt.Ignore())
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.ConcurrencyStamp, opt => opt.Ignore());

    }
}

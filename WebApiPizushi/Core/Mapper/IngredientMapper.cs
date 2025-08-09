using AutoMapper;
using Core.Models.Product;
using Core.Models.Seeder;
using Domain.Entities;

namespace Core.Mapper;

public class IngredientMapper : Profile
{
    public IngredientMapper()
    {
        CreateMap<SeederIngredientModel, IngredientEntity>();
        CreateMap<IngredientEntity, ProductIngredientModel>();
    }
}
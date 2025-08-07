using FluentValidation;
using WebApiPizushi.Models.Category;

namespace WebApiPizushi.Validators.Category;

public class CategoryCreateValidator : AbstractValidator<CategoryCreateItemModel>
{
    public CategoryCreateValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Назва є обов'язковою")
            .MaximumLength(250)
            .WithMessage("Назва повинна містити не більше 250 символів");
        RuleFor(x => x.Slug)
            .NotEmpty()
            .WithMessage("Слаг є обов'язковим")
            .MaximumLength(250)
            .WithMessage("Слаг повинен містити не більше 250 символів");
        RuleFor(x => x.Image)
            //.NotNull().WithMessage("Файл зображення є обов'язковим")
            .NotEmpty().WithMessage("Файл зображення є обов'язковим");
        //.Must(file => file!.Length > 0)
        //.WithMessage("Файл не повинен бути порожнім");
    }
}
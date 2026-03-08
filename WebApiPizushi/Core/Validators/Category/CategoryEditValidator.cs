using Core.Models.Category;
using Domain;
using FluentValidation;
using Microsoft.EntityFrameworkCore;


namespace Core.Validators.Category;

public class CategoryEditValidator : AbstractValidator<CategoryEditItemModel>
{
    public CategoryEditValidator(AppDbPizushiContext db)
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Назва є обов'язковою")
            .Must(name => !string.IsNullOrEmpty(name))
            .WithMessage("Назва не може бути порожньою або null")
            .DependentRules(() =>
            {
                RuleFor(x => x.Name)
                    //.MustAsync(async (name, cancellation) =>
                      //  !await db.Categories.AnyAsync(c => c.Name.ToLower() == name.ToLower().Trim(), cancellation))
                    .MustAsync(async (model, name, cancellation) =>
                        !await db.Categories
                        .AnyAsync(c => c.Name.ToLower() == name.ToLower().Trim()
                            && c.Id != model.Id, cancellation))
                    .WithMessage("Категорія з такою назвою вже існує");
            })
            .MaximumLength(250)
            .WithMessage("Назва повинна містити не більше 250 символів");

        RuleFor(x => x.Slug)
            .NotEmpty()
            .WithMessage("Слаг є обов'язковим")
            .MaximumLength(250)
            .WithMessage("Слаг повинен містити не більше 250 символів");
    }
}
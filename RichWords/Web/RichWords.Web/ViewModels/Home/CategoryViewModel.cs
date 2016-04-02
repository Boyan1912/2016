namespace RichWords.Web.ViewModels.Home
{
    using Common;
    using Infrastructure.Mapping;
    using RichWords.Data.Models;

    public class CategoryViewModel : IMapFrom<Category>
    {

        public CategoryName Name { get; set; }

    }
}
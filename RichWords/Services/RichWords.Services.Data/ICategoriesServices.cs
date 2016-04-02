namespace RichWords.Services.Data
{
    using System.Linq;

    using Common;
    using RichWords.Data.Models;

    public interface ICategoriesServices
    {
        IQueryable<Category> GetAll();

        Category GetById(string id);

        Category GetByName(string name);

        void Add(Category category);

        void Create(CategoryName name);

        void Save();
    }
}

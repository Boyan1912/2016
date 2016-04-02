namespace RichWords.Services.Data
{
    using System;
    using System.Linq;
    using Common;
    using RichWords.Data.Common;
    using RichWords.Data.Models;
    using Web;

    public class CategoriesServices : ICategoriesServices
    {

        private readonly IDbRepository<Category> categories;
        private readonly IIdentifierProvider identifierProvider;

        public CategoriesServices(IDbRepository<Category> categories, IIdentifierProvider identifierProvider)
        {
            this.categories = categories;
            this.identifierProvider = identifierProvider;
        }

        public void Add(Category category)
        {
            this.categories.Add(category);
        }

        public void Create(CategoryName name)
        {
            var newCategory = new Category
            {
                Name = name
            };

            this.Add(newCategory);
        }

        public void Create(string name)
        {
            try
            {
                CategoryName cName = (CategoryName)Enum.Parse(typeof(CategoryName), name);
                this.Create(cName);
            }
            catch(Exception ex)
            {
                Console.WriteLine("Error Parsing string to enum of type CategoryName: " + ex.Message);
            }
        }

        public IQueryable<Category> GetAll()
        {
            return this.categories.All();
        }

        public Category GetById(string id)
        {
            var intId = this.identifierProvider.DecodeId(id);
            return this.categories.GetById(intId);
        }

        public Category GetByName(string name)
        {
            return this.categories.All().FirstOrDefault(c => c.Name.ToString().ToLower() == name.ToLower()
            // account for plurals
            || $"{c.Name.ToString().ToLower()}s" == name.ToLower()
            || c.Name.ToString().ToLower() == $"{name.ToLower()}s");
        }

        public void Save()
        {
            this.categories.Save();
        }
    }
}

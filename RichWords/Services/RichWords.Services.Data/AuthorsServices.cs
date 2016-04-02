namespace RichWords.Services.Data
{
    using System;
    using System.Linq;
    using Common;
    using RichWords.Data.Common;
    using RichWords.Data.Models;
    using Web;

    public class AuthorsServices : IAuthorsServices
    {
        private readonly IDbRepository<Author> authors;
        private readonly IIdentifierProvider identifierProvider;

        public AuthorsServices(IDbRepository<Author> authors, IIdentifierProvider identifierProvider)
        {
            this.authors = authors;
            this.identifierProvider = identifierProvider;
        }

        public IQueryable<Author> GetAll()
        {
            return this.authors.All();
        }

        public Author GetById(string id)
        {
            var intId = this.identifierProvider.DecodeId(id);
            return this.authors.GetById(intId);
        }

        public Author GetByName(string name)
        {
            return this.authors.All().FirstOrDefault(a => a.Name == name);
        }

        public void Add(Author author)
        {
            this.authors.Add(author);
        }

        public void Create(string name = GlobalConstants.DefaultUnknownAuthorName, string description = null, DateTime? birthDate = default(DateTime?), DateTime? diedOn = default(DateTime?), string occupation = GlobalConstants.DefaultAuthorsOccupation, string nationality = GlobalConstants.DefaultAuthorsNationality)
        {
            var newAuthor = new Author
            {
                Name = name,
                Description = description,
                BirthDate = birthDate,
                DateDeceased = diedOn,
                Occupation = occupation,
                Nationality = nationality
            };

            this.authors.Add(newAuthor);
        }

        public void Update(Author author, string name = "", string description = null, DateTime? birthDate = default(DateTime?), DateTime? diedOn = default(DateTime?), string occupation = "", string nationality = "")
        {
            // TODO
            // Validate with a Validator

            author.Name = name;
            author.Description = description;
            author.BirthDate = birthDate;
            author.DateDeceased = diedOn;
            author.Occupation = occupation;
            author.Nationality = nationality;

            this.authors.Update(author);
            this.Save();
        }

        public void Save()
        {
            this.authors.Save();
        }
    }
}

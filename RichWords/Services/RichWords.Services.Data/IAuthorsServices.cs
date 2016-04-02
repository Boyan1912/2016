namespace RichWords.Services.Data
{
    using System;
    using System.Linq;

    using Common;
    using RichWords.Data.Models;

    public interface IAuthorsServices
    {

        IQueryable<Author> GetAll();

        Author GetById(string id);

        Author GetByName(string name);

        void Add(Author author);

        void Create(string name = GlobalConstants.DefaultUnknownAuthorName, string description = null, DateTime? birthDate = null, DateTime? diedOn = null, string occupation = GlobalConstants.DefaultAuthorsOccupation, string nationality = GlobalConstants.DefaultAuthorsNationality);

        void Update(Author author, string name = "", string description = null, DateTime? birthDate = null, DateTime? diedOn = null, string occupation = "", string nationality = "");
    }
}

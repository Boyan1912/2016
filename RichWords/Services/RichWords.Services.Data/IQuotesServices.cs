namespace RichWords.Services.Data
{
    using System.Linq;
    using RichWords.Data.Models;
    
    public interface IQuotesServices
    {

        IQueryable<Quote> GetAll();

        Quote GetById(string id);

        void Add(Quote quote);

        void Create(string content, int authorId, string creatorId);

        void Update(Quote quote, string content = "", int? authorId = null, string creatorId = "");

        Quote FindOneByContent(string content);

        void Save();
    }
}

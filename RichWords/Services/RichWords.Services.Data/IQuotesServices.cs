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

        IQueryable<Quote> GetRandomQuotes(int count);

        double CalculateRating(Quote quote);
        
        IQueryable<Quote> GetHighestRated(int count);
        
        IQueryable<Quote> GetMostPopular(int count);
        
        IQueryable<Quote> GetMostLoved(int count);
        
        IQueryable<Quote> GetMostHated(int count);

        IQueryable<Quote> GetByAuthor(int authorId);

        IQueryable<Quote> GetByCategory(int categoryId);

        IQueryable<Quote> GetByCreator(string creatorId);

        IQueryable<Quote> GetByTagNames(params string[] tagNames);

        IQueryable<Quote> GetLongest(int count);

        IQueryable<Quote> GetShortest(int count);

        void Save();
    }
}

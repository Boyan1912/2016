namespace RichWords.Services.Data
{
    using System;
    using System.Linq;

    using RichWords.Data.Common;
    using RichWords.Data.Models;
    using Web;

    public class QuotesServices : IQuotesServices
    {
        private readonly IDbRepository<Quote> quotes;
        private readonly IIdentifierProvider identifierProvider;

        public QuotesServices(IDbRepository<Quote> quotes, IIdentifierProvider identifierProvider)
        {
            this.quotes = quotes;
            this.identifierProvider = identifierProvider;
        }

        public Quote GetById(string id)
        {
            var intId = this.identifierProvider.DecodeId(id);
            return this.quotes.GetById(intId);
        }

        public IQueryable<Quote> GetAll()
        {
            return this.quotes.All().OrderByDescending(q => q.CreatedOn);
        }

        public void Add(Quote quote)
        {
            this.quotes.Add(quote);
        }

        public void Create(string content, int authorId, string creatorId)
        {
            var newQuote = new Quote
            {
                Content = content,
                AuthorId = authorId,
                CreatorId = creatorId
            };

            this.Add(newQuote);
        }

        public void Update(Quote quote, string content = "", int? authorId = default(int?), string creatorId = "")
        {
            if (!string.IsNullOrWhiteSpace(content))
            {
                quote.Content = content;
            }
            if (authorId != default(int?))
            {
                quote.AuthorId = (int)authorId;
            }
            if (!string.IsNullOrWhiteSpace(creatorId))
            {
                quote.CreatorId = creatorId;
            }

            this.quotes.Update(quote);
        }

        public Quote FindOneByContent(string content)
        {
            return this.quotes.All().Where(x => x.Content.IndexOf(content) >= 0).FirstOrDefault();
        }

        public void Save()
        {
            this.quotes.Save();
        }
    }
}

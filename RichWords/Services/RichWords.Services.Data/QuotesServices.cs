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

        public IQueryable<Quote> GetRandomQuotes(int count)
        {
            return this.quotes.All().OrderBy(x => Guid.NewGuid()).Take(count);
        }

        public double CalculateRating(Quote quote)
        {
            double sum = quote.Likes.Sum(l => l.Value);
            double count = quote.Likes.Count;
            double rating = sum / count;
            return rating;
        }

        public IQueryable<Quote> GetHighestRated(int count)
        {
            return this.quotes
                        .All()
                        .OrderByDescending(q => this.CalculateRating(q))
                        .Take(count);
        }

        public IQueryable<Quote> GetMostPopular(int count)
        {
            return this.quotes
                        .All()
                        .OrderByDescending(q => q.Likes.Count)
                        .Take(count);
        }

        public IQueryable<Quote> GetMostLoved(int count)
        {
            return this.quotes
                        .All()
                        .OrderByDescending(q => q.Likes.Count(l => l.Value > 0))
                        .Take(count);
        }

        public IQueryable<Quote> GetMostHated(int count)
        {
            return this.quotes
                        .All()
                        .OrderByDescending(q => q.Likes.Count(l => l.Value < 0))
                        .Take(count);
        }

        public IQueryable<Quote> GetByAuthor(int authorId)
        {
            return this.quotes
                        .All()
                        .Where(q => q.AuthorId == authorId);
        }

        public IQueryable<Quote> GetByCategory(int categoryId)
        {
            return this.quotes
                        .All()
                        .Where(q => q.CategoryId == categoryId);
        }

        public IQueryable<Quote> GetByCreator(string creatorId)
        {
            return this.quotes
                        .All()
                        .Where(q => q.CreatorId == creatorId);
        }

        public IQueryable<Quote> GetByTagNames(params string[] tagNames)
        {
            return this.quotes
                        .All()
                        .Where(q => q.Tags
                                    .Any(x => tagNames
                                              .Any(t => t == x.Name)));
        }

        public void Save()
        {
            this.quotes.Save();
        }
    }
}

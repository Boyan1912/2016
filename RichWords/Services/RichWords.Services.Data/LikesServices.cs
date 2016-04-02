namespace RichWords.Services.Data
{
    using System;
    using System.Linq;
    using RichWords.Data.Common;
    using RichWords.Data.Models;
    using RichWords.Data.Models.Contracts;
    using Web;

    public class LikesServices : ILikesServices
    {
        private readonly IDbRepository<Like> likes;
        private readonly IIdentifierProvider identifierProvider;

        public LikesServices(IDbRepository<Like> likes, IIdentifierProvider identifierProvider)
        {
            this.likes = likes;
            this.identifierProvider = identifierProvider;
        }
        
        public void Add(Like like)
        {
            this.likes.Add(like);
        }

        public void Create(int value, string userId, string entryId)
        {
            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(entryId))
            {
                return;
            }

            int entryIdInt = this.identifierProvider.DecodeId(entryId);
            var newLike = new Like
            {
                Value = value,
                UserId = userId,
                QuoteId = entryIdInt
            };

            this.likes.Add(newLike);
        }

        public void Dismiss(string entryId, string userId)
        {
            int entryIdInt = this.identifierProvider.DecodeId(entryId);
            var likedItem = this.likes.All().FirstOrDefault(l => l.QuoteId == entryIdInt && l.UserId == userId && !l.IsDeleted);
            if (likedItem != null)
            {
                this.likes.Delete(likedItem);
            }   
        }

        public IQueryable<Like> GetAll()
        {
            return this.likes.All();
        }

        public Like GetById(string id)
        {
            int intId = this.identifierProvider.DecodeId(id);
            return this.likes.GetById(intId);
        }

        public void Save()
        {
            this.likes.Save();
        }
    }
}

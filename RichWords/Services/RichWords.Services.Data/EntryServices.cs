//namespace RichWords.Services.Data
//{
//    using System;
//    using System.Linq;

//    using RichWords.Data.Common;
//    using RichWords.Data.Models;
//    using RichWords.Services.Web;

//    public class EntryServices
//    {
//        private readonly IDbRepository<IEntry> entries;
//        private readonly IIdentifierProvider identifierProvider;

//        public EntryServices(IDbRepository<IEntry> entries, IIdentifierProvider identifierProvider)
//        {
//            this.entries = entries;
//            this.identifierProvider = identifierProvider;
//        }

//        public IEntry GetById(string id)
//        {
//            var intId = this.identifierProvider.DecodeId(id);
//            var item = this.entries.GetById(intId);
//            return item;
//        }

//        public IQueryable<IEntry> GetRandomItems(int count)
//        {
//            return this.entries.All().OrderBy(x => Guid.NewGuid()).Take(count);
//        }

//        public IQueryable<IEntry> GetAll()
//        {
//            return this.entries.All().OrderByDescending(x => x.CreatedOn);
//        }

//        public IQueryable<IEntry> GetMostPopular(int count)
//        {
//            return this.entries.All().OrderByDescending(x => x.Likes.Count).Take(count);
//        }

//        public double LikeDislike(bool like, string entryId, string userId)
//        {
//            var entry = this.GetById(entryId);

//            entry.Likes.Add(new Like
//            {
//                Value = like,
//                EntryId = entry.Id,
//                UserId = userId
//            });

//            return this.GetRatingById(entryId);
//        }

//        public int GetRatingById(string id)
//        {
//            var entry = this.GetById(id);

//            return entry.Likes.Count(x => x.Value) - entry.Likes.Count(x => !x.Value);
//        }
        
//    }
//}

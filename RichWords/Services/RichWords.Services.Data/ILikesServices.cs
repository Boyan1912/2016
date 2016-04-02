namespace RichWords.Services.Data
{
    using System.Linq;
    using RichWords.Data.Models;
    using RichWords.Data.Models.Contracts;

    public interface ILikesServices
    {

        IQueryable<Like> GetAll();

        Like GetById(string id);

        void Add(Like like);

        void Create(int value, string userId, string entryId);

        void Save();

        void Dismiss(string entryId, string userId);
    }
}

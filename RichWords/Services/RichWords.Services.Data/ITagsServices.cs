namespace RichWords.Services.Data
{
    using System.Linq;
    using RichWords.Data.Models;

    public interface ITagsServices
    {
        IQueryable<Tag> GetAll();

        Tag GetById(string id);

        void Add(Tag tag);

        void AddMany(params Tag[] tags);

        void Create(string name);

        void Update(Tag quote, string name);

        void Save();
    }
}

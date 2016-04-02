namespace RichWords.Services.Data
{
    using System.Linq;
    using RichWords.Data.Common;
    using RichWords.Data.Models;
    using Web;

    public class TagsServices : ITagsServices
    {
        private readonly IDbRepository<Tag> tags;
        private readonly IIdentifierProvider identifierProvider;

        public TagsServices(IDbRepository<Tag> tags, IIdentifierProvider identifierProvider)
        {
            this.tags = tags;
            this.identifierProvider = identifierProvider;
        }

        public void Add(Tag tag)
        {
            this.tags.Add(tag);
        }

        public void AddMany(params Tag[] tags)
        {
            foreach (var tag in tags)
            {
                this.tags.Add(tag);
            }
        }

        public void Create(string name)
        {
            var newTag = new Tag
            {
                Name = name
            };
            this.tags.Add(newTag);
        }

        public IQueryable<Tag> GetAll()
        {
            return this.tags.All();
        }

        public Tag GetById(string id)
        {
            var intId = this.identifierProvider.DecodeId(id);
            return this.tags.GetById(intId);
        }

        public void Update(Tag tag, string name)
        {
            if (!string.IsNullOrWhiteSpace(name))
            {
                tag.Name = name;
            }
        }

        public void Save()
        {
            this.tags.Save();
        }
    }
}

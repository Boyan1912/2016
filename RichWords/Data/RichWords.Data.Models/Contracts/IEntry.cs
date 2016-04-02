namespace RichWords.Data.Models.Contracts
{

    public interface IEntry
    {
        string Content { get; set; }

        int CategoryId { get; set; }

        Category Category { get; set; }

        int AuthorId { get; set; }

        Author Author { get; set; }

        string CreatorId { get; set; }

        ApplicationUser Creator { get; set; }
    }
}

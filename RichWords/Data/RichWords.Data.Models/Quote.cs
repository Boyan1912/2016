namespace RichWords.Data.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    using Common.Models;
    using Contracts;
    using RichWords.Common;

    public class Quote : BaseModel<int>, IEntry
    {
        private ICollection<Like> likes;
        private ICollection<Tag> tags;
        
        public Quote()
        {
            this.Likes = new HashSet<Like>();
            this.Tags = new HashSet<Tag>();
        }

        [Required]
        [StringLength(GlobalConstants.MaxQuoteLength, ErrorMessage = GlobalConstants.TooLongContentForAQuote)]
        public string Content { get; set; }

        public int AuthorId { get; set; }
        
        public virtual Author Author { get; set; }

        public int CategoryId { get; set; }

        public virtual Category Category { get; set; }

        public string CreatorId { get; set; }

        public ApplicationUser Creator { get; set; }

        public virtual ICollection<Like> Likes { get { return this.likes; } set { this.likes = value; } }

        public virtual ICollection<Tag> Tags { get { return this.tags; } set { this.tags = value; } }
    }
}

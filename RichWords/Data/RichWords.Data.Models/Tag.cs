namespace RichWords.Data.Models
{
    using System.ComponentModel.DataAnnotations;

    using Common.Models;

    public class Tag : BaseModel<int>
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        public int QuoteId { get; set; }

        public virtual Quote Quote { get; set; }
    }
}

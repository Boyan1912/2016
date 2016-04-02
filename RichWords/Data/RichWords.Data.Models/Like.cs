namespace RichWords.Data.Models
{
    using System.ComponentModel.DataAnnotations;
    using Common.Models;

    public class Like : BaseModel<int>
    {
        [Range(-1, 1)]
        public int Value { get; set; }

        public string UserId { get; set; }

        public virtual ApplicationUser User { get; set; }

        public int QuoteId { get; set; }

        public virtual Quote Quote { get; set; }
    }
}

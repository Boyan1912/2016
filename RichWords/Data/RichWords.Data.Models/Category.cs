namespace RichWords.Data.Models
{
    using System.Collections.Generic;

    using Common.Models;
    using RichWords.Common;

    public class Category : BaseModel<int>
    {
        private ICollection<Quote> quotes;

        public Category()
        {
            this.Quotes = new HashSet<Quote>();
        }

        public CategoryName Name { get; set; }

        public virtual ICollection<Quote> Quotes { get { return this.quotes; } set { this.quotes = value; } }
    }
}

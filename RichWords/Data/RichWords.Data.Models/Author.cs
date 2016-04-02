namespace RichWords.Data.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    using Common.Models;
    
    public class Author : BaseModel<int>
    {
        private ICollection<Quote> quotes;

        public Author()
        {
            this.Quotes = new HashSet<Quote>();
        }

        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(3000)]
        public string Description { get; set; }

        [StringLength(100)]
        public string Nationality { get; set; }

        public DateTime? BirthDate { get; set; }

        public DateTime? DateDeceased { get; set; }

        [StringLength(100)]
        public string Occupation { get; set; }

        [StringLength(1000)]
        public string ImageUrl { get; set; }

        public virtual ICollection<Quote> Quotes { get { return this.quotes; } set { this.quotes = value; } }
    }
}
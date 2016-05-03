namespace BannersApp.Data.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    
    public class Banner
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "{0} is required!")]
        [StringLength(500, ErrorMessage ="Banner {0} is too long!")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Date and time to start from is required!")]
        public DateTime ValidFrom { get; set; }

        [Required(ErrorMessage = "Date and time to end on is required!")]
        public DateTime ValidTo { get; set; }

        public int PictureId { get; set; }

        [Required(ErrorMessage = "An image file is required!")]
        public virtual Picture Picture { get; set; }
        
    }
}

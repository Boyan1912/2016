namespace BannersApp.Data.Models
{
    using System;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    
    public class Banner
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required!")]
        [StringLength(500, ErrorMessage ="Banner name is too long!")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Date and time to start from is required!")]
        public DateTime ValidFrom { get; set; }

        [Required(ErrorMessage = "Date and time to end on is required!")]
        public DateTime ValidTo { get; set; }

        public int PictureId { get; set; }

        [Required]
        public virtual Picture Picture { get; set; }
        
    }
}

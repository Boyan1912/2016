namespace BannersApp.Models
{
    using Helpers;
    using System;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;

    public class BannerViewModel
    {
        [Required(ErrorMessage ="Id is required")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required!")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Date and time to start from is required!")]
        [DisplayName("Valid From")]
        public DateTime ValidFrom { get; set; }

        [Required(ErrorMessage = "Date and time to end on is required!")]
        [DisplayName("Valid To")]
        public DateTime ValidTo { get; set; }

        // Doesnt Work - Browsers do not want to download files from PC location
        public string ImageAddress { get; set; }
        

    }
}
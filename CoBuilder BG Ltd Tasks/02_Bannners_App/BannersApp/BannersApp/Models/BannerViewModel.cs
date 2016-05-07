namespace BannersApp.Models
{
    using System;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;

    public class BannerViewModel
    {
        //[Required(ErrorMessage ="{0} is required")]
        public int Id { get; set; }

        //[Required(ErrorMessage = "{0} is required!")]
        public string Name { get; set; }

        //[Required(ErrorMessage = "Date and time to start from is required!")]
        //[DisplayName("Valid From")]
        public DateTime ValidFrom { get; set; }

        //[Required(ErrorMessage = "Date and time to end on is required!")]
        //[DisplayName("Valid To")]
        public DateTime ValidTo { get; set; }

        public string ImageAddress { get; set; }

        public bool IsActive { get; set; }
    }
}
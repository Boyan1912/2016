namespace BannersApp.Models
{
    using System;
    
    public class BannerViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; }
        
        public DateTime ValidFrom { get; set; }
        
        public DateTime ValidTo { get; set; }

        public string ImageAddress { get; set; }

        public bool IsActive { get; set; }
    }
}
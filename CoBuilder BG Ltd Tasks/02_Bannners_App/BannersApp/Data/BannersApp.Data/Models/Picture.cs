namespace BannersApp.Data.Models
{
    using System.ComponentModel.DataAnnotations;

    public class Picture
    {
        public int Id { get; set; }

        [StringLength(300, ErrorMessage ="picture name")]
        public string Name { get; set; }

        [Required]
        public byte[] Data { get; set; }

        [StringLength(50, ErrorMessage ="Content-type seems too long for an image!")]
        public string ContentType { get; set; }
        
    }
}
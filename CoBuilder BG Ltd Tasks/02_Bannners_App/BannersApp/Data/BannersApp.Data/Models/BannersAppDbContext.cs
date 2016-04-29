namespace BannersApp.Data.Models
{
    using Interfaces;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System.Data.Entity;
    
    public class BannersAppDbContext : IdentityDbContext<User>, IBannersAppDbContext
    {
        public BannersAppDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
        }

        public virtual DbSet<Banner> Banners { get; set; }

        public virtual DbSet<Picture> Pictures { get; set; }

        public static BannersAppDbContext Create()
        {
            return new BannersAppDbContext();
        }

    }
}

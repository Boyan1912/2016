namespace BannersApp.Data.Interfaces
{
    using Models;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;

    public interface IBannersAppDbContext
    {
        DbSet<Banner> Banners { get; set; }

        DbSet<Picture> Pictures { get; set; }

        DbSet<T> Set<T>() where T : class;

        DbEntityEntry<T> Entry<T>(T entity) where T : class;

        int SaveChanges();

    }
}

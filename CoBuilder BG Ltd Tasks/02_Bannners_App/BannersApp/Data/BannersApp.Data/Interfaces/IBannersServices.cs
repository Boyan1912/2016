namespace BannersApp.Data.Interfaces
{
    using BannersApp.Data.Models;
    using System;
    using System.Linq;

    public interface IBannersServices
    {
        Banner GetById(int id);

        IQueryable<Banner> GetAll();
        
        void Delete(Banner banner);

        void Delete(int id);

        IQueryable<Banner> GetRandomBanners(int count);

        void Add(Banner banner);

        void Update(Banner banner, DateTime? validFrom, DateTime? validTo, string newName = null, Picture newPic = null);

        int SaveChanges();
    }
}

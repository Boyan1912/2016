namespace BannersApp.Data.Services
{
    using System;
    using System.Linq;

    using Interfaces;
    using Models;
    
    public class BannersServices : IBannersServices
    {
        private readonly IRepository<Banner> banners;

        public BannersServices(IRepository<Banner> banners)
        {
            this.banners = banners;
        }

        public void Delete(int id)
        {
            this.banners.Delete(id);
        }

        public void Delete(Banner banner)
        {
            this.banners.Delete(banner);
        }

        public IQueryable<Banner> GetAll()
        {
            return this.banners.All();
        }

        public IQueryable<Banner> GetAllActiveBanners()
        {
            // sends database request ("ToList()") earlier because bool property "IsActive" is not supported by Entity Framework
            return this.banners
                        .All()
                        .ToList()
                        .Where(x => x.IsActive)
                        .AsQueryable();
        }

        public IQueryable<Banner> GetRandomActiveBanners()
        {
            // sends database request ("ToList()") earlier because bool property "IsActive" is not supported by Entity Framework
            return this.banners
                        .All()
                        .OrderBy(b => Guid.NewGuid())
                        .ToList()
                        .Where(x => x.IsActive)
                        .AsQueryable();
        }

        public Banner GetById(int id)
        {
            return this.banners.GetById(id);
        }

        public IQueryable<Banner> GetRandomBanners(int count)
        {
            return this.banners.All()
                               .OrderBy(b => Guid.NewGuid())
                               .Take(count);
        }

        public void Add(Banner banner)
        {
            this.banners.Add(banner);
        }
        
        public void Update(Banner banner, DateTime? validFrom, DateTime? validTo, string newName = null, Picture newPic = null)
        {
            banner.Name = newName ?? newName;
            banner.ValidFrom = validFrom ?? DateTime.Now;
            banner.ValidTo = validTo ?? DateTime.Now.AddDays(1);
            banner.Picture = newPic ?? newPic;
            
            this.banners.Update(banner);
        }

        public void Update(Banner banner)
        {
            this.banners.Update(banner);
        }
        
        public int SaveChanges()
        {
            return this.banners.SaveChanges();
        }
    }
}

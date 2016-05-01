namespace BannersApp.Data.Services
{
    using System;
    using System.Linq;
    using Interfaces;
    using Models;
    using System.Threading.Tasks;
    using Repositories;

    public class BannersServices : IBannersServices
    {
        private readonly IRepository<Banner> banners;

        public BannersServices(IRepository<Banner> banners)
        {
            this.banners = banners;
        }

        public BannersServices()
            : this(new GenericRepository<Banner>())
        {
        }

        public void Delete(Banner banner)
        {
            this.banners.Delete(banner);
        }

        public IQueryable<Banner> GetAll()
        {
            return this.banners.All();
        }

        public Banner GetById(int id)
        {
            return this.banners.GetById(id);
        }

        public IQueryable<Banner> GetRandomBanners(int count)
        {
            return this.banners.All()
                                .OrderBy(b => new Guid())
                                .Take(count);
        }

        public void Add(Banner banner)
        {
            this.banners.Add(banner);
        }
        
        public int SaveChanges()
        {
            return this.banners.SaveChanges();
        }
    }
}

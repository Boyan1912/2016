namespace BannersApp.Data.Services
{
    using System;
    using BannersApp.Data.Interfaces;
    using Models;
    using Repositories;

    public class PicturesServices : IPicturesServices
    {
        private readonly IRepository<Picture> pictures;

        public PicturesServices(IRepository<Picture> pictures)
        {
            this.pictures = pictures;
        }

        public PicturesServices()
            : this(new GenericRepository<Picture>())
        {
        }

        public void Add(Picture pic)
        {
            this.pictures.Add(pic);
        }

        public int SaveChanges()
        {
            return this.pictures.SaveChanges();
        }
    }
}

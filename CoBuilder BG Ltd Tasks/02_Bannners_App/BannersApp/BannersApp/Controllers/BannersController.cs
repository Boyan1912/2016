namespace BannersApp.Controllers
{
    using BannersApp.Data.Models;
    using Data.Interfaces;
    using Data.Services;
    using Helpers;
    using Models;
    using Ninject;
    using System;
    using System.Collections.Specialized;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Web;
    using System.Web.Mvc;

    public class BannersController : Controller
    {
        [Inject]
        private IBannersServices banners;
        [Inject]
        private IPicturesServices pictures;

        public BannersController(IBannersServices banners, IPicturesServices pictures)
        {
            this.banners = banners;
            this.pictures = pictures;
        }

        public BannersController()
            : this(new BannersServices(), new PicturesServices())
        {
        }

        [HttpGet]
        public ActionResult All()
        {
            var allBanners = banners.GetAll()
                                    .ToList()
                                    .ToViewModels(); 
            return View(allBanners);
        }

        public ActionResult Random()
        {

            return View();
        }

        [HttpGet]
        public ActionResult Create()
        {

            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        //[ValidateAntiForgeryToken]
        public ActionResult Create(Banner model, HttpPostedFileBase picture)
        {
            
            //if (!IsPicture(picture))
            //{
            //    //TODO Return a Error view
            //} 

            // add image to database
            Picture pic = MakeDbPictureFromFile(picture);
            this.pictures.Add(pic);

            // add database model to db
            model.Picture = pic;
            this.banners.Add(model);
            this.banners.SaveChanges();

            var vm = model.ToViewModel();

            return RedirectToAction("All");
        }

        [HttpPost]
        public void Remove(string id)
        {
            int bannerId = int.Parse(id);
            var banner = this.banners.GetById(bannerId);
            int picId = banner.PictureId;
            this.pictures.Delete(picId);
            this.pictures.SaveChanges();
            this.banners.Delete(bannerId);
            this.banners.SaveChanges();
            
        }

        private Picture MakeDbPictureFromFile(HttpPostedFileBase file)
        {
            Picture picture = new Picture();

            picture.Name = file.FileName;
            picture.ContentType = file.ContentType;
            
            using (Stream inputStream = file.InputStream)
            {
                MemoryStream memoryStream = inputStream as MemoryStream;
                if (memoryStream == null)
                {
                    memoryStream = new MemoryStream();
                    inputStream.CopyTo(memoryStream);
                }
                picture.Data = memoryStream.ToArray();
            }

            return picture;
        }

        private bool IsPicture(HttpPostedFileBase file)
        {
            if (file.ContentType.Contains("image"))
            {
                return true;
            }

            string[] formats = new string[] { ".jpg", ".png", ".gif", ".jpeg", ".bmp", ".tif", "eps" };

            return formats.Any(item => file.FileName.EndsWith(item, StringComparison.OrdinalIgnoreCase));
        }
    }
}
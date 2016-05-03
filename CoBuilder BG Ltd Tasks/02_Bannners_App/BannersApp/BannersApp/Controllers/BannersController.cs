namespace BannersApp.Controllers
{
    using BannersApp.Data.Models;
    using Data.Interfaces;
    using Data.Services;
    using Helpers;
    using Ninject;
    using System;
    using System.IO;
    using System.Linq;
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

        //public BannersController()
        //    : this(new BannersServices(), new PicturesServices())
        //{
        //}

        [HttpGet]
        public ActionResult All()
        {
            var allBanners = banners.GetAll()
                                    .ToList()
                                    .ToViewModels();

            return View(allBanners);
        }

        [HttpGet]
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
        [ValidateAntiForgeryToken]
        public ActionResult Create(Banner model, HttpPostedFileBase picture)
        {

            if (!IsImage(picture))
            {
                HandleErrorInfo err = new HandleErrorInfo(new FormatException("File must be of image type"), "Banners", "Create");
                return View("Error", err);
            }

            // add image to database
            Picture pic = MakeDbPictureFromFile(picture);
            this.pictures.Add(pic);
            
            model.Picture = pic;

            if (ModelState.IsValid)
            {
                // add database model to db
                this.banners.Add(model);
                this.banners.SaveChanges();
                
                return RedirectToAction("All");
            }

            return View(model);
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

        private bool IsImage(HttpPostedFileBase file)
        {
            if(file == null)
            {
                return false;
            }

            if (file.ContentType.Contains("image"))
            {
                return true;
            }

            string[] formats = new string[] { ".jpg", ".png", ".gif", ".jpeg", ".bmp", ".tif", "eps" };

            return formats.Any(item => file.FileName.ToLower().EndsWith(item, StringComparison.OrdinalIgnoreCase));
        }
    }
}
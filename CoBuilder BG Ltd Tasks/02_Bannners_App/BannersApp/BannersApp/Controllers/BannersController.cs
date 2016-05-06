namespace BannersApp.Controllers
{
    using BannersApp.Data.Models;
    using Data.Interfaces;
    using Infrastructure;
    using Models;
    using Ninject;

    using System;
    using System.Collections.Generic;
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
        
        [HttpGet]
        public ActionResult All(int? page)
        {
            page = page ?? 1;
            int size = Constants.AllItemsPageSize;

            var data = banners.GetAll()
                              .OrderBy(b => b.Id)
                              .Skip((int)(page - 1) * size)
                              .Take(size)
                              .ToViewModels()
                              .ToList();
                              

            //Response.Cache.SetCacheability(HttpCacheability.NoCache);
            //Response.Cache.SetNoStore();

            ViewBag.Page = page;

            return View(data);
        }
        
        [HttpGet]
        public ActionResult Random()
        {
            var randomBanners = this.banners
                                    .GetRandomBanners(Constants.RandomItemsCount)
                                    .ToViewModels()
                                    .Where(x => x.IsActive)
                                    .ToList();
            
            return View(randomBanners);
        }

        [HttpGet]
        public ActionResult RefreshRandomModelsData()
        {
            var randomBanners = this.banners
                                    .GetRandomBanners(Constants.RandomItemsCount)
                                    .ToViewModels()
                                    .Where(x => x.IsActive)
                                    .ToList();

            return PartialView("_GridPartial", randomBanners);
        }

        private void SaveToTempData(IList<BannerViewModel> models)
        {

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
                HandleErrorInfo err = new HandleErrorInfo(new FormatException(Constants.NotAnImageErrorMessage), "Banners", "Create");
                return View("Error", err);
            }

            // add image to database
            Picture pic = MakeDbPictureFromFile(picture);
            this.pictures.Add(pic);
            
            model.Picture = pic;

            if (!string.IsNullOrEmpty(model.Name) && model.ValidTo > model.ValidFrom)
            {
                // add database model to db
                this.banners.Add(model);
                this.banners.SaveChanges();
                
                return RedirectToAction("All");
            }

            // show invalid input data
            return View(model);
        }

        [HttpPost]
        public ActionResult Remove(string id)
        {
            try
            {
                int bannerId = int.Parse(id);
                var banner = this.banners.GetById(bannerId);
                int picId = banner.PictureId;
                this.pictures.Delete(picId);
                this.pictures.SaveChanges();
                this.banners.Delete(bannerId);
                this.banners.SaveChanges();
            }
            catch(Exception ex)
            {
                HandleErrorInfo err = new HandleErrorInfo(ex, "Banners", "Remove");
                return View("Error", err);
            }

            return RedirectToAction("All");
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
            
            return Constants.AcceptableImageFormats.Any(item => file.FileName
                                                                    .ToLower()
                                                                    .EndsWith(item, StringComparison.OrdinalIgnoreCase));
        }
    }
}
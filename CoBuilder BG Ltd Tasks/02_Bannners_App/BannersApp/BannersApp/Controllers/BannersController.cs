namespace BannersApp.Controllers
{
    using BannersApp.Data.Models;
    using Data.Interfaces;
    using Infrastructure;
    using Models;
    using Ninject;

    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;

    public class BannersController : Controller
    {
        [Inject]
        private readonly IBannersServices banners;
        [Inject]
        private readonly IPicturesServices pictures;

        private readonly BannerViewModelServices viewModels = new BannerViewModelServices();

        public BannersController(IBannersServices banners, IPicturesServices pictures)
        {
            this.banners = banners;
            this.pictures = pictures;
        }

        [HttpGet]
        public ActionResult All(int? page)
        {
            page = page ?? 1;
            int size = Globals.AllItemsPageSize;

            var data = banners.GetAll()
                              .OrderBy(b => b.Id)
                              .Skip((int)(page - 1) * size)
                              .Take(size)
                              .ToViewModels()
                              .ToList();

            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetNoStore();

            ViewBag.Page = page;

            return View(data);
        }

        [HttpGet]
        public ActionResult Random()
        {
            this.SetRandomItemsActive(Globals.CountActiveBannersSensitivity);
            var randomBanners = this.GetActiveRandomViewModels();

            return View(randomBanners);
        }

        [HttpPost]
        public ActionResult RefreshRandomModelsData(string[] lastIds)
        {
            this.SwitchActiveItems();
            // dont't show last shown banners
            if (lastIds.Length > 0)
            {
                this.SwitchOffAlreadyShown(lastIds);
            }
            var randomBanners = this.GetActiveRandomViewModels();
            this.EnsureNoRepetitions(randomBanners);

            return PartialView("_GridPartial", randomBanners);
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

            if (!this.viewModels.IsImage(picture))
            {
                HandleErrorInfo err = new HandleErrorInfo(new FormatException(Globals.NotAnImageErrorMessage), "Banners", "Create");
                return View("Error", err);
            }

            else
            {
                // add image to database
                Picture pic = this.viewModels.MakeDbPictureFromFile(picture);
                this.pictures.Add(pic);
                //connect the new model to the picture and remove "ModelState" mistake, because it doesn't go out otherwise
                model.Picture = pic;
                ModelState.Remove("Picture");
            }

            if (ModelState.IsValid)
            {
                // add database model to db
                this.banners.Add(model);
                this.banners.SaveChanges();

                return RedirectToAction("Details", "Banners", new { id = model.Id });
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
                this.banners.Delete(bannerId);
                this.banners.SaveChanges();
            }
            catch (Exception ex)
            {
                HandleErrorInfo err = new HandleErrorInfo(ex, "Banners", "Remove");
                return View("Error", err);
            }

            return RedirectToAction("All");
        }

        [HttpGet]
        public ActionResult Details(int? id)
        {
            Banner banner;
            try
            {
                banner = this.banners.GetById((int)id);

                if (banner == null)
                {
                    throw new NullReferenceException("Incorrect Id");
                }

            }
            catch (Exception ex)
            {
                string bannerId = id == null ? "N/A" : id.ToString();
                HandleErrorInfo err = new HandleErrorInfo(new ArgumentException($"An item with id {bannerId} was not found in the database!\n\n" + ex.Message), "Banners", "Remove");
                return View("Error", err);
            }

            return View(banner);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Details(string id, string name, DateTime validFrom, DateTime validTo, HttpPostedFileBase picture)
        {
            int updateModelId = int.Parse(id);
            Banner banner = this.banners.GetById(updateModelId);
            Picture pic = banner.Picture;

            if (picture != null)
            {
                if (!this.viewModels.IsImage(picture))
                {
                    HandleErrorInfo err = new HandleErrorInfo(new FormatException(Globals.NotAnImageErrorMessage), "Banners", "Create");
                    return View("Error", err);
                }

                pic = this.viewModels.MakeDbPictureFromFile(picture);
                this.pictures.Add(pic);
            }

            this.banners.Update(banner, validFrom, validTo, name, pic);
            this.ModelState.Remove("Picture");

            if (banner.ValidFrom > banner.ValidTo)
            {
                this.ModelState.AddModelError("ValidTo", "Value should be greater than \"Valid From\"!");
            }
            if (string.IsNullOrEmpty(banner.Name))
            {
                this.ModelState.AddModelError("Name", "Name cannot be empty!");
            }

            if (this.ModelState.IsValid)
            {
                this.banners.SaveChanges();
                return RedirectToAction("Details", banner.Id);
            }

            return View(banner);
        }

        private IList<BannerViewModel> GetActiveRandomViewModels()
        {
            var models = this.banners.GetRandomActiveBanners()
                                     .Take(Globals.MaxRandomItemsCount)
                                     .ToViewModels()
                                     .ToList();

            this.EnsureNoRepetitions(models);

            return models;
        }

        private void EnsureNoRepetitions(IList<BannerViewModel> models)
        {
            for (int i = 1; i < models.Count; i++)
            {
                if (models[i].Id == models[i - 1].Id)
                {
                    var replace = this.banners.GetAll()
                                              .FirstOrDefault(x => x.Id > models[i - 1].Id && x.IsActive);

                    if (replace == null)
                    {
                        replace = this.banners.GetAll()
                                              .FirstOrDefault(x => x.Id < models[i - 1].Id && x.IsActive);
                    }
                    if (replace == null)
                    {
                        models.RemoveAt(i);
                        EnsureNoRepetitions(models);
                    }

                    models[i] = replace.ToViewModel();
                }
            }
        }

        private void SwitchActiveItems()
        {
            this.banners.GetAll().ForEach(b => b.IsActive = !b.IsActive);
        }

        private void SetRandomItemsActive(int sensitivity)
        {
            var rnd = new Random();
            this.banners.GetAll()
                        .ForEach(b => b.IsActive = rnd.Next(1, 11) >= sensitivity);
        }

        private void SwitchOffAlreadyShown(string[] shownIds)
        {
            for (int i = 0; i < shownIds.Length; i++)
            {
                int id = int.Parse(shownIds[i]);
                var banner = this.banners.GetById(id);
                banner.IsActive = false;
            }
        }
    }
}
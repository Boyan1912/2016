namespace BannersApp.Controllers
{
    using App_Start;
    using Data.Interfaces;
    using Infrastructure;
    using Ninject;
    using System;
    using System.IO;
    using System.Linq;
    using System.Web.Mvc;

    public class HomeController : Controller
    {
        [Inject]
        private readonly IBannersServices banners;

        public HomeController(IBannersServices banners)
        {
            this.banners = banners;
        }
        
        public ActionResult Index()
        {
            Globals.ProtocolHostPort = Request.Url.GetLeftPart(System.UriPartial.Authority);

            var randomItems = banners.GetRandomBanners(Globals.MinHomePageItemsCount)
                                     .ToViewModels()
                                     .ToList();

            return View(randomItems);
        }

        public ActionResult PopulateDb()
        {
            DbConfig.SeedSampleData(new Data.Models.BannersAppDbContext());

            return RedirectToAction("All", "Banners");
        }

        public ActionResult RemoveTempData()
        {
            Array.ForEach(Directory.GetFiles(Globals.TempImagesFolder), System.IO.File.Delete);
            
            return RedirectToAction("Index");
        }

        // lazy exception handler
        protected override void OnException(ExceptionContext filterContext)
        {
            this.View("Error", new HandleErrorInfo(filterContext.Exception, "", ""));
        }
    }
}
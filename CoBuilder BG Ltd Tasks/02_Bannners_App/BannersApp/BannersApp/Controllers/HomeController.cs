namespace BannersApp.Controllers
{
    using Data.Interfaces;
    using Data.Services;
    using Helpers;
    using System.Linq;
    using System.Web.Mvc;

    public class HomeController : Controller
    {
        private readonly IBannersServices banners;

        public HomeController(IBannersServices banners)
        {
            this.banners = banners;
        }

        public HomeController()
            : this(new BannersServices())
        {
        }

        public ActionResult Index()
        {
            var randomItems = banners.GetRandomBanners(3)
                                     .ToList()
                                     .ToViewModels();

            return View(randomItems);
        }

    }
}
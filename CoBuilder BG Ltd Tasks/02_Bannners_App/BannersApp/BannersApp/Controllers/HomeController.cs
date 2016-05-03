namespace BannersApp.Controllers
{
    using Data.Interfaces;
    using Data.Services;
    using Helpers;
    using System;
    using System.Collections.Specialized;
    using System.IO;
    using System.Linq;
    using System.Net;
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
            Constants.ProtocolHostPort = Request.Url.GetLeftPart(System.UriPartial.Authority);

            var randomItems = banners.GetRandomBanners(3)
                                     .ToList()
                                     .ToViewModels();

            return View(randomItems);
        }

        [ChildActionOnly]
        public ActionResult PopulateDb()
        {
            string[] samplePicsPaths = Directory.GetFiles($"{Server.MapPath(Constants.TempResoursesStorageFolder)}/samples");

            int number = 0;
            foreach (string path in samplePicsPaths)
            {
                //byte[] bytes = File.ReadAllBytes(path);
                //var img = Image.FromFile(path);
                using (var wb = new WebClient())
                {
                    var data = new NameValueCollection();
                    data["Name"] = $"Sample Banner {++number}";
                    
                    data["validFrom"] = DateTime.UtcNow.ToString();
                    data["validTo"] = DateTime.UtcNow.AddDays((double)number).ToString();
                    //wb.UploadFile(address, filePath);

                    wb.UploadValues("http://localhost:6517/Banners/Create", "POST", data);

                }
            }
            return RedirectToAction("All");
        }
    }
}
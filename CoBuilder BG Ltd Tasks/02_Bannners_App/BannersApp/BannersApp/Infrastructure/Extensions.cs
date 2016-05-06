namespace BannersApp.Infrastructure
{
    using Data.Models;
    using Models;

    using System;
    using System.Collections.Generic;
    using System.Drawing;
    using System.IO;
    using System.Linq;
    using System.Web;

    public static class Extensions
    {
        public static IQueryable<BannerViewModel> ToViewModels(this IQueryable<Banner> banners)
        {
            var models = new List<BannerViewModel>();
            var bannersList = banners.ToList();

            for (int i = 0; i < bannersList.Count; i++)
            {
                var viewModel = bannersList[i].ToViewModel();
                models.Add(viewModel);
            }

            return models.AsQueryable();
        }

        public static BannerViewModel ToViewModel(this Banner banner)
        {
            BannerViewModel vm = new BannerViewModel()
            {
                Id = banner.Id,
                Name = banner.Name,
                ValidFrom = banner.ValidFrom,
                ValidTo = banner.ValidTo,
                IsActive = banner.ValidTo > DateTime.Now
            };

            var fileName = banner.Picture.Name;
            var path = Path.Combine(HttpContext.Current.Server.MapPath(Constants.TempResoursesStorageFolder), fileName);

            if (!File.Exists(path))
            {
                SaveImageToFile(banner, path);
            }

            string pathToFolder = Constants.TempResoursesStorageFolder.Replace("~", "");
            vm.ImageAddress = $"{Constants.ProtocolHostPort}{pathToFolder}{fileName}";

            return vm;
        }

        private static void SaveImageToFile(Banner banner, string path)
        {
            using (var ms = new MemoryStream(banner.Picture.Data))
            {
                var img =  Image.FromStream(ms);
                img.Save(path);
            }
        }
    }
}
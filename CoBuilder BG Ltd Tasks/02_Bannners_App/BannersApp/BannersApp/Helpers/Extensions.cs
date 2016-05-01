namespace BannersApp.Helpers
{
    using Data.Models;
    using Models;
    using System;
    using System.Collections.Generic;
    using System.Drawing;
    using System.Drawing.Imaging;
    using System.IO;
    using System.Web;

    public static class Extensions
    {
        public static IList<BannerViewModel> ToViewModels(this IList<Banner> banners)
        {
            IList<BannerViewModel> models = new List<BannerViewModel>();

            for (int i = 0; i < banners.Count; i++)
            {
                var viewModel = banners[i].ToViewModel();
                models.Add(viewModel);
            }

            return models;
        }

        public static BannerViewModel ToViewModel(this Banner banner)
        {
            BannerViewModel vm = new BannerViewModel()
            {
                Id = banner.Id,
                Name = banner.Name,
                ValidFrom = banner.ValidFrom,
                ValidTo = banner.ValidTo
            };

            var fileName = banner.Picture.Name;
            var path = Path.Combine(HttpContext.Current.Server.MapPath(Constants.TempResoursesStorageFolder), fileName);

            if (!File.Exists(path))
            {
                SaveImageToFile(banner, path);
            }

            vm.ImageAddress = path;
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
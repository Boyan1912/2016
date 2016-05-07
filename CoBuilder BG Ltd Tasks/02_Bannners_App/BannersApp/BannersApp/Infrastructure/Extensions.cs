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
            var bannersList = banners.ToArray();

            for (int i = 0; i < bannersList.Length; i++)
            {
                var viewModel = bannersList[i].ToViewModel();
                models.Add(viewModel);
            }

            return models.AsQueryable();
        }

        public static IQueryable<T> ForEach<T>(this IQueryable<T> elements, Action<T>  action)
        {
            foreach (var el in elements)
            {
                action(el);
            }

            return elements;
        }

        public static BannerViewModel ToViewModel(this Banner banner)
        {
            if (banner == null)
            {
                throw new NullReferenceException("to view model");
            }

            BannerViewModel vm = new BannerViewModel()
            {
                Id = banner.Id,
                Name = banner.Name,
                ValidFrom = banner.ValidFrom,
                ValidTo = banner.ValidTo,
                IsActive = new Random().Next(1, 3) > 1
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
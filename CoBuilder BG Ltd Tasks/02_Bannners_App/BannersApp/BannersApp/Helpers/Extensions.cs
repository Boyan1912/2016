namespace BannersApp.Helpers
{
    using Data.Models;
    using Models;
    using System.Collections.Generic;
    using System.Drawing;
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
                Name = banner.Name,
                ValidFrom = banner.ValidFrom,
                ValidTo = banner.ValidTo
            };

            var fileName = banner.Picture.Name;
            var path = Path.Combine(HttpContext.Current.Server.MapPath(Constants.TempResoursesStorageFolder), fileName);
            banner.Picture.Data.ToImage().Save(path);

            vm.ImageAddress = path;
            
            return vm;
        }

        public static Image ToImage(this byte[] arr)
        {
            MemoryStream ms = new MemoryStream(arr);
            Image returnImage = Image.FromStream(ms, true);
            return returnImage;
        }
    }
}
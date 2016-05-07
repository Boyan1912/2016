using System.IO;

namespace BannersApp.Infrastructure
{
    public static class Globals
    {
        public static readonly string TempResoursesStorageFolder = "~/App_Data/Images/";
        public static string ProtocolHostPort;
        public static readonly string TempImagesFolder = $"{System.Web.HttpContext.Current.Server.MapPath(TempResoursesStorageFolder)}";
        public static readonly string SampleDataFolder = $"{System.Web.HttpContext.Current.Server.MapPath(TempResoursesStorageFolder)}samples";

        public const int MinHomePageItemsCount = 10;
        public const int MaxRandomItemsCount = 5;
        public const int AllItemsPageSize = 10;
        public const int BannerActivityInMiliseconds = 10 * 1000;
        
        public static readonly string ErrorsPageBgImage = "../../../Content/images/phelps-stupid-face.jpg";
        public static readonly string[] AcceptableImageFormats = new string[] { ".jpg", ".png", ".gif", ".jpeg", ".bmp", ".tif", ".eps" };

        public const string NotAnImageErrorMessage = "File must be of image type!";
    }
}
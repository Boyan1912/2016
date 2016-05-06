namespace BannersApp.Infrastructure
{
    public static class Constants
    {
        public static string TempResoursesStorageFolder = "~/App_Data/Images/";
        public static string ProtocolHostPort;
        public const int MaxRandomItemsCount = 5;
        public const int AllItemsPageSize = 10;
        public const int BannerActivityInMiliseconds = 10 * 1000;

        public static readonly string[] AcceptableImageFormats = new string[] { ".jpg", ".png", ".gif", ".jpeg", ".bmp", ".tif", "eps" };
        public const string NotAnImageErrorMessage = "File must be of image type!";
    }
}
namespace BannersApp.Infrastructure
{
    using Data.Models;
    using System;
    using System.IO;
    using System.Linq;
    using System.Web;

    public class BannerViewModelServices
    {



        public bool IsImage(HttpPostedFileBase file)
        {
            if (file == null)
            {
                return false;
            }

            if (file.ContentType.Contains("image"))
            {
                return true;
            }

            return Constants.AcceptableImageFormats.Any(item => file.FileName
                                                                    .ToLower()
                                                                    .EndsWith(item, StringComparison.OrdinalIgnoreCase));
        }


        public Picture MakeDbPictureFromFile(HttpPostedFileBase file)
        {
            Picture picture = new Picture();

            picture.Name = file.FileName;
            picture.ContentType = file.ContentType;

            using (Stream inputStream = file.InputStream)
            {
                MemoryStream memoryStream = inputStream as MemoryStream;
                if (memoryStream == null)
                {
                    memoryStream = new MemoryStream();
                    inputStream.CopyTo(memoryStream);
                }
                picture.Data = memoryStream.ToArray();
            }

            return picture;
        }
        
    }
}
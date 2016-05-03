namespace BannersApp.Data.Migrations
{
    using Models;
    using System;
    using System.Collections.Specialized;
    using System.Data.Entity.Migrations;
    using System.Drawing;
    using System.IO;
    using System.Linq;
    using System.Net;
    public sealed class Configuration : DbMigrationsConfiguration<BannersAppDbContext>
    {
        public Configuration()
        {
            this.AutomaticMigrationsEnabled = true;
            this.AutomaticMigrationDataLossAllowed = true;
        }

        protected override void Seed(BannersAppDbContext context)
        {

            //string[] samplePicsPaths = Directory.GetFiles(@"E:\2016\CoBuilder BG Ltd Tasks\02_Bannners_App\BannersApp\BannersApp\App_Data\Images\samples");

            //int number = 0;
            //foreach (string path in samplePicsPaths)
            //{
            //    //byte[] bytes = File.ReadAllBytes(path);
            //    //var img = Image.FromFile(path);
            //    using (var wb = new WebClient())
            //    {
            //        var data = new NameValueCollection();
            //        data["Name"] = $"Sample Banner {++number}";
            //        data["picture"] = path;
            //        data["validFrom"] = DateTime.UtcNow.ToString();
            //        data["validTo"] = DateTime.UtcNow.AddDays((double)number).ToString();
            //        wb.UploadValues("http://localhost:6517/Banners/Create", "POST", data);

            //    }

            //}

            //if (context.Banners.Any())
            //{
            //}
        }
    }
}

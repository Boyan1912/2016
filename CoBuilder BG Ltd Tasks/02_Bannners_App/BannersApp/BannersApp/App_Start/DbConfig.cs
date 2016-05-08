namespace BannersApp.App_Start
{
    using Data.Models;
    using Infrastructure;

    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using System.IO;

    public class DbConfig
    {
        public static void Initialize()
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<BannersAppDbContext, Configuration >());
            BannersAppDbContext.Create().Database.Initialize(true);
        }

        public static void SeedSampleData(BannersAppDbContext context)
        {
            string[] samplePicsPaths = Directory.GetFiles(Globals.SampleDataFolder);

            var random = new Random();

            for (int i = 0; i < samplePicsPaths.Length; i++)
            {
                string path = samplePicsPaths[i];
                string extension = path.Substring(path.LastIndexOf('.'));
                string type = extension == ".jpg" ? "jpeg" : extension.Replace(".", "");

                byte[] bytes = File.ReadAllBytes(path);
                Picture sampleImg = new Picture()
                {
                    Name = $"sample_img_{i + 1}{extension}",
                    ContentType = $"image/{type}",
                    Data = bytes
                };

                context.Pictures.Add(sampleImg);

                string randName = Path.GetRandomFileName();
                Banner sampleBanner = new Banner()
                {
                    Name = $"{randName} {i + 1}",
                    ValidFrom = DateTime.Now,
                    ValidTo = DateTime.Now.AddHours(random.Next(100 * 1000)),
                    Picture = sampleImg,
                };

                context.Banners.Add(sampleBanner);
            }

            context.SaveChanges();
        }
    }


    public sealed class Configuration : DbMigrationsConfiguration<BannersAppDbContext>
    {
        public Configuration()
        {
            this.AutomaticMigrationsEnabled = true;
            this.AutomaticMigrationDataLossAllowed = true;
        }

        protected override void Seed(BannersAppDbContext context)
        {
            //if (!context.Banners.Any())
            //{
            //string[] samplePicsPaths = Directory.GetFiles(Constants.SampleDataFolder);

            //var random = new Random();

            //for (int i = 0; i < samplePicsPaths.Length; i++)
            //{
            //    string path = samplePicsPaths[i];
            //    string extension = path.Substring(path.LastIndexOf('.'));

            //    byte[] bytes = File.ReadAllBytes(path);
            //    Picture sampleImg = new Picture()
            //    {
            //        Name = $"sample_img_{i + 1}",
            //        ContentType = $"image/{extension}",
            //        Data = bytes
            //    };

            //    context.Pictures.Add(sampleImg);

            //    string randName = Path.GetRandomFileName();
            //    Banner sampleBanner = new Banner()
            //    {
            //        Name = $"{randName} {i + 1}",
            //        ValidFrom = DateTime.Now,
            //        ValidTo = DateTime.Now.AddHours(random.Next()),
            //        Picture = sampleImg
            //    };

            //    context.Banners.Add(sampleBanner);
            //}

            //context.SaveChanges();
            //}
        }
    }
}
namespace BannersApp.App_Start
{
    using Data.Migrations;
    using Data.Models;
    using System.Data.Entity;

    public class DbConfig
    {
        public static void Initialize()
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<BannersAppDbContext, Configuration >());
            BannersAppDbContext.Create().Database.Initialize(true);
        }
    }

}
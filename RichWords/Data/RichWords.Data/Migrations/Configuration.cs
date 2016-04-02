namespace RichWords.Data.Migrations
{
    using System.Data.Entity.Migrations;
    using System.Linq;

    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;

    using Models;
    using RichWords.Common;
    using System;

    public sealed class Configuration : DbMigrationsConfiguration<ApplicationDbContext>
    {
        public Configuration()
        {
            this.AutomaticMigrationsEnabled = true;
            this.AutomaticMigrationDataLossAllowed = true;
        }

        protected override void Seed(ApplicationDbContext context)
        {
            //const string AdministratorUserName = "admin@richwords.com";
            //const string AdministratorPassword = "richwords";

            //if (!context.Roles.Any())
            //{
            //    // Create admin role
            //    var roleStore = new RoleStore<IdentityRole>(context);
            //    var roleManager = new RoleManager<IdentityRole>(roleStore);
            //    var role = new IdentityRole { Name = GlobalConstants.AdministratorRoleName };
            //    roleManager.Create(role);
            //    GlobalConstants.AdministratorId = role.Id;

            //    // Create admin user
            //    var userStore = new UserStore<ApplicationUser>(context);
            //    var userManager = new UserManager<ApplicationUser>(userStore);
            //    var user = new ApplicationUser { UserName = AdministratorUserName, Email = AdministratorUserName };
            //    userManager.Create(user, AdministratorPassword);

            //    // Assign user to admin role
            //    userManager.AddToRole(user.Id, GlobalConstants.AdministratorRoleName);
            //    Console.WriteLine("Admin added: id: " + user.Id);
            //    Console.WriteLine("Admin role id: " + role.Id);
            //}
        }
    }
}

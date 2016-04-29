namespace BannersApp.App_Start
{
    using BannersApp.Data.Interfaces;
    using BannersApp.Data.Models;
    using Data.Repositories;
    using Ninject;
    using Ninject.Extensions.Conventions;

    public class NinjectConfig
    {

        public static void Initialize()
        {
            IKernel kernel = new StandardKernel();
            RegisterServices(kernel);
        }

        private static void RegisterServices(IKernel kernel)
        {
            kernel.Bind(typeof(IBannersAppDbContext)).To(typeof(BannersAppDbContext));
            kernel.Bind(typeof(IRepository<>)).To(typeof(GenericRepository<>));

            //extension for I~Service to ~Service:
            kernel.Bind(b => b.From("BannersApp.Data") // name of assembly
                      .SelectAllClasses()
                      .BindDefaultInterface());
        }


    }
}
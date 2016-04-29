using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(BannersApp.Startup))]
namespace BannersApp
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}

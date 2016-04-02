using Microsoft.Owin;

using Owin;

[assembly: OwinStartupAttribute(typeof(RichWords.Web.Startup))]

namespace RichWords.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            this.ConfigureAuth(app);
        }
    }
}

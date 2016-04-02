namespace RichWords.Web.Areas.Administration.Controllers
{
    using System.Web.Mvc;

    using RichWords.Common;
    using RichWords.Web.Controllers;

    [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
    public class AdministrationController : BaseController
    {
    }
}

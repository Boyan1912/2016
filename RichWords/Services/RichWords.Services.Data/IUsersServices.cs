namespace RichWords.Services.Data
{
    using System.Linq;
    using RichWords.Data.Models;

    public interface IUsersServices
    {
        IQueryable<ApplicationUser> GetAll();

        ApplicationUser GetById(string id);

        //IQueryable<ApplicationUser> GetAdmins();

        ApplicationUser GetRandom();
    }
}

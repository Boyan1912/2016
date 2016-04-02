namespace RichWords.Data.Models.Contracts
{
    using System.Linq;

    public interface IUsersDbRepository
    {

        IQueryable<ApplicationUser> All();

        ApplicationUser GetById(string id);

        void Add(ApplicationUser entity);

        void Update(ApplicationUser entity);

        void HardDelete(ApplicationUser entity);

        void Save();
    }
}

namespace RichWords.Services.Data
{
    using System;
    using System.Linq;

    using RichWords.Data.Models;
    using RichWords.Data.Models.Contracts;
    using Web;

    public class UsersServices : IUsersServices
    {
        private readonly IUsersDbRepository users;
        private readonly IIdentifierProvider identifierProvider;

        public UsersServices(IUsersDbRepository users, IIdentifierProvider identifierProvider)
        {
            this.users = users;
            this.identifierProvider = identifierProvider;
        }

        public IQueryable<ApplicationUser> GetAll()
        {
            return this.users.All();
        }

        public ApplicationUser GetById(string id)
        {
            return this.GetById(id);
        }

        //public IQueryable<ApplicationUser> GetAdmins()
        //{
        //    return this.users.All().Where(x => x.Roles.Any());
        //}

        public ApplicationUser GetRandom()
        {
            return this.users.All().OrderBy(x => Guid.NewGuid()).FirstOrDefault();
        }
    }
}

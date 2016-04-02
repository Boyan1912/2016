namespace RichWords.Data.Models
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Linq;

    using Contracts;

    public class UsersDbRepository : IUsersDbRepository
    {
        public UsersDbRepository(DbContext context)
        {
            if (context == null)
            {
                throw new ArgumentException("An instance of DbContext is required to use this repository.", nameof(context));
            }

            this.Context = context;
            this.DbSet = this.Context.Set<ApplicationUser>();
        }

        private IDbSet<ApplicationUser> DbSet { get; }

        private DbContext Context { get; }

        public IQueryable<ApplicationUser> All()
        {
            return this.DbSet;
        }
        
        public ApplicationUser GetById(string id)
        {
            return this.All().FirstOrDefault(x => x.Id == id);
        }

        public void Add(ApplicationUser user)
        {
            this.DbSet.Add(user);
        }

        public void Update(ApplicationUser user)
        {

            DbEntityEntry entry = this.Context.Entry(user);
            if (entry.State == EntityState.Detached)
            {
                this.DbSet.Attach(user);
            }

            entry.State = EntityState.Modified;
        }
        
        public void HardDelete(ApplicationUser entity)
        {
            this.DbSet.Remove(entity);
        }

        public void Save()
        {
            this.Context.SaveChanges();
        }
    }
}

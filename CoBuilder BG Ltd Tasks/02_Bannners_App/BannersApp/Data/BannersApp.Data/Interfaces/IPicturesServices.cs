namespace BannersApp.Data.Interfaces
{
    using BannersApp.Data.Models;

    public interface IPicturesServices
    {
        void Add(Picture pic);

        void Delete(Picture pic);

        void Delete(int id);

        int SaveChanges();
    }
}

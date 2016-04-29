namespace BannersApp.Data.Interfaces
{
    using BannersApp.Data.Models;

    public interface IPicturesServices
    {
        void Add(Picture pic);

        int SaveChanges();
    }
}

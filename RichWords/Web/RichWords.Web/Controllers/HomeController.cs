namespace RichWords.Web.Controllers
{
    using System.Linq;
    using System.Web.Mvc;

    using Data.Models;
    using Infrastructure.Mapping;

    using Services.Data;

    using ViewModels.Home;

    public class HomeController : BaseController
    {
        private readonly IQuotesServices quotes;
        private readonly ICategoriesServices categories;

        public HomeController(
            IQuotesServices quotes,
            ICategoriesServices categories)
        {
            this.quotes = quotes;
            this.categories = categories;
        }

        public ActionResult Index()
        {
            var rndQuotes = this.quotes.GetAll().Take(10).To<QuoteViewModel>().ToList();
            var categories = this.categories.GetAll().To<CategoryViewModel>().ToList();
            this.Cache.Get(
                "quotes",
                () => this.quotes.GetAll().To<QuoteViewModel>().ToList(),
                30 * 60);
            var viewModel = new IndexViewModel
            {
                Quotes = rndQuotes,
                Categories = categories
            };

            return this.View(viewModel);
        }
    }
}

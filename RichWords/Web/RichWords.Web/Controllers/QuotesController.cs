namespace RichWords.Web.Controllers
{
    using System.Web.Mvc;

    using Data.Models;

    using RichWords.Services.Data;
    using RichWords.Web.Infrastructure.Mapping;
    using RichWords.Web.ViewModels.Home;
    
    public class QuotesController : BaseController
    {
        private readonly IQuotesServices quotes;

        public QuotesController(
            IQuotesServices quotes)
        {
            this.quotes = quotes;
        }

        public ActionResult ById(string id)
        {
            // TODO PARSER
            var quote = this.quotes.GetById(id);
            var viewModel = this.Mapper.Map<QuoteViewModel>(quote);
            return this.View(viewModel);
        }
    }
}

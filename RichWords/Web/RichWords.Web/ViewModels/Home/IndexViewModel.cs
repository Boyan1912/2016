namespace RichWords.Web.ViewModels.Home
{
    using System.Collections.Generic;

    public class IndexViewModel
    {
        public IEnumerable<QuoteViewModel> Quotes { get; set; }

        public IEnumerable<CategoryViewModel> Categories { get; set; }
    }
}

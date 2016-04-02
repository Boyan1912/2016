namespace RichWords.Web.ViewModels.Home
{
    using System.Linq;

    using AutoMapper;

    using RichWords.Data.Models;
    using RichWords.Services.Web;
    using RichWords.Web.Infrastructure.Mapping;

    public class QuoteViewModel : IMapFrom<Quote>, IHaveCustomMappings
    {
        public int Id { get; set; }

        public string Content { get; set; }

        public Category Category { get; set; }

        public string Url
        {
            get
            {
                IIdentifierProvider identifier = new IdentifierProvider();
                return $"/Quote/{identifier.EncodeId(this.Id)}";
            }
        }

        public void CreateMappings(IMapperConfiguration configuration)
        {
            //configuration.CreateMap<Quote, QuoteViewModel>()
            //    .ForMember(x => x.Category, opt => opt.MapFrom(x => x.Category.Name));
        }
    }
}

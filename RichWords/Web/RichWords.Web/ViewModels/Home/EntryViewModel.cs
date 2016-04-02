namespace RichWords.Web.ViewModels.Home
{
    using AutoMapper;
    using Data.Models.Contracts;
    using Infrastructure.Mapping;

    public class EntryViewModel : IMapFrom<IEntry>, IHaveCustomMappings
    {

        public int Id { get; set; }

        public string Content { get; set; }

        public string CreatorId { get; set; }

        public string CreatorsName { get; set; }

        public string VotesCount { get; set; }

        public int Rating { get; set; }

        public int Popularity { get; set; }

        public void CreateMappings(IMapperConfiguration configuration)
        {
            configuration.CreateMap<IEntry, EntryViewModel>()
                .ForMember(x => x.CreatorsName, opt => opt.MapFrom(x => x.Creator.UserName));
        }
    }
}
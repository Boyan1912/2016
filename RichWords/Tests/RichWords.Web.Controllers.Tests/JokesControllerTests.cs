namespace RichWords.Web.Controllers.Tests
{
    using Moq;

    using RichWords.Data.Models;
    using RichWords.Services.Data;
    using RichWords.Web.Infrastructure.Mapping;
    using RichWords.Web.ViewModels.Home;

    using NUnit.Framework;

    using TestStack.FluentMVCTesting;

    [TestFixture]
    public class JokesControllerTests
    {
        //[Test]
        //public void ByIdShouldWorkCorrectly()
        //{
        //    var autoMapperConfig = new AutoMapperConfig();
        //    autoMapperConfig.Execute(typeof(JokesController).Assembly);
        //    const string JokeContent = "SomeContent";
        //    var jokesServiceMock = new Mock<IJokesService>();
        //    jokesServiceMock.Setup(x => x.GetById(It.IsAny<string>()))
        //        .Returns(new Quote { Content = JokeContent, Categories = new QuoteCategory { Name = "asda" } });
        //    var controller = new JokesController(jokesServiceMock.Object);
        //    controller.WithCallTo(x => x.ById("asdasasd"))
        //        .ShouldRenderView("ById")
        //        .WithModel<JokeViewModel>(
        //            viewModel =>
        //                {
        //                    Assert.AreEqual(JokeContent, viewModel.Content);
        //                }).AndNoModelErrors();
        //}
    }
}

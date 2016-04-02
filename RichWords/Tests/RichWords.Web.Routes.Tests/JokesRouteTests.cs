//namespace RichWords.Web.Routes.Tests
//{
//    using System.Web.Routing;

//    using MvcRouteTester;

//    using RichWords.Web.Controllers;

//    using NUnit.Framework;

//    [TestFixture]
//    public class 
//        sRouteTests
//    {
//        [Test]
//        public void TestRouteById()
//        {
//            const string Url = "/Joke/Mjc2NS4xMjMxMjMxMzEyMw==";
//            var routeCollection = new RouteCollection();
//            RouteConfig.RegisterRoutes(routeCollection);
//            routeCollection.ShouldMap(Url).To<QuotesController>(c => c.ById("Mjc2NS4xMjMxMjMxMzEyMw=="));
//        }
//    }
//}

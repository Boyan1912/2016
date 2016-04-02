namespace Crawler
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;

    using AngleSharp;
    using RichWords.Common;
    using RichWords.Data;
    using RichWords.Data.Common;
    using RichWords.Data.Models;
    using RichWords.Services.Data;
    using RichWords.Services.Web;
    using AngleSharp.Dom;
    using System.Text;
    public class Program
    {
        private static ApplicationDbContext db = new ApplicationDbContext();
        private static DbRepository<Quote> quotesRepo = new DbRepository<Quote>(db);
        private static DbRepository<Author> authorsRepo = new DbRepository<Author>(db);
        private static DbRepository<Tag> tagsRepo = new DbRepository<Tag>(db);
        private static DbRepository<Like> likesRepo = new DbRepository<Like>(db);
        private static DbRepository<Category> categoriesRepo = new DbRepository<Category>(db);
        private static UsersDbRepository usersRepo = new UsersDbRepository(db);

        private static CategoriesServices categoriesService = new CategoriesServices(categoriesRepo, new IdentifierProvider());
        private static AuthorsServices authorsService = new AuthorsServices(authorsRepo, new IdentifierProvider());
        private static TagsServices tagsService = new TagsServices(tagsRepo, new IdentifierProvider());
        private static LikesServices likesService = new LikesServices(likesRepo, new IdentifierProvider());
        private static QuotesServices quotesService = new QuotesServices(quotesRepo, new IdentifierProvider());
        private static UsersServices usersService = new UsersServices(usersRepo, new IdentifierProvider());

        private static IConfiguration configuration = Configuration.Default.WithDefaultLoader();
        private static IBrowsingContext browsingContext = BrowsingContext.New(configuration);

        public static void Main()
        {
            AddAdminToDb();
            AddRandomUsers();
            var dataPerAuthor = GetQuotesAndCategoriesPerAuthorFromInternet();
            GetAuthorsDetailsFromInternet(dataPerAuthor);
        }

        private static void AddAdminToDb()
        {
            if (!db.Roles.Any())
            {
                // Create admin role
                var roleStore = new RoleStore<IdentityRole>(db);
                var roleManager = new RoleManager<IdentityRole>(roleStore);
                var role = new IdentityRole { Name = GlobalConstants.AdministratorRoleName };
                roleManager.Create(role);
                GlobalConstants.AdministratorId = role.Id;

                // Create admin user
                var userStore = new UserStore<ApplicationUser>(db);
                var userManager = new UserManager<ApplicationUser>(userStore);
                var user = new ApplicationUser { UserName = GlobalConstants.AdministratorUserName, Email = GlobalConstants.AdministratorUserName };
                userManager.Create(user, GlobalConstants.AdministratorPassword);

                // Assign user to admin role
                userManager.AddToRole(user.Id, GlobalConstants.AdministratorRoleName);
                Console.WriteLine("Admin added: id: " + user.Id);
                Console.WriteLine("Admin role id: " + role.Id);
            }
        }

        private static void AddRandomUsers()
        {
            Console.ForegroundColor = ConsoleColor.Cyan;

            if (usersService.GetAll().Count() < 50)
            {
                var configuration = Configuration.Default.WithDefaultLoader();
                var browsingContext = BrowsingContext.New(configuration);

                var url = "https://raw.githubusercontent.com/dominictarr/random-name/master/names.json";
                var document = browsingContext.OpenAsync(url).Result;

                var allNames = document.ToHtml().Split(new[] { '"', ',', '[', ']', ' ', '\n' }, StringSplitOptions.RemoveEmptyEntries);
                List<string> names = new List<string>();
                var rnd = new Random();
                for (int i = 0; i < 50; i++)
                {
                    int num = rnd.Next(0, allNames.Length);
                    names.Add(allNames[num].Trim());
                }

                foreach (string name in names)
                {
                    // Create simple role
                    var roleStore = new RoleStore<IdentityRole>(db);
                    var roleManager = new RoleManager<IdentityRole>(roleStore);
                    var role = new IdentityRole { Name = GlobalConstants.DefaultRoleName };
                    roleManager.Create(role);

                    // Create admin user
                    var userStore = new UserStore<ApplicationUser>(db);
                    var userManager = new UserManager<ApplicationUser>(userStore);
                    var user = new ApplicationUser { UserName = name, Email = $"{name}@richwords.com" };
                    userManager.Create(user, name);

                    // Assign user to admin role
                    try
                    {
                        userManager.AddToRole(user.Id, GlobalConstants.DefaultRoleName);
                        Console.WriteLine("User added: name: " + user.UserName);
                    }
                    catch (Exception ex)
                    {
                        Console.ForegroundColor = ConsoleColor.Red;
                        Console.WriteLine("Error adding random user: " + ex.Message);
                        Console.ForegroundColor = ConsoleColor.Cyan;
                    }
                }
            }
        }

        private static Dictionary<string, HashSet<string>> GetQuotesAndCategoriesPerAuthorFromInternet()
        {
            Console.ForegroundColor = ConsoleColor.Green;
            var configuration = Configuration.Default.WithDefaultLoader();
            var browsingContext = BrowsingContext.New(configuration);

            var url = "http://www.brainyquote.com/quotes/favorites.html";
            var document = browsingContext.OpenAsync(url).Result;
            var authorsNames = document.QuerySelectorAll(".bq_fl .bqLn a");

            // Add Categories
            for (int i = 1; i <= Enum.GetNames(typeof(CategoryName)).Length; i++)
            {
                string catName = ((CategoryName)i).ToString();
                if (categoriesService.GetByName(catName) == null)
                {
                    categoriesService.Create(catName);
                }
            }

            categoriesService.Save();
            Console.WriteLine("CATEGORIES ADDED OR PREVIOUSLY EXISTED");

            var quotesPerAuthor = new Dictionary<string, HashSet<string>>();

            for (int i = 9; i < authorsNames.Length; i++)
            {
                string name = authorsNames[i].TextContent.Trim();
                quotesPerAuthor[name] = new HashSet<string>();

                // Add Author to Db
                var authorFromDb = authorsService.GetByName(name);
                if (authorFromDb == null)
                {
                    authorsService.Create(name);
                    try
                    {
                        authorsService.Save();
                        Console.WriteLine($"AUTHOR ADDED: {name}");
                    }
                    catch(Exception ex)
                    {
                        Console.ForegroundColor = ConsoleColor.Red;
                        Console.WriteLine("Failed adding author to db! Reason: " + ex.Message);
                        Console.ForegroundColor = ConsoleColor.Green;
                        continue;
                    }
                }
                else
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine($"AUTHOR EXISTS: {authorFromDb.Name}");
                    Console.ForegroundColor = ConsoleColor.Green;
                }

                string startLetter = name[0].ToString().ToLower();
                string urlName = name.Replace(' ', '_');
                string quotesUrlByAuthor = $"http://www.brainyquote.com/quotes/authors/{startLetter}/{urlName}.html";

                for (int j = 1; j <= 5; j++)
                {
                    document = browsingContext.OpenAsync(quotesUrlByAuthor).Result;
                    var quotesAnckorElements = document.QuerySelectorAll(".boxyPaddingBig span.bqQuoteLink a");
                    var categoriesPerQuoteDiv = document.QuerySelectorAll(".bq_q_nav.boxyBottom.boxyPaddingSmall");

                    for (int k = 0; k < quotesAnckorElements.Length; k++)
                    {
                        bool quoteAddedtoDb = false;
                        string quote = quotesAnckorElements[k].TextContent.Trim();
                        quotesPerAuthor[name].Add(quote);

                        // Skip if no such page exists
                        if (categoriesPerQuoteDiv[k] == null)
                        {
                            continue;
                        }

                        var tagsForQuote = categoriesPerQuoteDiv[k].QuerySelectorAll("a");

                        // check if tag can be a category
                        int categId = GetCategoryFromTags(tagsForQuote);
                        int authorId = authorsService.GetByName(name).Id;
                        string userId = usersService.GetRandom().Id;

                        var nullChecker = quotesService.FindOneByContent(quote.Substring(1, quote.Length - 3));

                        // init quote for db
                        Quote newQuote;
                        if (nullChecker == null)
                        {
                            newQuote = new Quote
                            {
                                Content = quote,
                                AuthorId = authorId,
                                CreatorId = userId,
                                CategoryId = categId
                            };

                            GetRandomLikes(newQuote);
                            quotesService.Add(newQuote);
                            Console.WriteLine($"Quote rating: {newQuote.Likes.Sum(x => x.Value)}");
                            try
                            {
                                quotesService.Save();
                                string inkLink = newQuote.Content.Length < 20 ? newQuote.Content : newQuote.Content.Substring(0, 20);
                                Console.WriteLine($"QUOTE ADDED: {inkLink}...");
                                quoteAddedtoDb = true;
                            }
                            catch (Exception ex)
                            {
                                Console.ForegroundColor = ConsoleColor.Red;
                                Console.WriteLine("Failed to add quote to DB! Reason: " + ex.Message);
                                Console.ForegroundColor = ConsoleColor.Green;
                                quoteAddedtoDb = false;
                            }
                        }
                        else
                        {
                            newQuote = nullChecker;
                            Console.ForegroundColor = ConsoleColor.Red;
                            Console.WriteLine("Quote exists!!!!!!!!");
                            Console.ForegroundColor = ConsoleColor.Green;
                            quoteAddedtoDb = true;
                        }

                        if (quoteAddedtoDb)
                        {
                            // Add tags for quote
                            var quoteFromDb = quotesService.FindOneByContent(newQuote.Content.Substring(1, newQuote.Content.Length / 2));
                            foreach (var tag in tagsForQuote)
                            {
                                var newTag = new Tag
                                {
                                    Name = tag.TextContent.Trim(),
                                    QuoteId = quoteFromDb.Id
                                };
                                // Add Tags to Db
                                bool tagExists = tagsService.GetAll().Any(t => t.Name == newTag.Name);
                                if (!tagExists)
                                {
                                    tagsService.Add(newTag);
                                    tagsService.Save();
                                    Console.WriteLine($"TAG ADDED: {newTag.Name}");
                                }
                            }
                        }
                    }

                    quotesUrlByAuthor = $"http://www.brainyquote.com/quotes/authors/{startLetter}/{urlName}_{j + 1}.html";
                }
            }
            return quotesPerAuthor;
        }

        private static int GetCategoryFromTags(IHtmlCollection<IElement> tagsForQuote)
        {
            foreach (var tag in tagsForQuote)
            {
                string tagName = tag.TextContent.Trim();
                var category = categoriesService.GetByName(tagName);
                if (category != null)
                {
                    return category.Id;
                }
            }

            return categoriesService.GetByName("others").Id;
        }

        private static void GetAuthorsDetailsFromInternet(Dictionary<string, HashSet<string>> quotesPerAuthor)
        {
            // Get Person's info details from google and wikipedia
            foreach (KeyValuePair<string, HashSet<string>> author in quotesPerAuthor)
            {
                string name = author.Key;
                var authorInfoUrl = $"https://www.google.bg/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q={name}";

                var document = browsingContext.OpenAsync(authorInfoUrl).Result;
                var birthDateArgs = document.QuerySelectorAll("#rhs_block ._Xbe.kno-fv")[0].TextContent.Split(',');
                // Place Of Birth (Town or Country)
                birthDateArgs[birthDateArgs.Length - 1] = null;

                var deathDateArgs = document.QuerySelectorAll("#rhs_block ._Xbe.kno-fv")[1].TextContent.Split(',');

                // Place Of Birth (Town or Country)
                birthDateArgs[birthDateArgs.Length - 1] = null;
                // Place Of Death if dead (Town or Country)
                deathDateArgs[deathDateArgs.Length - 1] = null;

                var birthDate = DataParser.ParseStringToDateTime(string.Join(" ", birthDateArgs));
                var deathDate = DataParser.ParseStringToDateTime(string.Join(" ", deathDateArgs));

                var occupation = document.QuerySelector("#rhs_block span").TextContent.Trim();

                var description = document.QuerySelector("#rhs_block .kno-rdesc span").TextContent.Trim();
                var nationality = GetNationalityFromGoogleSummary(description);

                var wikipediaSummaryUrl = $"https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles={name}";

                string personSummary = browsingContext.OpenAsync(authorInfoUrl).Result.TextContent;
                string startText = "\"extract\":";
                int indexStartSummary = personSummary.IndexOf(startText);
                string summary = personSummary.Substring(indexStartSummary + startText.Length + 1).Trim(new[] { '}', '{', ' ' });
                var authorToUpdate = authorsService.GetByName(name);

                authorsService.Update(authorToUpdate, null, summary, birthDate, deathDate, occupation, nationality);
                authorsService.Save();
                Console.WriteLine("AUTHOR UPDATED");
            }
        }

        private static string GetNationalityFromGoogleSummary(string description)
        {
            int indexEndFirstSentence = description.IndexOf('.');

            string startWord = " was a";

            if (description.IndexOf(startWord) < 0 || description.IndexOf(startWord) > indexEndFirstSentence)
            {
                startWord = " is a";
            }

            if (description.IndexOf(startWord) < 0 || description.IndexOf(startWord) > indexEndFirstSentence)
            {
                return null;
            }

            int startIndex = description.IndexOf(startWord) + startWord.Length + 1;
            var result = description.Substring(startIndex, description.IndexOf(' ', startIndex)).Trim();

            return result;
        }

        private static void GetRandomLikes(Quote quote)
        {
            var rnd = new Random();
            int countVotes = rnd.Next(100);

            for (int i = 0; i < countVotes; i++)
            {
                string userId = usersService.GetRandom().Id;
                quote.Likes.Add(new Like
                {
                    Value = rnd.Next(-1, 2),
                    QuoteId = quote.Id,
                    UserId = userId
                });
            }

        }
    }
}

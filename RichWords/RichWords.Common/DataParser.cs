namespace RichWords.Common
{
    using System;
    using System.Globalization;
    public class DataParser
    {

        public static DateTime? ParseStringToDateTime(string input)
        {
            DateTime? parsedData;

            try
            {
                parsedData = DateTime.Parse(input);
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("String to DateTime parse failed: " + ex.Message);
                parsedData = null;
            }

            return parsedData;
        }

        public static DateTime? ParseStringToDateTime(string month, string day, string year)
        {
            CultureInfo provider = CultureInfo.InvariantCulture;
            string stringDate = string.Join(" ", day, month, year);
            try
            {
                var date = DateTime.ParseExact(stringDate, "dd MMMM YYYY", provider);
                Console.WriteLine("Birth date successfully parsed.");
                return date;
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("String to DateTime parse failed: " + ex.Message);
                return null;
            }
        }
    }
}

namespace RichWords.Common
{
    using System;

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
    }
}

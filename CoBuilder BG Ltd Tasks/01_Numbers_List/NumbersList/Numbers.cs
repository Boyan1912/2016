namespace NumbersList
{
    using System;
    using System.Collections.Generic;
    
    public class Numbers
    {
        static void Main(string[] args)
        {
            IList<int> numbers = GetRandomNumbers(100, -100, 100);

            Console.WriteLine("Initial list:");
            PrintList(numbers);

            RemoveNegativeValues(numbers);
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("Negative valuues cleared:");
            PrintList(numbers);
            Console.ForegroundColor = ConsoleColor.Gray;
        }

        public static void RemoveNegativeValues(IList<int> numbers)
        {
            for (int i = 0; i < numbers.Count; i++)
            {
                int number = numbers[i];
                if (number <= 0)
                {
                    numbers.RemoveAt(i);
                    RemoveNegativeValues(numbers);
                }
            }
        }
        
        static void PrintList(IList<int> numbers)
        {
            if (numbers.Count < 1)
            {
                Console.Write("The list is empty!");
            }
            foreach (int number in numbers)
            {
                Console.Write(number + " ");
            }
            Console.WriteLine("\n");
        }

        public static IList<int> GetRandomNumbers(int count = 50, int min = int.MinValue, int max = int.MaxValue)
        {
            List<int> list = new List<int>();
            Random rnd = new Random();
            for (int i = 0; i < count; i++)
            {
                int num = rnd.Next(min, max);
                list.Add(num);
            }

            return list;
        }
    }
}

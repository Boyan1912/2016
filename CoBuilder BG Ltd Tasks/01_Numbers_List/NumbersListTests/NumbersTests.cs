namespace NumbersList.Tests
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;

    [TestClass()]
    public class NumbersTests
    {
        [TestMethod()]
        public void TestIfOnlyPositiveNumbersRemainWithMixedData()
        {
            IList<int> numbers = Numbers.GetRandomNumbers();
            Numbers.RemoveNegativeValues(numbers);
            foreach (int num in numbers)
            {
                Assert.IsTrue(num > 0);
            }
        }

        [TestMethod()]
        public void TestIfOnlyPositiveNumbersRemainWithPositiveNumbersOnly()
        {
            IList<int> numbers = Numbers.GetRandomNumbers(min: 1);
            int length = numbers.Count;
            Numbers.RemoveNegativeValues(numbers);

            Assert.AreEqual(length, numbers.Count);
            foreach (int num in numbers)
            {
                Assert.IsTrue(num > 0);
            }
        }

        [TestMethod()]
        public void TestIfListIsEmptyWithNegativeNumbersOnly()
        {
            IList<int> numbers = Numbers.GetRandomNumbers(max: 1);
            Numbers.RemoveNegativeValues(numbers);

            Assert.AreEqual(numbers.Count, 0);
        }

        [TestMethod()]
        public void TestIfListIsEmptyWithEmptyList()
        {
            IList<int> numbers = new List<int>();
            Numbers.RemoveNegativeValues(numbers);

            Assert.AreEqual(numbers.Count, 0);
        }

        [TestMethod()]
        public void TestIfListIsEmptyWithOnlyZerosList()
        {
            IList<int> numbers = Numbers.GetRandomNumbers(min: 0, max: 1);
            Numbers.RemoveNegativeValues(numbers);

            Assert.AreEqual(numbers.Count, 0);
        }

        [TestMethod()]
        public void TestIfOnlyOnesRemainFromBitsArray()
        {
            IList<int> numbers = Numbers.GetRandomNumbers(min: 0, max: 2);
            Numbers.RemoveNegativeValues(numbers);

            foreach (int num in numbers)
            {
                Assert.IsTrue(num == 1);
            }
        }
    }
}
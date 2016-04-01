namespace AppLog_Csharp.Helpers
{
    using appLog_Csharp;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Windows.Forms;

    public class Printer : IPrinter
    {
        private const string SuccessMessage = " executed successfully!";
        private const string FailureMessage = " failed!";
        private readonly string format = "{0}: {1}{2}" + Environment.NewLine;
        private static string devider = new string('-', 30);
        private TextBoxBase messageBox;

        public Printer(TextBoxBase messageBox)
        {
            this.MessageBox = messageBox;
        }
        
        public TextBoxBase MessageBox
        {
            get { return this.messageBox; }
            set { this.messageBox = value; }
        }

        public void PrintSuccess(string description, LogData logData = null)
        {
            this.PrintLogDataIfExists(logData);
            this.MessageBox.ForeColor = System.Drawing.Color.Green;
            this.MessageBox.SelectionStart = 0;
            this.MessageBox.AppendText(description.ToUpper() + SuccessMessage + Environment.NewLine);
        }

        public void PrintFailure(string description, LogData logData = null)
        {
            this.PrintLogDataIfExists(logData);
            this.MessageBox.ForeColor = System.Drawing.Color.Red;
            this.MessageBox.SelectionStart = 0;
            this.MessageBox.AppendText(string.Format(this.format, description.ToUpper() + FailureMessage, devider));
        }

        public void PrintFailure(string description, Exception exception, LogData logData = null)
        {
            this.PrintLogDataIfExists(logData);
            this.MessageBox.ForeColor = System.Drawing.Color.Red;
            this.MessageBox.SelectionStart = 0;
            this.MessageBox.AppendText(string.Format("{0}{1}; {2}: {3}, {4}: {5}; {6}: {7};", description.ToUpper(), FailureMessage, "REASON", exception.Message, "SOURCE", exception.Source, "STACK TRACE:", exception.StackTrace + Environment.NewLine));
        }

        public void PrintFullException(Exception ex, LogData logData = null)
        {
            this.MessageBox.Parent.ForeColor = System.Drawing.Color.Red;
            this.MessageBox.SelectionStart = 0;

            if (logData != null)
            {
                try
                {
                    var customException = new appLogException(logData.Class, logData.Method, ex);
                    this.MessageBox.AppendText(customException.ToString() + Environment.NewLine);
                }
                catch(Exception inner)
                {
                    this.PrintFailure(inner.Message + Environment.NewLine);
                }
            }
            else
            {
                this.MessageBox.AppendText(string.Format("{0}: {1}; {2}: {3}, {4}: {5};", "REASON", ex.Message, "SOURCE", ex.Source, "STACK TRACE:", ex.StackTrace + Environment.NewLine));
            }
        }

        private void PrintLogDataIfExists(LogData data)
        {
            if (data != null)
            {
                this.PrintStaticDataIfExists(data.StaticData);
                try
                {
                    this.MessageBox.AppendText(string.Format("{0}: {1}", "Class Name", data.Class) + Environment.NewLine);
                    this.MessageBox.AppendText(string.Format("{0}: {1}", "Method", data.Method) + Environment.NewLine);
                    this.MessageBox.AppendText(string.Format("{0}: {1}", "Description", data.Description) + Environment.NewLine);
                    this.MessageBox.AppendText(string.Format("{0}: {1}", "Date", data.DateTime) + Environment.NewLine);
                }
                catch(Exception ex)
                {
                    this.PrintFailure("Print log data", ex);
                }
            }
        }

        private void PrintStaticDataIfExists(Dictionary<DataColumn, object> data)
        {
            if (data != null)
            {
                try
                {
                    foreach (var column in data.Keys)
                    {
                        this.MessageBox.AppendText(string.Format("{0}: {1}", "Column", column.ColumnName) + "  |  " + string.Format("{0}: {1}", "Value", data[column].ToString()) + "  |  ");
                    }
                }
                catch (Exception ex)
                {
                    this.PrintFailure("Print static data", ex);
                }
            }
        }
    }
}

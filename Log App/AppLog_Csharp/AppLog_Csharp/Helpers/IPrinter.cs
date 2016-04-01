namespace AppLog_Csharp.Helpers
{
    using System;
    using appLog_Csharp;
    using System.Windows.Forms;

    public interface IPrinter
    {
        TextBoxBase MessageBox { get; set; }

        void PrintSuccess(string description, LogData logData = null);

        void PrintFailure(string description, LogData logData = null);

        void PrintFailure(string description, Exception exception, LogData logData = null);

        void PrintFullException(Exception ex, LogData logData = null);
    }
}

namespace appLog_Csharp
{
    using System;
    using System.Data;

    public interface IWriter
    {
        void Write(LogData data);

        int Shrink(int recordsToSave);

        DataTable GetDataToSync(bool allLogs, DateTime beginDate, DateTime endDate);

        int SetDataSync(ref DataTable logTable);

        string WorkingFolder { get; }

        void Split(string archiveFileName);

        void Close();
    }
}

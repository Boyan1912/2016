namespace AppLog_Csharp.Helpers
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using appLog_Csharp;

    public interface IActionTracer
    {
        IPrinter Printer { get; set; }

        Dictionary<DataColumn, object> StaticFields { get; set; }

        Exception Exception { get; set; }

        LogData LogData { get; set; }

        void SetUpDbConnection();

        void CreateSqlWriter();

        void CreateLog();

        void TraceAction(Action action, string description);

        void TraceAction<T>(string description, Action<T> action, params T[] obj);

        void TraceCreateGenericObject<K, T>(string description, Func<K, T> action, K param, T objToSet);

        void TraceCreateGenericObjectWithoutParams<T>(string description, Func<T> action, T objToSet);
        
        void GetInitialStaticData(int logId, string userId, string description);

        LogData CreateLogData(params string[] data);
    }
}

namespace AppLog_Csharp.Helpers
{
    using appLog_Csharp;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using System.Windows.Forms;

    public class ActionTracer : IActionTracer
    {
        private Dictionary<DataColumn, object> staticFields;
        private IPrinter printer;
        private LogData logData;

        public ActionTracer(IPrinter printer)
        {
            this.Printer = printer;
            Func<TextBoxBase, Printer> initPrinter = x => new Printer(x);
            this.TraceCreateGenericObject("Initialize Printer", initPrinter, null, this.Printer);

            this.StaticFields = new Dictionary<DataColumn, object>();
            Func<Dictionary<DataColumn, object>> initStaticDataFields = () => new Dictionary<DataColumn, object>();
            this.TraceCreateGenericObjectWithoutParams("Initialize Static Data", initStaticDataFields, this.StaticFields);

            Func<string[], appLogException> initCustomException = arr => new appLogException(arr[0], arr[1], arr[2]);
            this.TraceCreateGenericObjectMultipleParams("Initialize Custom Exception", initCustomException, this.Exception ,new[] { this.GetType().Name, "TraceCreateGenericObjectMultipleParams", "init custom exception" });

            this.Printer.PrintSuccess("Initialize Action Tracer");
        }

        public IPrinter Printer
        {
            get
            {
                return this.printer;
            }
            set
            {
                this.printer = value;
            }
        }

        public LogData LogData { get { return this.logData; } set { this.logData = value; } }

        public Dictionary<DataColumn, object> StaticFields
        {
            get
            {
                return this.staticFields;
            }
            set
            {
                this.staticFields = value;
            }
        }
        
        public Exception Exception { get; set; }
        
        public void GetInitialStaticData(int logId, string userId, string description)
        {
            try
            {
                DataColumn logIdColumn = null;

                if(this.StaticFields != null)
                {
                    logIdColumn = this.StaticFields.Keys.FirstOrDefault(x => x.ColumnName == "LogID");
                }
                if (logIdColumn == null)
                {
                    logIdColumn = this.CreateDataColumn("LogID", typeof(int));
                    this.StaticFields.Add(logIdColumn, logId);
                }
                else
                {
                    this.StaticFields[logIdColumn] = logId;
                }

                var userIdColumn = this.StaticFields.Keys.FirstOrDefault(x => x.ColumnName == "UserID");
                if (userIdColumn == null)
                {
                    userIdColumn = this.CreateDataColumn("UserID", typeof(string));
                }
                userId = userId == null ? "N.A." : userId;
                this.StaticFields[userIdColumn] = userId;

                this.Printer.PrintSuccess(description);
            }
            catch(Exception ex)
            {
                this.Printer.PrintFailure(description, ex);
            }
        }

        public LogData CreateLogData(params string[] data)
        {
            Func<object[], LogData> action = info => new LogData((string)info[0], (string)info[1], (string)info[2]);
            var logData = this.TraceReturnTypeActionMultipleParams("Create Log Data item", action, data);
            logData.StaticData = this.StaticFields;
            logData.Exception = this.Exception;
            return logData;
        }
        
        public DataColumn CreateDataColumn(string name, Type type)
        {
            Func<object[], DataColumn> action = args => new DataColumn((string)args[0], (Type)args[1]);
            return this.TraceReturnTypeActionMultipleParams("Create a Data Column", action, new object[] { name, type });
        }

        public void CreateLog()
        {
                    
        }

        public void CreateSqlWriter()
        {
            throw new NotImplementedException();
        }

        public void SetUpDbConnection()
        {
            throw new NotImplementedException();
        }

        public T TraceReturnTypeActionMultipleParams<T>(string description, Func<object[], T> action, params object[] args)
        {
            T result = default(T);
            try
            {
                result = action(args);
                if (result == null) { throw new NoNullAllowedException("failed to map data"); }
                this.Printer.PrintSuccess(description);
            }
            catch(Exception ex)
            {
                this.Printer.PrintFailure(description, ex);
            }

            return result;
        }

        public T TraceReturnTypeAction<T>(Func<T> action, string description)
        {
            T result = default(T);
            try
            {
                result = action();
                if (result == null) { throw new NoNullAllowedException("failed to map data"); }
                this.Printer.PrintSuccess(description);
            }
            catch(Exception ex)
            {
                this.Printer.PrintFailure(description, ex);
            }

            return result;
        }

        public void TraceAction(Action action, string description)
        {
            try
            {
                action();
                this.Printer.PrintSuccess(description);
            }
            catch (Exception ex)
            {
                this.Printer.PrintFailure(description, ex);
            }
        }

        public void TraceAction<T>(string description, Action<T> action, params T[] obj)
        {
            foreach (T parameter in obj)
            {
                try
                {
                    action(parameter);
                    Printer.PrintSuccess(description);
                }
                catch (Exception ex)
                {
                    Printer.PrintFailure(description, ex);
                }
            }
        }

        public void TraceCreateGenericObjectWithoutParams<T>(string description, Func<T> action, T objToSet)
        {
            try
            {
                objToSet = action();
                if (objToSet == null) { throw new NoNullAllowedException("failed to map data"); }
                Printer.PrintSuccess(description);
            }
            catch (Exception ex)
            {
                Printer.PrintFailure(description, ex);
            }
        }

        public void TraceCreateGenericObject<K, T>(string description, Func<K, T> action, K param, T objToSet)
        {
            try
            {
                objToSet = objToSet == null ? action(param) : objToSet;
                if (objToSet == null) { throw new NoNullAllowedException("failed to map data"); }
                this.Printer.PrintSuccess(description);
            }
            catch (Exception ex)
            {
                this.Printer.PrintFailure(description, ex);
            }
        }

        public void TraceCreateGenericObjectMultipleParams<T, R>(string description, Func<T, R> action, R objToSet, params T[] args)
        {
            try
            {
                for (int i = 0; i < args.Length; i++)
                {
                    try
                    {
                        objToSet = action(args[i]);
                    }
                    catch (Exception ex)
                    {
                        this.Printer.PrintFailure($"{description} : {i + 1} attempt", ex);
                    }
                }
                if (objToSet != null) { this.Printer.PrintSuccess(description); }
                else { throw new InvalidCastException(); }
            }
            catch(Exception ex)
            {
                this.Printer.PrintFailure(description, ex);
            }
        }
    }
}

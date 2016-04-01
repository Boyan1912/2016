namespace appLog_Csharp
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SQLite;
    using System.Linq;
    using System.Reflection;
    
    public class Log
    {
        #region "appSql Proxy methods"

        private static string _LoggingTableName = "PDA_Log";
        private static Assembly _SqLiteAssembly;
        private static Assembly _MsSqlAssembly;
        private static List<Log> _Instances = new List<Log>();

        private IWriter _Writer;
        private Dictionary<DataColumn, object> _StaticData;
        private enmLogType _LogLevel;
        private enmLogType _eMailLevel;

        static Log()
        {
            SqLiteAssembly = typeof(SQLiteCommand).Assembly;
        }

        public Log(bool sqLiteLog, string param, Dictionary<DataColumn, object> staticData)
        {
            this._StaticData = staticData;

            if (sqLiteLog)
            {
                this._Writer = new SqLiteWriter(this, param);
            }
            else
            {
                this._Writer = new FileWriter(param);
            }

            this._LogLevel = enmLogType.UserAction;
            this._eMailLevel = enmLogType.None;
            lock (_Instances)
            {
                _Instances.Add(this);
            }
        }

        public Log(string connectionString, Dictionary<DataColumn, object> staticData = null)
        {
            if (staticData == null)
            {
                staticData = new Dictionary<DataColumn, object>();
            }
            this._StaticData = staticData;
            this._Writer = new MsSqlWriter(this, connectionString);

            this._LogLevel = enmLogType.UserAction;
            this._eMailLevel = enmLogType.None;

            lock (_Instances)
            {
                _Instances.Add(this);
            }
        }

        public static Assembly SqLiteAssembly
        {
            get { return _SqLiteAssembly; }
            set { _SqLiteAssembly = value; }
        }

        public static Assembly MsSqlAssembly
        {
            get { return _MsSqlAssembly; }
            set { _MsSqlAssembly = value; }
        }

        public static string LoggingTableName
        {
            get { return _LoggingTableName; }
            set { _LoggingTableName = value; }
        }

        #endregion

        public static Log[] RunnedInstances
        {
            get { return _Instances.ToArray(); }
        }

        public static bool SeparateFileForEachTypeOfRecord = true;

        public static string FileNameDateFormat = "yyyy.MM.dd HH_mm_ss_f";

        public enmLogType StringToEnmLogType(string setting, bool throwIfError)
        {
            switch (setting.Trim().ToUpper())
            {
                case "USERACTION":
                    return enmLogType.UserAction;
                case "ACTION":
                    return enmLogType.Action;
                case "WARNING":
                    return enmLogType.Warning;
                case "ERROR":
                    return enmLogType.Error;
                case "NONE":
                    return enmLogType.None;
                default:
                    if (throwIfError)
                    {
                        throw new Exception("Can't convert '" + setting + "' to enmLogType");
                    }
                    else
                    {
                        SysLogData vData = new SysLogData(this.GetType().Name, "StringToEnmLogType", new Exception("Cant convert '" + setting + "' to enmLogType"));
                        this.Writer.Write(vData);
                        return enmLogType.Error;
                    }
            }
        }

        public static enmLogType? StringToEnmLogType(string setting)
        {
            switch (setting.Trim().ToUpper())
            {
                case "USERACTION":
                    return enmLogType.UserAction;
                case "ACTION":
                    return enmLogType.Action;
                case "WARNING":
                    return enmLogType.Warning;
                case "ERROR":
                    return enmLogType.Error;
                case "NONE":
                    return enmLogType.None;
                default:
                    return null;
            }
        }

        public enmLogType LogLevel
        {
            get { return this._LogLevel; }
            set { this._LogLevel = value; }
        }

        public enmLogType eMailLevel
        {
            get { return _eMailLevel; }
            set
            {
                if (Environment.OSVersion.Platform == PlatformID.WinCE)
                {
                    SysLogData vErrData = new SysLogData(this.GetType().Name, "set_eMailLevel", new Exception("eMail log is not supported on Windows CE platform!"));
                    this.Writer.Write(vErrData);
                    //ElseIf _eMail Is Nothing Then
                    //    Dim vErrData As New SysLogData(Me.GetType.Name, "set_eMailLevel", New System.Exception("eMail log instance can't be created!"))
                    //    Write(vErrData)
                }
                else {
                    _eMailLevel = value;
                }
            }
        }

        public object StaticData
        {
            get { return this._StaticData; }
            set
            {
                try
                {
                    this._StaticData = (Dictionary<DataColumn, object>)value;
                }
                catch(Exception ex)
                {
                    var vErrData = new SysLogData(this.GetType().Name, "set_StaticData", ex);
                    this.Writer.Write(vErrData);
                }
            }
        }

        public IWriter Writer
        {
            get { return this._Writer; }
        }

        //Public ReadOnly Property eMail() As EMail
        //    Get
        //        Return _eMail
        //    End Get
        //End Property

        public void Write(LogData Data)
        {
            this.WriteWithoutEmail(Data);
            //If Not (Data.LogTypeCode < CInt(_eMailLevel)) AndAlso _eMail IsNot Nothing Then
            //    Data.StaticData = _StaticData
            //    _eMail.Write(Data)
            //End If
        }
        
        internal void WriteWithoutEmail(LogData Data)
        {
            if (!(Data.LogTypeCode < Convert.ToInt32(this._LogLevel)))
            {
                Data.StaticData = this._StaticData;
                this._Writer.Write(Data);
            }
        }

        public void UserAction(string inClass, string inMethod, string message)
        {
            LogData vData = new LogData(inClass, inMethod, message, true);
            this.Writer.Write(vData);
        }

        public void Action(string inClass, string inMethod, string message)
        {
            LogData vData = new LogData(inClass, inMethod, message, false);
            this.Writer.Write(vData);
        }

        public void Warning(string inClass, string inMethod, string message)
        {
            LogData vData = new LogData(inClass, inMethod, message);
            this.Writer.Write(vData);
        }

        public void Error(string inClass, string inMethod, Exception exception)
        {
            LogData vData = new LogData(inClass, inMethod, exception);
            this.Writer.Write(vData);
        }

        public void Exception(Exception exception)
        {
            if (exception.InnerException != null)
            {
                this.Exception(exception.InnerException);
            }

            appLogException vCustomException = appLogException.Convert(exception);
            string vStrClass = vCustomException["Class"];
            string vStrMethod = vCustomException["Method"];
            LogData vData = new LogData(vStrClass, vStrMethod, vCustomException.BaseException());
            this.Writer.Write(vData);
        }

        /// <summary>
        /// New File name used to rename Log.Db. If file already exist Split will not be performed
        /// </summary>
        /// <param name="archiveFileName"></param>
        /// <remarks></remarks>
        public void Split(string archiveFileName)
        {
            this.Writer.Split(archiveFileName);
        }

        public void Close()
        {
            //If _eMail IsNot Nothing Then
            //    _eMail.Close()
            //    _eMail = Nothing
            //End If
            if (this._Writer != null)
            {
                this._Writer.Close();
                this._Writer = null;
            }

            lock (_Instances)
            {
                _Instances.Remove(this);
            }
        }

        internal DataColumn[] StaticDataColumns
        {
            get
            {
                if (this._StaticData == null)
                {
                    return new DataColumn[0];
                    // Returns an empty array of datacolumn
                }
                else
                {
                    return this._StaticData.Keys.ToArray();
                }
            }
        }
    }
}

namespace appLog_Csharp
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.Common;
    using System.Data.SqlClient;
    using System.IO;
    using System.Linq;
    using System.Reflection;
    using System.Threading;
    
    public class MsSqlWriter : SqlWriter, IWriter
    {
        private const string DefaultConnectionString = "Data Source=.;Initial Catalog=LogAppDb;Integrated Security=true";
        private bool _Initialized;
        private Log _Log;
        //private SQL _Sql;
        private FileWriter _FileWriter;
        private List<LogData> _Queue;
        private ManualResetEvent _LogEvent;
        private Thread _Th;
        private Status _Status;
    
        private ManualResetEvent _PauseEvent;

        public MsSqlWriter(Log objLog, string connectionString)
        {
            if (Environment.OSVersion.Platform == PlatformID.WinCE)
            {
                throw new appLogException(this.GetType().FullName, "New(appLog.Log, String)", "Unsupported platform!", connectionString);
            }
            this._Log = objLog;
            this._LoggingTableName = Log.LoggingTableName;
            this._ConnectionString = connectionString != null ? connectionString : DefaultConnectionString;
            this._SqlConnection = new SqlConnection(this._ConnectionString);
            this.WorkingFolder = Path.GetDirectoryName(Assembly.GetExecutingAssembly().GetName().CodeBase);
            if (this.WorkingFolder.ToUpper().StartsWith("FILE:/"))
            {
                this.WorkingFolder = this.WorkingFolder.Substring(6);
            }
            
            this._PauseEvent = new ManualResetEvent(false);
            this._Status = new Status();
            this.Init();
        }

        private void Init()
        {
            this._Initialized = false;
            if (this._FileWriter == null)
            {
                this._FileWriter = new FileWriter(this.WorkingFolder);
            }
            try
            {
                this.CreateLogTable(this._LoggingTableName, this._Log.StaticDataColumns, new SqlCommand());
                
                if (this._InsertCmd != null)
                {
                    this._InsertCmd.Dispose();
                    this._InsertCmd = null;
                }
                this._InsertCmd = this.GetInsertCommand(this._Log.StaticDataColumns, new SqlCommand());

                if (this._Queue == null)
                {
                    this._Queue = new List<LogData>();
                }
                if (this._LogEvent == null)
                {
                    this._LogEvent = new ManualResetEvent(false);
                }
                if (this._Th == null)
                {
                    this._Th = new Thread(new ThreadStart(this.Writer));
                    this._Th.Start();
                }
                this._Initialized = true;
            }
            catch (Exception Ex)
            {
                this._FileWriter.Write(new SysLogData(this.GetType().FullName, "New", Ex));
                this._Initialized = false;
            }
        }
        
        private DbCommand GetInsertCommand(DataColumn[] DataColumns)
        {

            string vStrStaticFieldNames = this.GetInsertFieldNames(DataColumns);
            if (vStrStaticFieldNames == null || vStrStaticFieldNames.Length < 1)
            {
                vStrStaticFieldNames = " ";
            }

            var vParList = GetInsertParameters(DataColumns);

            DbCommand vInsertCmd = new SqlCommand("INSERT INTO " + _LoggingTableName + " (" + "[UID], " + "[Time], " + "[Category], " + "[Class], " + "[Function], " + "[Description], " + "[Sent]" + vStrStaticFieldNames.Replace("@", "") + ") VALUES (" + "@UID, " + "@Time, " + "@Category, " + "@Class, " + "@Function, " + "@Description, " + "@Sent" + vStrStaticFieldNames.Replace("[", "").Replace("]", "") + ");");

            vInsertCmd.Parameters.AddRange(this.GetInsertParameters(DataColumns).ToArray());

            return vInsertCmd;
        }

        public void Write(LogData data)
        {
            if (this._Initialized)
            {
                this._Queue.Add(data);
                this._LogEvent.Set();
            }
            else
            {
                if (data.LogTypeCode == Convert.ToInt32(enmLogType.Error))
                {
                    this._FileWriter.Write(data);
                }
            }
        }

        public int Shrink(int recordsToSave)
        {
            var selectCmd = new SqlCommand(string.Format("SELECT COUNT([UID]) AS TotalRecords FROM [{0}];"), this._SqlConnection as SqlConnection);
            int result = Convert.ToInt32(selectCmd.ExecuteScalar()) - recordsToSave;
            //int result = Convert.ToInt32(_Sql.Value(string.Format("SELECT COUNT([UID]) AS TotalRecords FROM [{0}];", this._LoggingTableName))) - recordsToSave;
            if (result > 0)
            {
                var deleteCmd = new SqlCommand(string.Format("DELETE FROM [{1}] WHERE UID IN (SELECT TOP({0}) [UID] FROM [{1}]);", result.ToString(), _LoggingTableName));
                result = deleteCmd.ExecuteNonQuery();
                //result = _Sql.Exec(string.Format("DELETE FROM [{1}] WHERE UID IN (SELECT TOP({0}) [UID] FROM [{1}]);", result.ToString, _LoggingTableName));
            }
            return result;
        }

        public DataTable GetDataToSync(bool allLogs, DateTime beginDate, DateTime endDate)
        {
            DbParameter[] vPar =
                    {
                        new SqlParameter("BeginDate", SqlDbType.Date),
                        new SqlParameter("EndDate", SqlDbType.Date)
                    };

            vPar[0].Value = beginDate;
            vPar[1].Value = endDate;

            string vSQLText = null;
            if (allLogs)
            {
                vSQLText = string.Format("SELECT * FROM [{0}] WHERE ([Sent]=0 AND [Time] BETWEEN @BeginDate AND @EndDate);", this._LoggingTableName);
            }
            else
            {
                vSQLText = "SELECT * FROM [{0}] WHERE ([Sent]=0 AND [Time] BETWEEN @BeginDate AND @EndDate AND [Category]='Error');";
            }

            var cmd = new SqlCommand(vSQLText);
            cmd.Parameters.AddRange(vPar);

            DataTable vResult = cmd.GetResultAsDataTable(this._SqlConnection);
            vResult.TableName = this._LoggingTableName;
            return vResult;
        }

        public int SetDataSync(ref DataTable logTable)
        {
            int vResult = 0;
            string vSQLText = string.Format("UPDATE [{0}] SET [Sent]=@Sended WHERE [UID]=@UID;", this._LoggingTableName);
            DbParameter[] vPar = {
            new SqlParameter("Sended", SqlDbType.Int, 1),
            new SqlParameter("UID", SqlDbType.NVarChar)
        };
            var cmnd = new SqlCommand(vSQLText);
            cmnd.Parameters.AddRange(vPar);
            foreach (DataRow vRow in logTable.Rows)
            {
                vPar[1].Value = vRow["UID"].ToString();
                vResult += cmnd.ExecuteWithOpenConnection(this._SqlConnection);
            }
            return vResult;
        }

        public void Split(string newFileName)
        {
            throw new appLogException(this.GetType().FullName, "Split", "This class does not support Split functionality!");
        }

        public void Close()
        {
            bool vWaitExit = true;
            while (vWaitExit == true)
            {
                Thread.Sleep(100);
                lock (_Status)
                {
                    vWaitExit = !_Status.Stopped;
                    if (vWaitExit == true)
                    {
                        _Status.Stopping = true;
                        _LogEvent.Set();
                    }
                }
            }
            this._InsertCmd.Dispose();
            this._SqlConnection.Close();
            //_Sql.Close();
            this._FileWriter.Close();
            this._FileWriter = null;
            this._Th = null;
            this._Initialized = false;
        }

        private void Writer()
        {
            bool vStopping = false;
            lock (_Status)
            {
                this._Status.Started = true;
                this._Status.Stopping = false;
                this._Status.Stopped = false;
            }
            try
            {
                do
                {
                    while (this._Queue.Count > 0)
                    {
                        var _with1 = this._InsertCmd;
                        (_with1.Parameters as SqlParameterCollection)[0].Value = Guid.NewGuid();
                        //     ("UID", DbType.String
                        (_with1.Parameters as SqlParameterCollection)[1].Value = this._Queue[0].DateTime;
                        //   "Time", DbType.DateTime
                        (_with1.Parameters as SqlParameterCollection)[2].Value = this._Queue[0].LogType;
                        //       "Category", DbType.String))
                        (_with1.Parameters as SqlParameterCollection)[3].Value = this._Queue[0].Class;
                        //         "Class", DbType.String
                        (_with1.Parameters as SqlParameterCollection)[4].Value = this._Queue[0].Method;
                        //        "Function", DbType.String
                        (_with1.Parameters as SqlParameterCollection)[5].Value = this._Queue[0].Description;
                        //   "Description", DbType.String
                        (_with1.Parameters as SqlParameterCollection)[6].Value = Convert.ToInt32(0);
                        //                 "Sent", DbType.Int32
                        int vParameterIdx = 7;
                        foreach (object vValue in this._Queue[0].StaticData.Values)
                        {
                            (_with1.Parameters as SqlParameterCollection)[vParameterIdx].Value = vValue;
                            vParameterIdx += 1;
                        }
                        try
                        {
                            _with1.ExecuteNonQuery();
                        }
                        catch (Exception ex)
                        {
                            if (this._Queue[0].LogTypeCode == Convert.ToInt32(enmLogType.Error))
                            {
                                this._FileWriter.Write(this._Queue[0]);
                            }
                            this._FileWriter.Write(new SysLogData(this.GetType().FullName, "Writer", ex));
                        }
                        finally
                        {
                            this._Queue.RemoveAt(0);
                        }
                    }
                    lock (this._Status)
                    {
                        vStopping = this._Status.Stopping;
                    }
                    if (!vStopping)
                    {
                        this._LogEvent.Reset();
                        this._LogEvent.WaitOne();
                    }
                } while (!vStopping);
            }
            catch (Exception Ex)
            {
                this._FileWriter.Write(new SysLogData(this.GetType().Name, "Writer", Ex));
            }
            lock (this._Status)
            {
                this._Status.Stopped = true;
            }
        }

        DataTable IWriter.GetDataToSync(bool AllLogs, DateTime BeginDate, DateTime EndDate)
        {
            throw new NotImplementedException();
        }

        private class Status
        {

            public bool Started;
            public bool Stopping;

            public bool Stopped;
            public Status()
            {
                Started = false;
                Stopping = false;
                Stopped = true;
            }

        }

    }
}

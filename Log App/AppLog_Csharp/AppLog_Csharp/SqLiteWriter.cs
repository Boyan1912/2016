namespace appLog_Csharp
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.Common;
    using System.Threading;
    using System.Text;
    using System.IO;
    using System.Data.SqlClient;
    using System.Data.SQLite;

    public class SqLiteWriter : SqlWriter, IWriter
    {
        private const string DefaultFullFileName = "LogAppDb.sqlite";
        
        private bool _Initialized;
        private Log _Log;
        private string _FullName;
        private FileWriter _FileWriter;
        
        private List<LogData> _Queue;
        private ManualResetEvent _LogEvent;
        private bool _Sleeping;
        private Thread _Th;
        private bool _Started;
        private bool _IsFinished;
        
        
        private ManualResetEvent _PauseEvent;

        public SqLiteWriter(Log objLog, string fullPathName)
        {
            this._Log = objLog;
            this._LoggingTableName = Log.LoggingTableName;
            this._FullName = fullPathName != null ? fullPathName : DefaultFullFileName;
            this.WorkingFolder = Path.GetDirectoryName(this._FullName);
            this._ConnectionString = "Data Source = " + this._FullName + ";";
            string vFileName = Path.GetFileName(this._FullName);
            this._SqlConnection = new SQLiteConnection(this._ConnectionString);

            if (!File.Exists(vFileName))
            {
                SQLiteConnection.CreateFile(vFileName);
            }

            this._PauseEvent = new ManualResetEvent(false);
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
                this.CreateLogTable(this._LoggingTableName, this._Log.StaticDataColumns, new SQLiteCommand());
                
                //Check database for errors and recreate Db if get troubles with connection
                
                if (this._InsertCmd == null)
                {
                    this._InsertCmd = this.GetInsertCommand(this._Log.StaticDataColumns, new SQLiteCommand());
                }
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
                    this._Th.Name = this.GetType().FullName + ".Writer";
                    this._Th.Start();
                }
                this._Initialized = true;
            }
            catch (Exception ex)
            {
                this._FileWriter.Write(new SysLogData(this.GetType().FullName, "New", ex));
                this._Initialized = false;
            }
        }

        // TODO
        //private void CheckDbForErrors()
        //{
        //    if (_Sql.DbObjectExist(enmDbObjectType.Table, _LoggingTableName) == false)
        //    {
        //        CreateLogTable(_Sql, _LoggingTableName, _Log.StaticDataColumns);
        //    }
        //    Action<SqlException> vCurrentErrorHandler = _Sql.ErrorHandler;
        //    _Sql.ErrorHandler = null;
        //    try
        //    {
        //        string vStrSqlSelect = string.Format("SELECT COUNT(*) FROM [{0}] LIMIT 1;", _LoggingTableName);
        //        _Sql.Value(vStrSqlSelect);
        //    }
        //    catch (Exception ex)
        //    {
        //        _Sql.Connection.Close();
        //        //Build Broken file name
        //        string vBrokenDbFileName = string.Format("{0}\\Broken_{1}_{2}", System.IO.Path.GetDirectoryName(_FullName), Strings.Format(System.DateTime.Now, "yyyy-MM-dd"), System.IO.Path.GetFileName(_FullName));
        //        //  Delete existing broken file!
        //        //  If file does not exist this command 
        //        //will not cause exception so is safe to call without checking!
        //        System.IO.File.Delete(vBrokenDbFileName);
        //        //  Rename Log.Db to Broken file name!
        //        System.IO.File.Move(_FullName, vBrokenDbFileName);
        //        //  Creating Log.Db file
        //        _Sql.CreateDB(_FullName);
        //        //Another try to connect to Log.Db
        //        _Sql.ConnectionString = "Data Source = " + _FullName + ";";
        //        CreateLogTable(_Sql, _LoggingTableName, _Log.StaticDataColumns);
        //    }
        //    finally
        //    {
        //        _Sql.ErrorHandler = vCurrentErrorHandler;
        //    }
        //}

            
        public void Write(LogData Data)
        {
            if (this._Initialized)
            {
                this._Queue.Add(Data);
                if (this._Sleeping)
                {
                    this._LogEvent.Set();
                }
            }
            else {
                if (Data.LogTypeCode == Convert.ToInt32(enmLogType.Error))
                {
                    this._FileWriter.Write(Data);
                }
            }
        }

        public int Shrink(int recordsToSave)
        {
            var cmdText = string.Format("SELECT COUNT([UID]) AS TotalRecords FROM [{0}];", this._LoggingTableName);
            var cmd = new SqlCommand(cmdText);
            int result = cmd.ExecuteWithOpenConnection(new SqlConnection(this._ConnectionString)) - recordsToSave;

            //int result = Convert.ToInt32(_Sql.Value(string.Format("SELECT COUNT([UID]) AS TotalRecords FROM [{0}];", _LoggingTableName))) - recordsToSave;
            if (result > 0)
            {
                cmdText = string.Format("DELETE FROM [{0}] WHERE [UID] IN (SELECT [UID] FROM [{0}] LIMIT {1});", this._LoggingTableName, result.ToString());
                var deleteCmd = new SqlCommand(cmdText);
                result = deleteCmd.ExecuteWithOpenConnection(new SqlConnection(this._ConnectionString));

                //result = _Sql.Exec(string.Format("DELETE FROM [{0}] WHERE [UID] IN (SELECT [UID] FROM [{0}] LIMIT {1});", _LoggingTableName, result.ToString));
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
                vSQLText = string.Format("SELECT * FROM [{0}] WHERE ([Sent] = 0 AND [Time] BETWEEN @BeginDate AND @EndDate);", this._LoggingTableName);
            }
            else
            {
                vSQLText = string.Format("SELECT * FROM [{0}] WHERE ([Sent]=0 AND [Time] BETWEEN @BeginDate AND @EndDate AND Category='Error');", this._LoggingTableName);
            }
            var selectCmnd = new SqlCommand(vSQLText);
            selectCmnd.Parameters.AddRange(vPar);
            DataTable vResult = selectCmnd.GetResultAsDataTable(new SqlConnection(this._ConnectionString));
            vResult.TableName = this._LoggingTableName;
            return vResult;
        }

        public int SetDataSync(ref DataTable LogTable)
        {
            int vResult = 0;
            string vSQLText = string.Format("UPDATE [{0}] SET [Sent]=@Sended WHERE [UID]=@UID;", this._LoggingTableName);
            DbParameter[] vPar = 
                {
                    new SqlParameter("Sended", SqlDbType.Int, 1),
                    new SqlParameter("UID", SqlDbType.NVarChar)
                };

            var updateCmnd = new SqlCommand(vSQLText);
            foreach (DataRow vRow in LogTable.Rows)
            {
                vPar[1].Value = (string)vRow["UID"];
                updateCmnd.Parameters.AddRange(vPar);
                vResult = updateCmnd.ExecuteWithOpenConnection(new SqlConnection(this._ConnectionString));
                //vResult += _Sql.Exec(vSQLText, vPar(0), vPar(1));
            }
            return vResult;
        }

        public void Split(string NewFileName)
        {
            NewFileName = Path.GetFileName(NewFileName);
            NewFileName = this.WorkingFolder + "\\" + NewFileName;
            if (!File.Exists(NewFileName))
            {
                this.Close();
                Thread.Sleep(300);
                File.Move(_FullName, NewFileName);
                this.Init();
            }
        }

        public void Close()
        {
            _Started = false;
            while (_IsFinished == false)
            {
                if (_Sleeping == true)
                {
                    _Started = false;
                    _LogEvent.Set();
                }
                Thread.Sleep(100);
            }
            _InsertCmd.Dispose();
            _InsertCmd = null;
            //_Sql.Close();
            _FileWriter.Close();
            _FileWriter = null;
            _Th = null;
            _Initialized = false;
        }

        private void Writer()
        {
            bool vStopping = false;
            
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

                        this.RemoveBadCharacters(ref _with1);

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
            
        }
        
        private void RemoveBadCharacters(ref IDbCommand command)
        {
            const char FirstChar = ' ';
            if (command != null)
            {
                foreach (DbParameter vPar in command.Parameters)
                {
                    if (vPar.DbType == DbType.String && vPar.Value is string && (vPar.Value != null))
                    {
                        string vValue = vPar.Value.ToString();
                        int vIdx = 0;
                        StringBuilder vStrBuilder = new StringBuilder();
                        while (vIdx < vValue.Length)
                        {
                            if (vValue[vIdx] < FirstChar)
                            {
                                vStrBuilder.Append(FirstChar);
                            }
                            else {
                                vStrBuilder.Append(vValue[vIdx]);
                            }
                            vIdx += 1;
                        }
                        vPar.Value = vStrBuilder.ToString();
                    }
                }
            }
        }
    }
}

namespace appLog_Csharp
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.IO;
    using System.Text;
    using System.Threading;

    public class FileWriter : IWriter
    {
        
        private IList<LogData> _Queue;
        private ManualResetEvent _LogEvent;
        private bool _Sleeping;
        private bool _Started;
        private bool _Finished;
        private string _WorkingFolder;

        public FileWriter(string path)
        {
            this._WorkingFolder = path;
            if (!Directory.Exists(_WorkingFolder))
            {
                Directory.CreateDirectory(_WorkingFolder);
            }
            this._Queue = new List<LogData>();
            this._LogEvent = new ManualResetEvent(false);
            Thread t = new Thread(new ThreadStart(this.Writer));
            t.Name = this.GetType().FullName + ".Writer";
            t.Start();
        }

        public string WorkingFolder
        {
            get { return this._WorkingFolder; }
        }

        public void Close()
        {
            this._Started = false;
            if (this._Sleeping)
            {
                this._LogEvent.Set();
            }
        }

        public void Write(LogData Data)
        {
            this._Queue.Add(Data);
            if (this._Sleeping)
            {
                this._LogEvent.Set();
            }
            // ADDED:
            this.Writer();
        }

        private void Writer()
        {
            this._Started = true;
            this._Finished = false;
            StringBuilder vStrBuilder = new StringBuilder();
            do
            {
                while (this._Queue.Count > 0)
                {
                    vStrBuilder.Remove(0, vStrBuilder.Length);
                    vStrBuilder.AppendLine("");
                    vStrBuilder.Append(String.Format("yyyy-MM-dd HH:mm:ss", this._Queue[0].DateTime) + " ");
                    //   "Time", DbType.DateTime
                    vStrBuilder.Append(this._Queue[0].LogType + " ");
                    //       "Category", DbType.String))
                    vStrBuilder.Append(this._Queue[0].Class + ".");
                    //         "Class", DbType.String
                    vStrBuilder.AppendLine(this._Queue[0].Method);
                    //        "Function", DbType.String
                    vStrBuilder.AppendLine("\t" + this._Queue[0].Description);
                    //   "Description", DbType.String
                    //vStrBuilder.AppendLine("Sent=0") '                 "Sent", DbType.Int32

                    foreach (KeyValuePair<DataColumn, object> vKeyValuePair in this._Queue[0].StaticData)
                    {
                        vStrBuilder.AppendLine("\t" + vKeyValuePair.Key.ColumnName + "=" + vKeyValuePair.Value.ToString());
                    }

                    string vFileName = null;

                    if (Log.SeparateFileForEachTypeOfRecord)
                    {
                        vFileName = string.Format("{0}\\{1}_{2}.Log", this._WorkingFolder, this._Queue[0].LogType, string.Format(this._Queue[0].DateTime.ToString(), Log.FileNameDateFormat));
                    }
                    else
                    {
                        vFileName = string.Format("{0}\\{1}.Log", this._WorkingFolder, string.Format(this._Queue[0].DateTime.ToString(), Log.FileNameDateFormat));
                    }

                    //End If
                    StreamWriter vStreamWriter = null;
                    //Loop if someone else has got exclusive access to file
                    do
                    {
                        try
                        {
                            vStreamWriter = new StreamWriter(vFileName, true, Encoding.UTF8);
                        }
                        catch (Exception ex)
                        {
                            vStreamWriter = null;
                        }
                    } while (vStreamWriter == null); 

                    vStreamWriter.Write(vStrBuilder.ToString());
                    vStreamWriter.Close();
                    vStreamWriter.Dispose();
                    vStreamWriter = null;
                    this._Queue.RemoveAt(0);
                }
                if (this._Started)
                {
                    this._LogEvent.Reset();
                    this._Sleeping = true;
                    this._LogEvent.WaitOne();
                    this._Sleeping = false;
                }
            } while (this._Started || this._Queue.Count > 0);
            this._Finished = true;
        }

        public DataTable GetDataToSync(bool AllLogs, DateTime BeginDate, DateTime EndDate)
        {
            return null;
        }

        public int SetDataSync(ref DataTable LogTable)
        {
            return -1;
        }

        public int Shrink(int RecordsToSave)
        {
            return -1;
        }

        public void Split(string NewFileName)
        {
            throw new Exception(this.GetType().FullName + " does not support split functionality!");
        }
    }
}

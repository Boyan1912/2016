namespace TestApp_Csharp
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.IO;
    using System.Linq;
    using System.Threading;
    using System.Windows.Forms;

    using appLog_Csharp;
    using AppLog_Csharp.Helpers;

    public partial class LogForm
    {
        private readonly string LogTime = "Log called at " + string.Format("dd/MM/yyyy HH:mm:ss", DateTime.Now);

        private int _LogId;
        private string _UserId;
        private string _LogFileName;
        private System.Threading.Timer _EventTimer;
        private IActionTracer _ActionTracer;

        public LogForm()
        {
            Load += LogForm_Load;
        }
        
        private string ClassName
        {
            get { return this.GetType().Name; }
        }

        private bool UserIsLogged
        {
            get { return !string.IsNullOrEmpty(this._UserId); }
        }
        
        private void LogForm_Load(Object sender, EventArgs e)
        {
            this.InitializeComponent();
            this._LogId++;
            this._LogFileName = Path.GetDirectoryName(Application.ExecutablePath) + "\\logs\\LogFile.Db";
        }

        private void LogForm_Shown(object sender, EventArgs e)
        {
            this.LoadActionTracer();
            this._ActionTracer.LogData = this._ActionTracer.CreateLogData(this.ClassName, "LogForm_Shown", "initial data");
        }

        private void LoadActionTracer()
        {
            this._ActionTracer = new ActionTracer(new Printer(this.txtError));
            this._ActionTracer.GetInitialStaticData(this._LogId, this._UserId, "Initial static data seed");
            this._ActionTracer.CreateLogData(this.ClassName, "Log Form load", "initial log data create");
        }

        private void OnTimerEvent(object Sender)
        {
            //try
            //{
            //    this._Log.Action(this.ClassName, "OnTimerEvent", this.LogTime);
            //}
            //catch (Exception ex)
            //{
            //    //this._Log.Error(this.ClassName, "OnTimerEvent", ex);
            //    this._Log.Exception(ex);
            //    this.txtError.Text = ex.Message;
            //}
            //this._EventTimer = new System.Threading.Timer(this.OnTimerEvent, null, 500, Timeout.Infinite);
        }
        
        private void btnSetUserID_Click_1(object sender, EventArgs e)
        {
            try
            {
                this._ActionTracer.LogData.Class = this.ClassName;
                this._ActionTracer.LogData.Method = "btnSetUserID_Click";
                this._UserId = this.txtUserID.Text;
                var userIdColumn = this._ActionTracer.LogData.StaticData.Keys.FirstOrDefault(x => x.ColumnName == "UserID");
                this._ActionTracer.LogData.StaticData[userIdColumn] = this._UserId;
                this._ActionTracer.Printer.PrintSuccess("User id create", this._ActionTracer.LogData);
            }
            catch (Exception ex)
            {
                this._ActionTracer.LogData.Exception = ex;
                this._ActionTracer.Printer.PrintFailure("On set user Id button click", this._ActionTracer.LogData);
            }
        }

        private void btnPushMessageToLog_Click(object sender, EventArgs e)
        {
            this._ActionTracer.LogData.Class = this.ClassName;
            this._ActionTracer.LogData.Method = "btnPushMessageToLog_Click";

            try
            {
                var logMsgColumn = this._ActionTracer.LogData.StaticData.Keys.FirstOrDefault(x => x.ColumnName == "LogMessage");
                if (logMsgColumn != null)
                {
                    this._ActionTracer.LogData.StaticData[logMsgColumn] = this.txtMessage.Text;
                }
                else
                {
                    this._ActionTracer.StaticFields.Add(new DataColumn("LogMessage", typeof(string)), this.txtMessage.Text);
                }

                this._ActionTracer.Printer.PrintSuccess("Push message to log", this._ActionTracer.LogData);
            }
            catch (Exception ex)
            {
                this._ActionTracer.LogData.Exception = ex;
                this._ActionTracer.Printer.PrintFailure("On push message to log", this._ActionTracer.LogData);
            }

        }

        //TODO
        private void btnLogOut_Click(object sender, EventArgs e)
        {
            if (!this.UserIsLogged)
            {
                var exception = new InvalidOperationException("User is not logged in!");
                //this._Log.Error(this.ClassName, "LogOutButtonClick", exception);
            }
            else
            {
                //this._Log = new Log(true, this._LogFileName, this._ActionTracer.StaticFields);
                //this._Log.UserAction(this.ClassName, "btnLogOut_Click", this.LogTime);

            }
        }

    }
}

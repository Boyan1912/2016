namespace appLog_Csharp
{
    using System;
    using System.Collections.Generic;
    using System.Data;

    public class LogData
    {

        private enmLogType _LogType;
        private DateTime _DateTime;
        private string _Class;
        private string _Method;
        private string _Description;
        private Exception _Exception;

        private Dictionary<DataColumn, object> _StaticData;

        public LogData(string InClass, string InMethod, string Description, bool UserAction)
        {
            if (UserAction == true)
            {
                this._LogType = enmLogType.UserAction;
            }
            else
            {
                this._LogType = enmLogType.Action;
            }

            this._DateTime = DateTime.Now;
            this._Class = InClass;
            this._Method = InMethod;
            this._Description = Description;
            this.IsSystem = false;
        }
        
        public LogData(string InClass, string InMethod, string Description)
        {
            this._LogType = enmLogType.Warning;
            this._DateTime = DateTime.Now;

            this._Class = InClass;
            this._Method = InMethod;
            this._Description = Description;
            this.IsSystem = false;
        }

        public LogData(string InClass, string InMethod, Exception Exception)
        {
            this._LogType = enmLogType.Error;
            this._DateTime = DateTime.Now;

            this._Class = InClass;
            this._Method = InMethod;
            this._Exception = Exception;
            this.IsSystem = false;
        }

        public string LogType
        {
            get { return _LogType.ToString(); }
        }

        public int LogTypeCode
        {
            get { return Convert.ToInt32(_LogType); }
        }

        public DateTime DateTime
        {
            get { return this._DateTime; }
        }

        public string Class
        {
            get { return this._Class; }
            set { this._Class = value; }
        }

        public string Method
        {
            get { return this._Method; }
            set { this._Method = value; }
        }

        public string Description
        {
            get
            {
                if (this._Exception == null)
                {
                    return this._Description;
                }
                else
                {
                    return this._Exception.Message;
                }
            }
            set
            {
                this._Description = value;
            }
        }

        public Dictionary<DataColumn, object> StaticData
        {
            get
            {
                if (this._StaticData == null)
                {
                    return new Dictionary<DataColumn, object>();
                }
                else {
                    return this._StaticData;
                }
            }
            internal set { this._StaticData = value; }
        }

        public Exception Exception
        {
            get { return this._Exception; }
            set { this._Exception = value; }
        }


        // TODO 
        // OVERRIDE TOSTRING()

        protected bool IsSystem;
        /// <summary>
        /// Determine whether log created from Log system or client system. True if it is from Log system
        /// </summary>
        /// <value></value>
        /// <returns></returns>
        /// <remarks></remarks>
        internal bool IsLogSystem
        {
            get { return IsSystem; }
        }

    }


    internal class SysLogData : LogData
    {

        private SysLogData(string InClass, string InMethod, string Description, bool UserAction) : base(InClass, InMethod, Description, UserAction)
        {
        }

        public SysLogData(string InClass, string InMethod, string Description) : base(InClass, InMethod, Description)
        {
            IsSystem = true;
        }

        public SysLogData(string InClass, string InMethod, Exception Exception) : base(InClass, InMethod, Exception)
        {
            IsSystem = true;
        }
        
    }
}

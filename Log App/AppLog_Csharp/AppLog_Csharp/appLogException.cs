namespace appLog_Csharp
{
    using System;
    using System.Collections.Generic;
    using System.Text;
    
    public class appLogException : Exception
    {
        
        private const char FieldSeparator = '1';
        private Dictionary<string, string> _Fields;
        private Exception _InnerException;

        protected appLogException(string Message)
        {
            //MyBase.New(ParseFields(Message)("Message"))
            this._Fields = ParseFields(Message);
            this._InnerException = null;
        }

        protected appLogException(string Message, Exception InnerException)
        {
            //MyBase.New(Message:=ParseFields(Message)("Message"), _
            //           InnerException:=InnerException)
            this._Fields = ParseFields(Message);
            this._InnerException = InnerException;
        }

        protected appLogException(Exception Exception)
        {
            //MyBase.New(Message:=ParseFields(Exception.Message)("Message"), _
            //   InnerException:=Exception.InnerException)
            this._Fields = ParseFields(Exception.Message);
            this._InnerException = Exception.InnerException;
        }
        
        public appLogException(string inClass, string inMethod, string message, params object[] args)
        {
            this._Fields = new Dictionary<string, string>();

            if (IsCustomExceptionMessage(message))
            {
                this._InnerException = new Exception(message);
                this._Fields["Message"] = "Inner exception occured!";
            }
            else
            {
                this._InnerException = null;
                this._Fields["Message"] = message;
            }
            this._Fields["Class"] = inClass;
            this._Fields["Method"] = inMethod;
            this._Fields["Args"] = GetArgumentsString(args);
        }
        
        public appLogException(string inClass, string inMethod, Exception exception, params object[] args)
        {
            this._InnerException = exception.InnerException;
            this._Fields = new Dictionary<string, string>();
            this._Fields["Class"] = inClass;
            this._Fields["Method"] = inMethod;
            this._Fields["Args"] = GetArgumentsString(args);

            if (IsCustomExceptionMessage(exception.Message))
            {
                this._Fields["Message"] = "Inner exception occured!";
            }
            else {
                this._Fields["Message"] = exception.Message;
            }
        }
        
        public string this[string FieldName]
        {
            get
            {
                if (FieldName == null)
                {
                    FieldName = "";
                }
                if (FieldName.Contains("="))
                {
                    FieldName = FieldName.Replace("=", "");
                }
                if (this._Fields.ContainsKey(FieldName))
                {
                    return this._Fields[FieldName];
                }
                else {
                    return "";
                }
            }
            set
            {
                if (FieldName == null)
                {
                    FieldName = "";
                }
                if (FieldName.Contains("="))
                {
                    FieldName = FieldName.Replace("=", "");
                }
                if (value == null)
                {
                    value = "";
                }
                if (this._Fields.ContainsKey(FieldName))
                {
                    this._Fields[FieldName] = value;
                }
                else
                {
                    this._Fields.Add(FieldName, value);
                }
            }
        }

        public virtual bool IsFullySpecified
        {
            get { return this._Fields.ContainsKey("Message") && this._Fields.ContainsKey("Class") && this._Fields.ContainsKey("Method"); }
        }

        public override string Message
        {
            get { return this.ToString(); }
        }

        public Exception BaseException()
        {
            return new Exception(this._Fields["Message"], this._InnerException);
        }

        public new Exception InnerException
        {
            get { return this._InnerException; }
            set { this._InnerException = value; }
        }

        public override sealed string ToString()
        {
            StringBuilder vStrBuilder = new StringBuilder();
            foreach (KeyValuePair<string, string> vKeyValuePair in this._Fields)
            {
                vStrBuilder.AppendLine(string.Format("{0}{1}={2}", FieldSeparator, vKeyValuePair.Key, vKeyValuePair.Value));

            }
            return vStrBuilder.ToString();
        }

        public static bool IsCustomExceptionMessage(string message)
        {
            return message != null && message.StartsWith(FieldSeparator.ToString());
        }

        public static bool IsCustomException(Exception exception)
        {
            return exception.Message != null && exception.Message.StartsWith(FieldSeparator.ToString());
        }

        public static appLogException Convert(Exception Exception)
        {
            return new appLogException(Exception);
        }

        protected static Dictionary<string, string> ParseFields(string Message)
        {
            Dictionary<string, string> vDicResult = new Dictionary<string, string>();
            if (Message != null && Message.StartsWith(FieldSeparator.ToString()) && Message.Length > 1)
            {
                Message = Message.Substring(1);
                string[] vStrElements = Message.Split(FieldSeparator);
                int vIntEqualSymbolIndex = 0;
                foreach (string vStrElement in vStrElements)
                {
                    if (vStrElement.Trim().Length > 0)
                    {
                        vIntEqualSymbolIndex = vStrElement.IndexOf('=');
                        if (vIntEqualSymbolIndex > 0)
                        {
                            string vStrKey = vStrElement.Substring(0, vIntEqualSymbolIndex);
                            if (vStrKey == null)
                            {
                                vStrKey = "";
                            }
                            string vStrValue = vStrElement.Substring(1 + vIntEqualSymbolIndex);
                            if (vStrValue == null)
                            {
                                vStrValue = "";
                            }
                            if (vDicResult.ContainsKey(vStrKey))
                            {
                                vDicResult[vStrKey] = vStrValue;
                            }
                            else
                            {
                                vDicResult.Add(vStrKey, vStrValue);
                            }
                        }
                    }
                }
                vStrElements = null;
            }
            else
            {
                vDicResult.Add("Message", Message);
            }
            if (!vDicResult.ContainsKey("Message"))
            {
                vDicResult.Add("Message", "");
            }
            return vDicResult;
        }

        protected static string GetArgumentsString(object[] Args)
        {
            StringBuilder vStrBuilder = new StringBuilder();
            if (Args != null)
            {
                int vIntArgIndex = 0;
                while (vIntArgIndex < Args.Length)
                {
                    string vStrArg = null;
                    if (Args[vIntArgIndex] == null)
                    {
                        vStrArg = "Nothing";
                    }
                    else if (DBNull.Value.Equals((Args[vIntArgIndex])))
                    {
                        vStrArg = "DbNull.Value";
                    }
                    else {
                        try
                        {
                            vStrArg = Args[vIntArgIndex].ToString();
                        }
                        catch (Exception ex)
                        {
                            vStrArg = "Error converting to string";
                        }
                    }
                    vIntArgIndex += 1;
                    vStrBuilder.AppendLine(string.Format("{0}={1}", vIntArgIndex.ToString(), vStrArg));
                }
            }
            return vStrBuilder.ToString();
        }
    }
}

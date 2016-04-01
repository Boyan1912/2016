namespace appLog_Csharp
{
    using System.Collections.Generic;
    using System.Data;
    
    public abstract class SqlWriter
    {
        protected IDbConnection _SqlConnection;
        protected IDbCommand _InsertCmd;
        protected string _LoggingTableName;
        protected string _WorkingFolder;
        protected string _ConnectionString;


        public string WorkingFolder
        {
            get { return this._WorkingFolder; }
            protected set { this._WorkingFolder = value; }
        }

        protected void CreateLogTable(string tableName, DataColumn[] dataColumns, IDbCommand cmnd)
        {
            string vStrSQL = "" + "CREATE TABLE IF NOT EXISTS [" + tableName + "]" + " ([UID] CHAR(36) PRIMARY KEY ASC NOT NULL," + " [Time] DATETIME NOT NULL," + " [Category] VARCHAR(20)," + " [Class] VARCHAR(50)," + " [Function] VARCHAR(50)," + " [Description] VARCHAR(4000)," + " [Sent] INTEGER";

            foreach (DataColumn vStaticColumn in dataColumns)
            {
                vStrSQL += ", [" + vStaticColumn.ColumnName + "] ";
                switch (vStaticColumn.DataType.Name.ToUpper())
                {
                    case "STRING":
                        vStrSQL += "VARCHAR(" + vStaticColumn.MaxLength.ToString() + ")";
                        break;
                    case "BYTE":
                    case "INTEGER":
                    case "INT16":
                    case "INT32":
                    case "INT64":
                        vStrSQL += "INTEGER";
                        break;
                    case "DATE":
                    case "DATETIME":
                        vStrSQL += "DATETIME";
                        break;
                    case "SINGLE,DOUBLE,DECIMAL":
                        vStrSQL += "DECIMAL(18,2)";
                        break;
                    default:
                        vStrSQL += "VARCHAR(4000)";
                        break;
                }
            }
            vStrSQL += ");";

            cmnd.CommandText = vStrSQL;
            cmnd.ExecuteWithOpenConnection(this._SqlConnection);
        }

        protected string GetInsertFieldNames(DataColumn[] dataColumns)
        {
            string vStrStaticFiledNames = "";
            foreach (DataColumn vStaticColumn in dataColumns)
            {
                vStrStaticFiledNames += ", [@" + vStaticColumn.ColumnName + "] ";
            }
            return vStrStaticFiledNames;
        }

        protected IDbCommand GetInsertCommand(DataColumn[] dataColumns, IDbCommand cmnd)
        {
            
            string vStrStaticFieldNames = GetInsertFieldNames(dataColumns);
            if (vStrStaticFieldNames == null || vStrStaticFieldNames.Length < 1)
            {
                vStrStaticFieldNames = " ";
            }

            var vParList = GetInsertParameters(dataColumns);

            string commandText = "INSERT INTO " + this._LoggingTableName + " (" + "[UID], " + "[Time], " + "[Category], " + "[Class], " + "[Function], " + "[Description], " + "[Sent]" + vStrStaticFieldNames.Replace("@", "") + ") VALUES (" + "@UID, " + "@Time, " + "@Category, " + "@Class, " + "@Function, " + "@Description, " + "@Sent" + vStrStaticFieldNames.Replace("[", "").Replace("]", "") + ");";

            cmnd.CommandText = commandText;

            //TODO CHECK!!!
            foreach (var param in vParList)
            {
                cmnd.Parameters.Add(new
                {
                    Value = param.Key,
                    DbType = param.Value
                });
            }

            return cmnd;
        }
        
        protected IDictionary<string, DbType> GetInsertParameters(DataColumn[] DataColumns)
        {

            var vParList = new Dictionary<string, DbType>();
            vParList.Add("UID", DbType.String);
            vParList.Add("Time", DbType.DateTime);
            vParList.Add("Category", DbType.String);
            vParList.Add("Class", DbType.String);
            vParList.Add("Function", DbType.String);
            vParList.Add("Description", DbType.String);
            vParList.Add("Sent", DbType.Int32);

            if (DataColumns != null)
            {
                foreach (DataColumn vStaticColumn in DataColumns)
                {
                    switch (vStaticColumn.DataType.Name.ToUpper())
                    {
                        case "STRING":
                            vParList.Add(vStaticColumn.ColumnName, DbType.String);
                            break;
                        case "BYTE":
                        case "INTEGER":
                        case "INT16":
                        case "INT32":
                        case "INT64":
                            vParList.Add(vStaticColumn.ColumnName, DbType.Int64);
                            break;
                        case "DATE":
                        case "DATETIME":
                            vParList.Add(vStaticColumn.ColumnName, DbType.DateTime);
                            break;
                        case "SINGLE,DOUBLE,DECIMAL":
                            vParList.Add(vStaticColumn.ColumnName, DbType.Decimal);
                            break;
                        default:
                            vParList.Add(vStaticColumn.ColumnName, DbType.String);
                            break;
                    }
                }
            }
            return vParList;
        }
    }
}

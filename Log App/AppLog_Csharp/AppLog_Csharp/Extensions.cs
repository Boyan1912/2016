namespace appLog_Csharp
{
    using System.Data;
    using System.Data.SqlClient;

    public static class Extensions
    {

        public static int ExecuteWithOpenConnection(this IDbCommand command, IDbConnection connection)
        {
            int affectedRows;
            using (connection)
            {
                using (command)
                {
                    affectedRows = command.ExecuteNonQuery();
                }
            }
            return affectedRows;
        }

        public static DataTable GetResultAsDataTable(this SqlCommand command, IDbConnection connection)
        {
            DataTable dt = new DataTable();
            using (connection)
            {
                using (command)
                {
                    connection.Open();
                    using (SqlDataReader dr = command.ExecuteReader())
                    {
                        dt.Load(dr);
                    }
                }
            }
            return dt;
        }
    }
}

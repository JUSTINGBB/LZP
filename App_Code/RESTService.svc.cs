using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using ESRI.ArcGIS.DataSourcesGDB;
using ESRI.ArcGIS.Geodatabase;
using System.Data.SqlClient;
using System.Data;

namespace RESTServiceTest
{
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.Single)]
    public class RESTService : IRESTService
    {
        
        //HelloWorld测试
        public string Hello(string name)
        {
            return "Hello "+name;
        }
        //打开sqlserver数据库
        protected static void ConnectSQL(SqlConnection conn)
        {
            if (conn.State == ConnectionState.Closed)
            {
                conn.Open();
            }
            else if (conn.State == ConnectionState.Broken)
            {
                conn.Close();
                conn.Open();
            }
        }
        public List<PS_LINE> ConnectLine(string OBJECTID)
        {
            List<PS_LINE> List_PS_LINEs = new List<PS_LINE>();

            return List_PS_LINEs.ToList();
        }
        public static List<PS_LINE> getPS_LINEs(string id)
        {
            //InitializeArcObjects();
            //string sdeConn = ConfigurationManager.AppSettings["sdePIPE"];
            //openSDEWorkspace(sdeConn);

            List<PS_LINE> List_PS_LINEs = new List<PS_LINE>();
            SqlConnection conn = new SqlConnection(ConfigurationManager.AppSettings["PIPE"]);
            ConnectSQL(conn);
            string starSql1 = "select * from PS_LINE";
            

            try
            {
                SqlCommand cmd = null;
                SqlDataAdapter da = null;
                DataSet ds = null;
                DataTable dt = null;
                cmd = new SqlCommand(starSql1, conn);
                da = new SqlDataAdapter(cmd);
                ds = new DataSet();
                da.Fill(ds, "ds");
                dt = ds.Tables[0];
                PS_LINE tmp;
                

                for (int i = 0; i < dt.Rows.Count; i++)
                {

                    tmp = new PS_LINE();
                    DataRow row = dt.Rows[i];
                    tmp.GeoObjNum = (Convert.IsDBNull(row["GeoObjNum"])) ? "0" : (string)row["GeoObjNum"];
                    tmp.SnodeID = (Convert.IsDBNull(row["SnodeID"])) ? "0" : (string)row["SnodeID"];
                    tmp.EnodeID = (Convert.IsDBNull(row["EnodeID"])) ? "0" : (string)row["EnodeID"];
                    tmp.POwner = (Convert.IsDBNull(row["POwner"])) ? "0" : (string)(row["POwner"]);

                    tmp.Material = (Convert.IsDBNull(row["Material"])) ? "0" : (string)(row["Material"]);
                    tmp.PWidHt = (Convert.IsDBNull(row["PWidHt"])) ? "0" : (string)(row["PWidHt"]);
                    tmp.LayDate = (Convert.IsDBNull(row["LayDate"])) ? "0" : (string)(row["LayDate"]);
                    tmp.LayMethod = (Convert.IsDBNull(row["LayMethod"])) ? "" : (string)row["LayMethod"];

                    tmp.Proad = (Convert.IsDBNull(row["Proad"])) ? "" : (string)row["Proad"];
                    tmp.Source = (Convert.IsDBNull(row["Source"])) ? "" : (string)row["Source"];

                    tmp.LBMS = (Convert.IsDBNull(row["LBMS"])) ? "0" : (row["LBMS"]).ToString();
                    tmp.LEMS = (Convert.IsDBNull(row["LEMS"])) ? "0" : (row["LEMS"]).ToString();
                    tmp.LBTG = (Convert.IsDBNull(row["LBTG"])) ? "0" : (row["LBTG"]).ToString();
                    tmp.LETG = (Convert.IsDBNull(row["LETG"])) ? "0" : (row["LETG"]).ToString();
                    tmp.PStatus = (Convert.IsDBNull(row["PStatus"])) ? "0" : ((string)row["PStatus"]);
                    tmp.SHAPE = row["SHAPE"];
                    List_PS_LINEs.Add(tmp);
                }

            }
            catch
            {
                conn.Close();
            }
            finally
            {
                conn.Close();
            }
            return List_PS_LINEs;
        }
        }
        
}

using ESRI.ArcGIS;
using ESRI.ArcGIS.DataSourcesGDB;
using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Geometry;
using ESRI.ArcGIS.Geoprocessor;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

//-----------------------------------------------------------------------------------------------------
/// <summary>
/// sdeConnection 的摘要说明
/// </summary>
public class sdeConnection
{
    //-----------------------------------------------------------------------------------------------------
    public sdeConnection()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }
    
    public static void InitializeArcObjects()
    {
        
        try
        {
            ESRI.ArcGIS.RuntimeManager.Bind(ESRI.ArcGIS.ProductCode.EngineOrDesktop);
            //采用代码初始化License
            /*            IAoInitialize m_AoInitialize = new AoInitializeClass();
                        esriLicenseStatus licenseStatus = esriLicenseStatus.esriLicenseUnavailable;
                        licenseStatus = m_AoInitialize.Initialize(esriLicenseProductCode.esriLicenseProductCodeEngineGeoDB);*/
            ESRI.ArcGIS.esriSystem.IAoInitialize ao = new ESRI.ArcGIS.esriSystem.AoInitialize();
            ao.Initialize(ESRI.ArcGIS.esriSystem.esriLicenseProductCode.esriLicenseProductCodeStandard);
        }
        catch (Exception)
        {
        }
    }
    //-----------------------------------------------------------------------------------------------------
    public static IWorkspace openSDEWorkspace(String connectionString)
    {
        //ESRI.ArcGIS.Geodatabase.IWorkspaceFactory2 workspaceFactory;
        //workspaceFactory = (ESRI.ArcGIS.Geodatabase.IWorkspaceFactory2)new
        //ESRI.ArcGIS.DataSourcesGDB.SdeWorkspaceFactoryClass();
        IWorkspaceFactory2 workspaceFactory = new SdeWorkspaceFactoryClass();
        return workspaceFactory.OpenFromString(connectionString, 0);
    }
    public static IWorkspace openSDEWorkspace(string Server, string Instance, string User, string Password, string Database, string version)
    {
        IWorkspace ws = null;
        IPropertySet pPropSet = new PropertySetClass();
        IWorkspaceFactory pSdeFact = new SdeWorkspaceFactoryClass();
        pPropSet.SetProperty("SERVER", Server);
        pPropSet.SetProperty("INSTANCE", Instance);
        pPropSet.SetProperty("DATABASE", Database);
        pPropSet.SetProperty("USER", User);
        pPropSet.SetProperty("PASSWORD", Password);
        pPropSet.SetProperty("VERSION", version);
        ws = pSdeFact.Open(pPropSet, 0);
        return ws;
    }
    //查找指定要素
    //-----------------------------------------------------------------------------------------------------
    public static IFeatureClass FindClassByName(IWorkspace ws, string className, string dsName)
    {
        IEnumDataset enumDs;
        if (dsName != "")
        {
            enumDs = ws.get_Datasets(esriDatasetType.esriDTFeatureDataset);
            IFeatureDataset featureDs = enumDs.Next() as IFeatureDataset;
            while (featureDs != null)
            {
                if (featureDs.Name == dsName)
                {
                    return GetFcFromDataset(featureDs, className);
                }
                featureDs = enumDs.Next() as IFeatureDataset;
            }
        }
        else
        {
            enumDs = ws.get_Datasets(esriDatasetType.esriDTFeatureClass);
            return GetFcFromEnumDataset(enumDs, className);
        }
        return null;
    }
    //在数据集中查找要素类
    //-----------------------------------------------------------------------------------------------------
    private static IFeatureClass GetFcFromDataset(IFeatureDataset featDs, string className)
    {
        IFeatureClass featClass;
        IFeatureClassContainer fcContainer = featDs as IFeatureClassContainer;
        for (int i = 0; i < fcContainer.ClassCount; i++)
        {
            featClass = fcContainer.get_Class(i);
            if (featClass.AliasName == className)
            {
                return featClass;
            }
        }
        return null;
    }
    //在要素类集合中查找要素类
    //-----------------------------------------------------------------------------------------------------
    private static IFeatureClass GetFcFromEnumDataset(IEnumDataset enumDs, string className)
    {
        IFeatureClass featClass = enumDs.Next() as IFeatureClass;
        while (featClass != null)
        {
            if (featClass.AliasName == className)
            {
                return featClass;
            }
            featClass = enumDs.Next() as IFeatureClass;
        }
        return null;
    }
    //-----------------------------------------------------------------------------------------------------
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
    //检查登录
    public static string loginCheck(string name, string pwd)
    { 
        string type="error";
        SqlConnection conn = new SqlConnection(ConfigurationManager.AppSettings["PIPE"]);
        ConnectSQL(conn);
        string userSql = "select name,pwd,type from users where name='"+name+"' and pwd='"+pwd+"'";
        SqlCommand cmd = new SqlCommand(userSql,conn);
        SqlDataReader dr = cmd.ExecuteReader();
        if (dr.Read())
        {
            type=dr["type"].ToString(); 
        }
        conn.Close();
        return type;
        
    }
    public static string pwdChange(string name,string pwd,string newPwd)
    {
        string returnStr="error";
        SqlConnection conn = new SqlConnection(ConfigurationManager.AppSettings["PIPE"]);
        ConnectSQL(conn);
        string userSql = "select name,pwd,type from users where name='"+name+"' and pwd='"+pwd+"'";
        try
        {
            SqlCommand cmd = new SqlCommand(userSql, conn);
            //SqlDataReader dr = cmd.ExecuteReader();
            if (cmd.ExecuteScalar()!=null)
            {
                string updPwdSql = "Update users set pwd='" + newPwd + "' where name='" + name + "' and pwd='" + pwd + "'";
                SqlCommand cmd_upd = new SqlCommand(updPwdSql, conn);
                cmd_upd.ExecuteNonQuery();
                returnStr = "更新成功";
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
        return returnStr;
    }
    //
    public static List<PS_LINE> getPS_LINEs(int id)
    {
        //InitializeArcObjects();
        //string sdeConn = ConfigurationManager.AppSettings["sdePIPE"];
        //openSDEWorkspace(sdeConn);

        List<PS_LINE> List_PS_LINEs = new List<PS_LINE>();
        SqlConnection conn = new SqlConnection(ConfigurationManager.AppSettings["PIPE"]);
        ConnectSQL(conn);
        string starSql = "select * from PS_LINE where OBJECTID=" + id;
        try
        {
            SqlCommand cmd = null;
            SqlDataAdapter da = null;
            DataSet ds = null;
            DataTable dt = null;
            cmd = new SqlCommand(starSql, conn);
            da = new SqlDataAdapter(cmd);
            ds = new DataSet();
            da.Fill(ds, "ds");
            dt = ds.Tables[0];
            PS_LINE tmp;
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                tmp = new PS_LINE();
                DataRow row=dt.Rows[i];
                tmp.GeoObjNum = (Convert.IsDBNull(row["GeoObjNum"])) ? "0" : (string)row["GeoObjNum"];
                tmp.SnodeID = (Convert.IsDBNull(row["SnodeID"])) ? "0" : (string)row["SnodeID"];
                tmp.EnodeID = (Convert.IsDBNull(row["EnodeID"])) ? "0" : (string)row["EnodeID"];
                tmp.POwner = (Convert.IsDBNull(row["POwner"])) ? "0" : (string)(row["POwner"]);

                tmp.Material = (Convert.IsDBNull(row["Material"])) ? "0" : (string)(row["Material"]);
                tmp.PWidHt = (Convert.IsDBNull(row["PWidHt"])) ? "0" : (string)(row["PWidHt"]);
                tmp.LayDate = (Convert.IsDBNull(row["LayDate"])) ? "0" : (string)(row["LayDate"]);
                tmp.LayMethod = (Convert.IsDBNull(row["LayMethod"])) ? "0" : (string)row["LayMethod"];

                tmp.Proad = (Convert.IsDBNull(row["Proad"])) ? "" : (string)row["Proad"];
                tmp.Source = (Convert.IsDBNull(row["Source"])) ? "" : (string)row["Source"];

                tmp.LBMS = (Convert.IsDBNull(row["LBMS"])) ? "0" : (row["LBMS"]).ToString();
                tmp.LEMS = (Convert.IsDBNull(row["LEMS"])) ? "0" : (row["LEMS"]).ToString();
                tmp.LBTG = (Convert.IsDBNull(row["LBTG"])) ? "0" : (row["LBTG"]).ToString();
                tmp.LETG = (Convert.IsDBNull(row["LETG"])) ? "0" : (row["LETG"]).ToString();

                tmp.PStatus = (Convert.IsDBNull(row["PStatus"])) ? "0" : ((string)row["PStatus"]);
                
                

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
    //获取管线数据统计信息
    public static List<List<PipeLPStatistic>> getStaData()
    {
        List<List<PipeLPStatistic>> StatisticDatas = new List<List< PipeLPStatistic >>();
        List<PipeLPStatistic> StatisticData= new List<PipeLPStatistic>();
        List<PipeLPStatistic> StatisticData2= new List<PipeLPStatistic>();
        List<PipeLPStatistic> StatisticData3= new List<PipeLPStatistic>();
        List<PipeLPStatistic> StatisticData4= new List<PipeLPStatistic>();
        SqlConnection conn = new SqlConnection(ConfigurationManager.AppSettings["PIPE"]);
        ConnectSQL(conn);
        //大市政
        //排水管段类型统计
        string starSql = "select GeoObjNum as Type,Code,Convert(decimal(18,2),sum(PLength))as mCount from PS_LINE where MUNICIPAL='大市政' group by GeoObjNum,Code order by Code,Type";
        //排水管点类型统计
        string starSql2 = "select GeoObjNum as Type,Code,count(*)as mCount from PS_POINTS where MUNICIPAL='大市政' group by GeoObjNum,Code order by Code,Type";
        //排水管线管径统计
        string starSql3 = "select PWidHt as Type,Code,Convert(decimal(18,2),sum(PLength))as mCount from PS_LINE where MUNICIPAL='大市政' group by PWidHt,Code order by Code,Type";
        //排水管线材质统计
        string starSql4 = "select Material as Type,Code,Convert(decimal(18,2),sum(PLength))as mCount from PS_LINE where MUNICIPAL='大市政' group by Material,Code order by Code,Type";

        try
        {
            SqlCommand cmd = null;
            SqlDataAdapter da = null;
            DataSet ds = null;
            DataTable dt = null;
            cmd = new SqlCommand(starSql, conn);
            da = new SqlDataAdapter(cmd);
            ds = new DataSet();
            da.Fill(ds, "ds");
            dt = ds.Tables[0];
            PipeLPStatistic tmp;
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                tmp = new PipeLPStatistic();
                DataRow row = dt.Rows[i];
                tmp.Type = (Convert.IsDBNull(row["Type"])) ? "0" : (row["Type"]).ToString();
                //将管线代号转为名称
                tmp.Type=TypeChangeWords(tmp.Type);
                tmp.subType = (Convert.IsDBNull(row["Code"])) ? "0" : (row["Code"]).ToString();
                tmp.mCount = (Convert.IsDBNull(row["mCount"])) ? "0" : (row["mCount"]).ToString();
                tmp.alias = "管线";
                StatisticData.Add(tmp);
            }
            //starSql2
            SqlCommand cmd2 = null;
            SqlDataAdapter da2 = null;
            DataSet ds2 = null;
            DataTable dt2 = null;
            cmd2 = new SqlCommand(starSql2, conn);
            da2 = new SqlDataAdapter(cmd2);
            ds2 = new DataSet();
            da2.Fill(ds2, "ds");
            dt2 = ds2.Tables[0];
            PipeLPStatistic tmp2;
            for (int i = 0; i < dt2.Rows.Count; i++)
            {
                tmp2 = new PipeLPStatistic();
                DataRow row = dt2.Rows[i];
                tmp2.Type = (Convert.IsDBNull(row["Type"])) ? "0" : (row["Type"]).ToString();
                //将管点代号转为管点名称
                tmp2.Type = TypeChangeWords(tmp2.Type);
                tmp2.subType = (Convert.IsDBNull(row["Code"])) ? "0" : (row["Code"]).ToString();
                tmp2.mCount = (Convert.IsDBNull(row["mCount"])) ? "0" : (row["mCount"]).ToString();
                tmp2.alias = "管点";
                StatisticData2.Add(tmp2);
                
            }
            //
            SqlCommand cmd3 = null;
            SqlDataAdapter da3 = null;
            DataSet ds3 = null;
            DataTable dt3 = null;
            cmd3 = new SqlCommand(starSql3, conn);
            da3 = new SqlDataAdapter(cmd3);
            ds3 = new DataSet();
            da3.Fill(ds3, "ds");
            dt3 = ds3.Tables[0];
            PipeLPStatistic tmp3;
            for (int i = 0; i < dt3.Rows.Count; i++)
            {
                tmp3 = new PipeLPStatistic();
                DataRow row = dt3.Rows[i];
                tmp3.Type = (Convert.IsDBNull(row["Type"])) ? "0" : (row["Type"]).ToString();
                tmp3.subType = (Convert.IsDBNull(row["Code"])) ? "0" : (row["Code"]).ToString();
                tmp3.mCount = (Convert.IsDBNull(row["mCount"])) ? "0" : (row["mCount"]).ToString();
                tmp3.alias = "管径";
                StatisticData3.Add(tmp3);
            }
            //
            SqlCommand cmd4 = null;
            SqlDataAdapter da4 = null;
            DataSet ds4 = null;
            DataTable dt4 = null;
            cmd4 = new SqlCommand(starSql4, conn);
            da4 = new SqlDataAdapter(cmd4);
            ds4 = new DataSet();
            da4.Fill(ds4, "ds");
            dt4 = ds4.Tables[0];
            PipeLPStatistic tmp4;
            for (int i = 0; i < dt4.Rows.Count; i++)
            {
                tmp4 = new PipeLPStatistic();
                DataRow row = dt4.Rows[i];
                tmp4.Type = (Convert.IsDBNull(row["Type"])) ? "0" : (row["Type"]).ToString();
                tmp4.subType = (Convert.IsDBNull(row["Code"])) ? "0" : (row["Code"]).ToString();
                tmp4.mCount = (Convert.IsDBNull(row["mCount"])) ? "0" : (row["mCount"]).ToString();
                tmp4.alias = "材质";
                StatisticData4.Add(tmp4);
            }
            StatisticDatas.Add(StatisticData);
            StatisticDatas.Add(StatisticData2);
            StatisticDatas.Add(StatisticData3);
            StatisticDatas.Add(StatisticData4);
        }
        catch
        {
            conn.Close();
        }
        finally
        {
            conn.Close();
        }
        return StatisticDatas;
    }
    
    //管线溯源搜索
    public static DataTable getSourceLine(string startPoint)
    {
        SqlConnection conn = new SqlConnection(ConfigurationManager.AppSettings["PIPE"]);
        ConnectSQL(conn);
        DataTable mTable = new DataTable();
        string starSql = "select *from PS_LINE Where EnodeID='"+startPoint+"'";
        try
        {
            SqlCommand cmd = null;
            SqlDataAdapter da = null;
            DataSet ds = null;
            DataTable dt = null;
            cmd = new SqlCommand(starSql, conn);
            da = new SqlDataAdapter(cmd);
            ds = new DataSet();
            da.Fill(ds, "ds");
            dt = ds.Tables[0];
            List<string> mlist = new List<string>();
            for (int p = 0; p < dt.Rows.Count; p++)
            {
                DataRow row = dt.Rows[p];
                string a = (Convert.IsDBNull(row["SnodeID"])) ? "0" : (string)row["SnodeID"];
                mlist.Add(a);
            }
            if (mlist != null)
            {
                for (int i = 0; i < mlist.Count; i=0)
                {
                    string starSql2 = "select *from PS_LINE Where EnodeID='" + mlist[i]+"'";;
                    SqlCommand sub_cmd = null;
                    SqlDataAdapter sub_da = null;
                    DataSet sub_ds = null;
                    DataTable sub_dt = null;
                    sub_cmd = new SqlCommand(starSql2, conn);
                    sub_da = new SqlDataAdapter(sub_cmd);
                    sub_ds = new DataSet();
                    //将数据添加到新数据集sub_ds中
                    sub_da.Fill(sub_ds, "sub_ds");
                    //将数据添加到已有数据集ds中
                    sub_da.Fill(ds, "ds");
                    sub_dt = sub_ds.Tables[0];
                    //移除当前的 mlist 查询
                    mlist.Remove(mlist[i]);
                    for (int j = 0; j < sub_dt.Rows.Count; j++)
                    {
                        DataRow row = sub_dt.Rows[j];
                        string a = (Convert.IsDBNull(row["SnodeID"])) ? "0" : (string)row["SnodeID"];
                        mlist.Add(a);
                    }
                }
                
            }
            mTable = ds.Tables[0];
        }
        catch
        {
            conn.Close();
        }
        finally
        {
            conn.Close();
        }
        return mTable;
    }
    /**获取溯源管线版本1*/
    /* public static List<DataRow> getSourceLine()
    {
        SqlConnection conn = new SqlConnection(ConfigurationManager.AppSettings["PIPE"]);
        ConnectSQL(conn);
        List<DataRow> mTable = new List<DataRow>();
        string startPoint = "15528105YS201803031005";
        string starSql = "select *from PS_LINE Where EnodeID='" + startPoint + "'";
        try
        {
            SqlCommand cmd = null;
            SqlDataAdapter da = null;
            DataSet ds = null;
            DataTable dt = null;
            cmd = new SqlCommand(starSql, conn);
            da = new SqlDataAdapter(cmd);
            ds = new DataSet();
            da.Fill(ds, "ds");
            dt = ds.Tables[0];
            List<string> mlist = new List<string>();
            for (int p = 0; p < dt.Rows.Count; p++)
            {
                DataRow row = dt.Rows[p];
                mTable.Add(row);
                string a = (Convert.IsDBNull(row["SnodeID"])) ? "0" : (string)row["SnodeID"];
                mlist.Add(a);
            }
            if (mlist != null)
            {
                for (int i = 0; i < mlist.Count; i = 0)
                {
                    string starSql2 = "select *from PS_LINE Where EnodeID='" + mlist[i] + "'"; ;
                    SqlCommand sub_cmd = null;
                    SqlDataAdapter sub_da = null;
                    DataSet sub_ds = null;
                    DataTable sub_dt = null;
                    sub_cmd = new SqlCommand(starSql2, conn);
                    sub_da = new SqlDataAdapter(sub_cmd);
                    sub_ds = new DataSet();
                    sub_da.Fill(sub_ds, "sub_ds");
                    sub_da.Fill(ds, "ds");
                    sub_dt = sub_ds.Tables[0];
                    mlist.Remove(mlist[i]);
                    for (int j = 0; j < sub_dt.Rows.Count; j++)
                    {
                        DataRow row = sub_dt.Rows[j];
                        mTable.Add(row);
                        string a = (Convert.IsDBNull(row["SnodeID"])) ? "0" : (string)row["SnodeID"];
                        mlist.Add(a);
                    }
                }

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
        return mTable;
    }*/
    //管线检修数据，插入
    public static string pipeFixDb(PipeFix p1)
    {
        string resposeMsg="";
        SqlConnection conn = new SqlConnection(ConfigurationManager.AppSettings["PIPE"]);
        ConnectSQL(conn);
        string sqlstr = "select MAX(OBJECTID) as id from PIPEFIX";
        string queryStr = "select  ProjectCode  from PIPEFIX where ProjectCode='" + p1.ProjectCode+"'";
        try
        {
            SqlCommand cmd_s = new SqlCommand(queryStr, conn);
            SqlDataReader dr_s = cmd_s.ExecuteReader();
            if (dr_s.Read())
            {
                return ("工程编号已存在");
            }
            dr_s.Close();
            //
            SqlCommand cmd = new SqlCommand(sqlstr, conn);
            SqlDataReader dr = cmd.ExecuteReader();
            int maxId = 0;
            if (dr.Read())
            {
                if (dr["id"].GetType().Name == "DBNull")
                {
                    maxId = 0;
                }
                else
                {
                    maxId=Convert.ToInt32(dr["id"]);
                }          
            }
            dr.Close();
            //
            maxId += 1;
            
            string sqlstr2 = "INSERT INTO [dbo].[PIPEFIX]" +
            "([OBJECTID],[ManagerUnits],[ConstructionUnits],[ProjectName],[NameAndPhone]," +
            "[ProjectCode],[place],[Principal],[Problem],[MoneyCost],[MoreInfo]," +
            "[PIPES],[FixType],[RecordTime],[StartTime],[EndTime])" + "VALUES(" + maxId + ",'" + p1.ManagerUnits + "','" + p1.ConstructionUnits + "','" + p1.ProjectName + "','" + p1.NameAndPhone + "','" +
            p1.ProjectCode + "','" + p1.place + "','" + p1.Principal + "','" + p1.Problem + "'," + p1.MoneyCost + ",'" + p1.MoreInfo + "','" +
            p1.PIPES + "','" + p1.FixType + "','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") +
            "','" + p1.StartTime + "','" + p1.EndTime  + "')";
            SqlCommand cmd2 = new SqlCommand(sqlstr2, conn);
            cmd2.ExecuteNonQuery();
            resposeMsg = "插入成功";
        }
        catch
        {
            conn.Close();
            resposeMsg = "数据有误";
        }
        finally
        {
            conn.Close();
        }

        return (resposeMsg);
    }
    //管线检修数据，查询
    public static List<PipeFix> getPipeFixInfos(PipeFix queryInfos)
    {
        List<PipeFix> fixInfos = new List<PipeFix>();
        SqlConnection conn = new SqlConnection(ConfigurationManager.AppSettings["PIPE"]);
        ConnectSQL(conn);
        string fixSql = "select *from PIPEFIX where 1=1" +
            string.Format(string.IsNullOrEmpty(queryInfos.ManagerUnits) ? "" : "and ManagerUnits='" + queryInfos.ManagerUnits + "'") +
            string.Format(string.IsNullOrEmpty(queryInfos.ProjectName) ? "" : "and ProjectName='" + queryInfos.ProjectName + "'") +
            string.Format(string.IsNullOrEmpty(queryInfos.NameAndPhone) ? "" : "and NameAndPhone='" + queryInfos.NameAndPhone + "'") +
            string.Format(string.IsNullOrEmpty(queryInfos.ProjectCode) ? "" : "and ProjectCode='" + queryInfos.ProjectCode + "'") +
            string.Format(string.IsNullOrEmpty(queryInfos.place) ? "" : "and place='" + queryInfos.place + "'") +
            string.Format(string.IsNullOrEmpty(queryInfos.Principal) ? "" : "and Principal='" + queryInfos.Principal + "'") +
            string.Format(string.IsNullOrEmpty(queryInfos.Problem) ? "" : "and Problem='" + queryInfos.Problem + "'") +
            string.Format(string.IsNullOrEmpty(queryInfos.MoneyCost) ? "" : "and FLOOR(MoneyCost)=" + queryInfos.MoneyCost) +//花费为float型要区别开，此处使用FLOOR对MoneyCost取整
            string.Format(string.IsNullOrEmpty(queryInfos.PIPES) ? "" : "and PIPES='" + queryInfos.PIPES + "'") +
            string.Format(string.IsNullOrEmpty(queryInfos.FixType) ? "" : "and FixType='" + queryInfos.FixType + "'") +
            string.Format(string.IsNullOrEmpty(queryInfos.StartTime) ? "" : "and StartTime Like'" + queryInfos.StartTime + "%'") +
            string.Format(string.IsNullOrEmpty(queryInfos.EndTime) ? "" : "and EndTime Like'" + queryInfos.EndTime + "%'");
        try
        {
            SqlCommand cmd = null;
            SqlDataAdapter da = null;
            DataSet ds = null;
            DataTable dt = null;
            cmd = new SqlCommand(fixSql, conn);
            da = new SqlDataAdapter(cmd);
            ds = new DataSet();
            da.Fill(ds, "ds");
            dt = ds.Tables[0];
            PipeFix tmp;
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                tmp = new PipeFix();
                DataRow row = dt.Rows[i];
                tmp.ManagerUnits = (Convert.IsDBNull(row["ManagerUnits"])) ? "" : (string)row["ManagerUnits"];
                tmp.ConstructionUnits = (Convert.IsDBNull(row["ConstructionUnits"])) ? "" : (string)row["ConstructionUnits"];
                tmp.ProjectName = (Convert.IsDBNull(row["ProjectName"])) ? "" : (string)row["ProjectName"];
                tmp.NameAndPhone = (Convert.IsDBNull(row["NameAndPhone"])) ? "" : (string)(row["NameAndPhone"]);

                tmp.ProjectCode = (Convert.IsDBNull(row["ProjectCode"])) ? "" : (string)(row["ProjectCode"]);
                tmp.place = (Convert.IsDBNull(row["place"])) ? "0" : (string)(row["place"]);
                tmp.Principal = (Convert.IsDBNull(row["Principal"])) ? "" : (string)(row["Principal"]);
                tmp.Problem = (Convert.IsDBNull(row["Problem"])) ? "" : (string)(row["Problem"]);
                tmp.MoneyCost = (Convert.IsDBNull(row["MoneyCost"])) ? "" : (row["MoneyCost"]).ToString();

                tmp.MoreInfo = (Convert.IsDBNull(row["MoreInfo"])) ? "" : (string)row["MoreInfo"];
                tmp.PIPES = (Convert.IsDBNull(row["PIPES"])) ? "" : (string)row["PIPES"];
                tmp.FixType = (Convert.IsDBNull(row["FixType"])) ? "" : (row["FixType"]).ToString();
                tmp.StartTime = (Convert.IsDBNull(row["StartTime"])) ? "" : ((DateTime)(row["StartTime"])).ToString("yyyy-MM-dd");
                tmp.EndTime = (Convert.IsDBNull(row["EndTime"])) ? "" : ((DateTime)(row["EndTime"])).ToString("yyyy-MM-dd");
                tmp.RecordTime = (Convert.IsDBNull(row["RecordTime"])) ? "" : ((DateTime)(row["RecordTime"])).ToString("yyyy-MM-dd");

                fixInfos.Add(tmp);
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
        return fixInfos;
    }
    public static string TypeChangeWords(string type)
    {
        switch (type)
        {
            case "5202201":
                type = "污水管线(米)";
                break;
            case "5201201":
                type = "雨水管线(米)";
                break;
            case "5299101":
                type = "非普";
                break;
            case "5299102":
                type = "弯头";
                break;
            case "5299103":
                type = "直通";
                break;
            case "5299104":
                type = "三通";
                break;
            case "5299105":
                type = "四通";
                break;
            case "5299106":
                type = "多通";
                break;
            case "5299107":
                type = "变径";
                break;
            case "5299108":
                type = "进水口";
                break;
            case "5299109":
                type = "出水口";
                break;
            case "5299110":
                type = "预留口";
                break;
            case "5299111":
                type = "出地";
                break;
            case "5299112":
                type = "拐点";
                break;
            case "5299113":
                type = "特征点";
                break;
            case "5299114":
                type = "井边点";
                break;
            case "5299115":
                type = "井内点";
                break;
            case "5299116":
                type = "污水检修井";
                break;
            case "5299117":
                type = "雨水检修井";
                break;
            case "5299118":
                type = "雨篦";
                break;
            case "5299119":
                type = "污篦";
                break;
            case "5299120":
                type = "阀门";
                break;
            case "5299121":
                type = "阀门井";
                break;
            case "5299122":
                type = "溢流井";
                break;
            case "5299123":
                type = "跌水井";
                break;
            case "5299124":
                type = "通风井";
                break;
            case "5299125":
                type = "冲洗井";
                break;
            case "5299126":
                type = "沉泥井";
                break;
            case "5299127":
                type = "渗水井";
                break;
            case "5299128":
                type = "水封井";
                break;
            case "5299129":
                type = "出气井";
                break;
            case "5299130":
                type = "闸门井";
                break;
            case "5299131":
                type = "倒虹井";
                break;
            case "5299132":
                type = "泵站";
                break;
            case "5299133":
                type = "化粪池";
                break;
            case "5299134":
                type = "净化池";
                break;
            case "5299135":
                type = "暗沟地面出口";
                break;
            case "5299136":
                type = "沉淀池";
                break;
            case "5299137":
                type = "排气阀";
                break;
            case "5299138":
                type = "隔油池";
                break;
            case "5299139":
                type = "酸碱中和池";
                break;
            default: break;
        }
        return type;
    }
}


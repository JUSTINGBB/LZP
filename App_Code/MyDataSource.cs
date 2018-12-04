using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Web;
using Newtonsoft.Json;
using GeoJSON.Net.Converters;
using GeoJSON.Net.Geometry;
using GeoJSON.Net.Feature;
using System.Data.Spatial;
using Microsoft.SqlServer.Types;
using Newtonsoft.Json.Linq;
//using System.Data.SqlTypes ;

//-----------------------------------------------------------------------------------------------------
/// <summary>
/// MyDataSource 的摘要说明
/// </summary>
public class MyDataSource
{
    //-----------------------------------------------------------------------------------------------------
    public MyDataSource()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }
    //-----------------------------------------------------------------------------------------------------
    public static string GetLineData(int id)
    {
        List<PS_LINE> listSite = sdeConnection.getPS_LINEs(id);
        string resInfo = ConvertToJson(listSite);
        return resInfo;
    }
    //-----------------------------------------------------------------------------------------------------
        //管线数据统计
    public static string StatisticData()
    {
        List<List<PipeLPStatistic>> listSite = sdeConnection.getStaData();
        string resInfo = ConvertToJson(listSite);
        return resInfo;
    }
    //-----------------------------------------------------------------------------------------------------
        //管线溯源
    public static string SourceLine(string id)
    {
        DataTable listSite = sdeConnection.getSourceLine(id);
        string resInfo = LineStringToJson(listSite);
        return resInfo;
    }
    //-----------------------------------------------------------------------------------------------------
        //插入排水检修记录
    public static string PipeFixInfo(string  infos)
    {
        
        PipeFix p1 = JsonConvert.DeserializeObject<PipeFix>(infos);
        string resInfo = sdeConnection.pipeFixDb(p1);
        return resInfo;
    }
    //查询排水检修记录
    public static string fixIndosQuery(string json2)
    {
        PipeFix p1 = JsonConvert.DeserializeObject<PipeFix>(json2);
        List<PipeFix> listInfos = sdeConnection.getPipeFixInfos(p1);
        string resInfo = ConvertToJson(listInfos);
        return resInfo;
    }
    //写入数据到json文件中,(暂时废弃)
    public static string WriteInJsonFile(string json,string fileName)
    {

        FileStream fs = new FileStream("D:/LZP/panorama/userLandPoints.json", FileMode.OpenOrCreate);
        //获得字节数组
        byte[] data = new UTF8Encoding().GetBytes(json);
        //开始写入
        fs.Write(data, 0, data.Length);
        //清空缓冲区、关闭流
        fs.Flush();
        fs.Close();

        return json;
    }
    public static string GetMyFolderInfo(string sSourcePath)
    {
        //遍历文件夹
        
        Dictionary<String, List<String>> dict = new Dictionary<string, List<string>>();
        DirectoryInfo theFolder = new DirectoryInfo(sSourcePath);
        //遍历子文件夹
        DirectoryInfo[] dirInfo = theFolder.GetDirectories();
        foreach (DirectoryInfo NextFolder in dirInfo)
        {

            FileInfo[] fileInfo  = NextFolder.GetFiles("*.*",SearchOption.AllDirectories);//获取子文件夹及其子文件夹（有的话）文件信息
            List<String> list = new List<string>();
            foreach (FileInfo NextFile in fileInfo)  //遍历文件

                list.Add(NextFile.Name);
            dict.Add(NextFolder.ToString(),list);
        }
        string resInfo = ConvertToJson(dict);
        return resInfo;
    }
    //打印日志
    public static void PrintLogs(string log)
    {
        //获取当前时间
        System.DateTime currentTime = new System.DateTime();
        currentTime = System.DateTime.Now;
        string currentTimeStr = currentTime.ToString();
        //
        string dir = HttpContext.Current.Request.PhysicalApplicationPath;

        string logPath = dir + "panorama\\log.txt";//文件存放路径，保证文件存在。
        StreamWriter logSw = new StreamWriter(logPath, true);
        logSw.WriteLine("\n" + currentTimeStr +"    "+ log);
        logSw.Close();
        
    }
    //删除文件
    public static string mDeleteFile(string mPath)
    {
        string res = null;
        if (System.IO.File.Exists(Path.GetFullPath(mPath)))
        {
            File.Delete(Path.GetFullPath(mPath));
            MyDataSource.PrintLogs("删除文件" + mPath);
        }
        else
        {
            MyDataSource.PrintLogs("删除图片:图片文件不存在");
            res = "文件路径不存在";
        }
        return res;
    }
    //-----------------------------------------------------------------------------------------------------
    #region 私有方法
    //-----------------------------------------------------------------------------------------------------

    //-----------------------------------------------------------------------------------------------------
    /// <summary>
    /// 将对象转换成json返回给前台
    /// </summary>
    /// <param name="obj"></param>
    /// <returns></returns>
    private static string ConvertToJson(object obj)
    {
        DataContractJsonSerializer json = new DataContractJsonSerializer(obj.GetType());
        string resJson = "";
        using (MemoryStream stream = new MemoryStream())
        {
            json.WriteObject(stream, obj);
            resJson = Encoding.UTF8.GetString(stream.ToArray());
            //System.Diagnostics.Debug.WriteLine("666");
        }
        return resJson;
    }

    //-----------------------------------------------------------------------------------------------------
        //溯源时获取线数据
    private static string LineStringToJson(DataTable table)
    {
        /*由于geometry复杂数据类型存在table中，无法使用下面常规的DataTable数据序列化*/
        //string JsonString = string.Empty;
        //JsonString = JsonConvert.SerializeObject(table);
        //return JsonString;
        /*按照esri的geometry格式进行序列化*/
        
        string JsonString = "[";
        const string wkid = "4490";
        for (int i = 0; i < table.Rows.Count; i++) 
        {
            string lineString = table.Rows[i]["SHAPE"].ToString();
            JsonString = JsonString + GeometryTojJson.mLineToJson(DbGeometry.FromText(lineString),wkid) + ",";

        }
        JsonString = JsonString + "]";
        return JsonString;
    }
    //-----------------------------------------------------------------------------------------------------
    #endregion
    //-----------------------------------------------------------------------------------------------------

}


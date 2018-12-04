<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Web;
using System.IO;

public class Handler : IHttpHandler {
    public struct ParaStrObj
    {
        public string paraStr { get; set; }
    }
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        //context.Response.Write("Hello World");
        string method = System.Web.HttpContext.Current.Request["method"].ToString();
        string res = lzpAnalyse(method, context);
        context.Response.Write(res);         
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }
    public string lzpAnalyse(string method, HttpContext context)
    {
        string res = null;
        //获取当前文件所在文件夹名
        string dir = HttpContext.Current.Request.PhysicalApplicationPath;

        switch (method)
        {
            case "login":
                string user = System.Web.HttpContext.Current.Request["user"].ToString();
                string pwd = System.Web.HttpContext.Current.Request["pwd"].ToString();
                res = sdeConnection.loginCheck(user,pwd);
                break;
            case "pwdChange":
                string user2 = System.Web.HttpContext.Current.Request["user"].ToString();
                string pwd2 = System.Web.HttpContext.Current.Request["pwd"].ToString();
                string newPwd = System.Web.HttpContext.Current.Request["newPwd"].ToString();
                res = sdeConnection.pwdChange(user2,pwd2,newPwd);
                break;
            case "lineConn"://相连的线
                string lineConnOper = System.Web.HttpContext.Current.Request["oper"].ToString();
                string lineConnId = System.Web.HttpContext.Current.Request["id"].ToString();
                int OBJECTID = Convert.ToInt32(lineConnId);
                switch (lineConnOper)
                {
                    case "line":
                        res = MyDataSource.GetLineData(OBJECTID);
                        break;
                }
                break;
            case "chartsMaker"://图表
                 res = MyDataSource.StatisticData();
                /*string chartsMakerOper = System.Web.HttpContext.Current.Request["oper"].ToString();
                switch (chartsMakerOper)
                {
                   case "ztqk":
                       res=MyDataSource.
                       break;
                   case "gxczqk":
                       break;
                   case "gxgjqk":
                       break;
                }*/
                break;
            case "getSourceT"://溯源
                string snodeID = System.Web.HttpContext.Current.Request["id"].ToString();
                res = MyDataSource.SourceLine(snodeID);
                break;
            case "fixPipe"://插入排水检修记录
                HttpRequest request = context.Request;
                System.IO.Stream stream = request.InputStream;
                string json = string.Empty;
                //string responJson = string.Empty;
                if (stream.Length != 0)
                {
                    System.IO.StreamReader streamReader = new System.IO.StreamReader(stream);
                    json = streamReader.ReadToEnd();

                }
                res = MyDataSource.PipeFixInfo(json);
                //string pipeFixInfo = System.Web.HttpContext.Current.Request.Form.ToString();
                //MyDataSource.PipeFixInfo(pipeFixInfo);
                break;
            case "c_fixInfosQ": //查询排水检修记录
                HttpRequest request2 = context.Request;
                System.IO.Stream stream2 = request2.InputStream;
                string json2 = string.Empty;
                //string responJson2 = string.Empty;
                if (stream2.Length != 0)
                {
                    System.IO.StreamReader streamReader2 = new System.IO.StreamReader(stream2);
                    json2 = streamReader2.ReadToEnd();

                }
                res = MyDataSource.fixIndosQuery(json2);
                break;
            case "imgShower":
                string folderName = HttpContext.Current.Request["folderName"].ToString();
                res = MyDataSource.GetMyFolderInfo(dir + "panorama\\userLandPointsImg\\" + folderName);
                break;
            case "userLandPointsWrite"://往userLandPoints.json文件中写入json数据
                //string dir = Directory.GetCurrentDirectory();//获取的是IIS Express目录（如果调试时用），使用iis时获取"c:\windows\system32\inetsrv
                HttpRequest rq3 = context.Request;
                System.IO.Stream stream3 = rq3.InputStream;
                string json3 = string.Empty;
                //string fileName="userLandPoints.json";
                if (stream3.Length != 0)
                {
                    System.IO.StreamReader streamReader3 = new System.IO.StreamReader(stream3);
                    json3 = streamReader3.ReadToEnd();

                    FileStream fs = new FileStream(dir + "panorama\\userLandPoints.json", FileMode.Create, FileAccess.Write);
                    //获得字节数组
                    byte[] data = new System.Text.UTF8Encoding().GetBytes(json3);
                    //开始写入
                    fs.Write(data, 0, data.Length);
                    //清空缓冲区、关闭流
                    fs.Flush();
                    fs.Close(); 
                    MyDataSource.PrintLogs("    userLandPoints:" + json3);
                    res = "写入成功";
                }
                //res = MyDataSource.WriteInJsonFile(json3, fileName);
                break;
           // case "UploadImg":
                //HttpRequest request3 = context.Request;
                //System.IO.Stream stream3 = request3.InputStream;
                //string json3 = string.Empty;
                //string responJson3 = string.Empty;
                //if (stream3.Length != 0)
                //{
                //    System.IO.StreamReader streamReader3 = new System.IO.StreamReader(stream3);
                //    json3 = streamReader3.ReadToEnd();

                //} 
               // break;
            case "DeleteImg":
                string imgName = HttpContext.Current.Request["imgName"].ToString();
                string imgNamePath = dir + imgName;
                res = MyDataSource.mDeleteFile(imgNamePath);
                break;
            //case "logTest":
            //    string log = HttpContext.Current.Request["log"].ToString();
            //    string logPath=dir + "panorama\\log.txt";//文件存放路径，保证文件存在。
            //    StreamWriter logSw = new StreamWriter(logPath, true);
            //    logSw.WriteLine("\n"+log);
            //    logSw.Close();
            //    break; 
            default: break;
        }            
        return res;
    }
    
}
<%@ WebHandler Language="C#" Class="Uploader" %>
using System;
using System.IO;
using System.Web;
 
public class Uploader : IHttpHandler
{
    public void ProcessRequest(HttpContext hc)
    {
        string NowPath = Path.Combine(hc.Server.MapPath("./upload"), hc.Request["path"]);
 
        if (!Directory.Exists(NowPath))
        {
            Directory.CreateDirectory(NowPath);
        }
 
        foreach (string fileKey in hc.Request.Files)
        {
            HttpPostedFile file = hc.Request.Files[fileKey];
            string FilePath = Path.Combine(NowPath, file.FileName);
            if (File.Exists(FilePath))
            {
                if (Convert.ToBoolean(hc.Request["overwrite"]))
                {
                    File.Delete(FilePath);
                }
                else
                {
                    continue;
                }
            }
            file.SaveAs(FilePath);
        }
    }
 
    public bool IsReusable
    {
        get { return true; }
    }
}

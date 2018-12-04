using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Services;

/// <summary>
/// WebService 的摘要说明
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消注释以下行。 
 [System.Web.Script.Services.ScriptService]
public class WebService : System.Web.Services.WebService {

    public WebService () {

        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
    }

    [WebMethod]
    public string Hello(string name) {
        return "Hello "+name;
    }
    [WebMethod]
    public List<PS_LINE> getPS_LINEsT(string OBJECTID)
    {
        sdeConnection.InitializeArcObjects();
        string sdeConn = ConfigurationManager.AppSettings["sdePIPE"];
        sdeConnection.openSDEWorkspace(sdeConn);
        List<PS_LINE> List_PS_LINEs = new List<PS_LINE>();

        return List_PS_LINEs; 
    }
}

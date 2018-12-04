using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
//using ESRI.ArcGIS.ADF;

namespace RESTServiceTest
{
    [DataContract]
    public class Person
    {
        [DataMember]
        public string ID;
        [DataMember]
        public string Name;
        [DataMember]
        public string Age;
    }

    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IRESTService" in both code and config file together.
    [ServiceContract]
    public interface IRESTService
    {
        ////HelloWorld测试
        [OperationContract]
        [WebGet(UriTemplate = "Hello/{name}", ResponseFormat = WebMessageFormat.Json)]
        String Hello(string name);
        //获取连通的管线数据
        [OperationContract]
        [WebGet(UriTemplate = "ConnectLine/{OBJECTID}", ResponseFormat = WebMessageFormat.Json)]
        List<PS_LINE> ConnectLine(string OBJECTID);

        
        ////POST 操作
        //[OperationContract]
        //[WebInvoke(UriTemplate = "", Method = "POST")]
        //Person CreatePerson(Person createPerson);

        ////Get 操作
        //[OperationContract]
        //[WebGet(UriTemplate = "", ResponseFormat = WebMessageFormat.Json)]
        //List<Person> GetAllPerson();
        //[OperationContract]
        //[WebGet(UriTemplate = "{id}", ResponseFormat = WebMessageFormat.Json)]
        //Person GetAPerson(string id);

        ////PUT 操作
        //[OperationContract]
        //[WebInvoke(UriTemplate = "{id}", Method = "PUT")]
        //Person UpdatePerson(string id, Person updatePerson);

        ////DELETE 操作
        //[OperationContract]
        //[WebInvoke(UriTemplate = "{id}", Method = "DELETE")]
        //void DeletePerson(string id);
    }
}

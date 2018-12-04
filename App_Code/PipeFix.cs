using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// PipeFix 的摘要说明
/// </summary>
public class PipeFix
{
	public PipeFix()
	{
		//
		// TODO: 在此处添加构造函数逻辑
		//

	}
    public string ManagerUnits { get; set; }            //管理单位 
    public string ConstructionUnits { get; set; }            //施工单位
    public string ProjectName { get; set; }            //工程名称
    public string NameAndPhone { get; set; }            //联系人/电话

    public string ProjectCode { get; set; }           //工程编号
    public string place { get; set; }             //施工位置
    public string Principal { get; set; }            //工程负责人

    public string Problem { get; set; }          //管道问题
    public string MoneyCost { get; set; }          //施工费用(/万元)接收后转为float型
    public string MoreInfo { get; set; }               //备注
    public string PIPES { get; set; }               //管线
    public string FixType { get; set; }               //检修类型

    public string StartTime { get; set; }           //施工起始时间
    public string EndTime { get; set; }             //施工结束时间
    public string RecordTime { get; set; }          //登记时间
}
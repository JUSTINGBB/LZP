using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// PS_LINE 的摘要说明
/// </summary>
public class PS_LINE
{
	public PS_LINE()
	{
		//
		// TODO: 在此处添加构造函数逻辑
		//
	}
    public string GeoObjNum { get; set; }            //地物编码 
    public string SnodeID { get; set; }            //起点编号
    public string EnodeID { get; set; }            //终点编号
    public string POwner { get; set; }            //权属编号or单位名称

    public string Material { get; set; }           //材质
    public string PWidHt { get; set; }             //管径
    public string LayDate { get; set; }            //埋设年月
    public string LayMethod { get; set; }            //埋设方式

    public string Proad { get; set; }          //所在道路
    public string Source { get; set; }          //数据来源
    public string LBMS { get; set; }               //起点埋深
    public string LEMS { get; set; }               //终点埋深
    public string LBTG { get; set; }               //起点高程
    public string LETG { get; set; }               //终点高程
    public string PStatus { get; set; }               //管线状态

    public object SHAPE { get; set; }
}
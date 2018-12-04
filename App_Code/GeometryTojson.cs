using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Spatial;
using Newtonsoft.Json;
using GeoJSON.Net.Geometry;

/// <summary>
/// Class1 的摘要说明
/// </summary>
public class GeometryTojJson
{
	public GeometryTojJson()
	{
		//
		// TODO: 在此处添加构造函数逻辑
		//
	}
	public static string mLineToJson(DbGeometry geo,string wkid)
	{
		string result = null;
		string paths = null;
		var type = geo.SpatialTypeName.ToLower();

		if (type.Equals("point"))
		{
			paths = GetEsPointText(geo);
		}
		else
		{
			paths = GetEsMultiPointText(geo);
		}
		if (type == "linestring")
		{
			type = "polyline";
		}
		//result += "{\"type\" :\"" + type + "\"" + ", \"paths\" :" + paths + ", \"spatialReference\" :{"+"wkid:"+wkid+"}"+"}";
        result += "{\"paths\" :[" + paths + "]"+ ", \"spatialReference\" :{" + "wkid:" + wkid + "}" + "}";
		return result;
	}
	 /** 
	 * 将WKT文本字符串转换为ES中的GeoShape字符串格式 
	 * @param wkt 
	 * @return 
	 * @throws ParseException 
	 */  
		public static string GetEsGeoTextFromWkt(DbGeometry geo)  
		{  
  
			string result = null;  
			string coordinates = null;  
			var type = geo.SpatialTypeName.ToLower();  
  
			if (type.Equals("point"))  
			{  
				coordinates = GetEsPointText(geo);  
			}  
			else  
			{  
				coordinates = GetEsMultiPointText(geo);  
			}  
			result += "{\"type\" :\"" + type + "\"" + ", \"coordinates\" :" + coordinates + "}";  
			return result;  
		}  
  
		/** 
	 * 通过MultiPoint对象拼接中括号表示的字符串 
	 * @param multiPoint 
	 * @return 
	 */  
		private static String GetEsMultiPointText(DbGeometry polygon)  
		{  
			var wkt = polygon.WellKnownValue.WellKnownText;  
			var startIndex = wkt.IndexOf('(');  
			var endIndex = wkt.LastIndexOf(')');  
			var coordinates = wkt.Substring(startIndex, endIndex - startIndex + 1);  
			var coods = coordinates.Replace('(', '[').Replace(')', ']').Split(',');  
			var result = "";  
			foreach (var cood in coods)  
			{  
			   var s= cood.TrimStart().Replace(' ', ',');  
				result += string.Format("[" + s + "],");  
			}  
			result= result.Remove(result.Length - 1);  
			return result;  
		}  
  
		/** 
	 * 通过Point对象拼接中括号表示的字符串 
	 * @param point 
	 * @return 
	 */  
		public static String GetEsPointText(DbGeometry point)  
		{  
			return "[" + point.XCoordinate + "," + point.YCoordinate + "]";  
		}  
  
		public static dynamic GetGeoJson(DbGeometry geo)  
		{  
			var geoText = GetEsGeoTextFromWkt(geo);  
			var type = geo.SpatialTypeName.ToLower();  
  
			switch (type)  
			{
				case "point": return JsonConvert.DeserializeObject<Point>(geoText);
				case "linestring": return JsonConvert.DeserializeObject<LineString>(geoText); 
				case "polygon": return JsonConvert.DeserializeObject<Polygon>(geoText);
				case "multipolygon": return JsonConvert.DeserializeObject<MultiPolygon>(geoText);
				case "multilinestring": return JsonConvert.DeserializeObject<MultiLineString>(geoText); 
				default: return null;  
			}  
		}   
}
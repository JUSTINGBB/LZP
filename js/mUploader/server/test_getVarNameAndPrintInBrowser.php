<!DOCTYPE html> 
<html> 
<body> 

<?php
$GLOBALS['console'] = '';
function console($log='')
 {

     switch (empty($log)) {
         case False:
             $out = json_encode($log);
             $GLOBALS['console'] .= 'console.log('.$out.');';
             // echo '<script type="text/javascript">'.$GLOBALS['console'].'</script>';
             break;
         
         default:
         	 echo '<script type="text/javascript">'.$GLOBALS['console'].'</script>';
     }
 }
$a='dadsa';
$cars=array("Volvo","BMW","Toyota");
console($a);
console($cars);
console('999');

#echo '<script type="text/javascript">console.log("'.$a.'")</script>';

$c = '100'; 
echo '$c name is:'.get_variable_name($c).'_fuck'.' value:'.$c; // $a name is: a value: 100 
/**
* @param String $var   要查找的变量
* @param Array  $scope 要搜寻的范围
* @param String        变量名称
*/
function get_variable_name(&$var, $scope=null){ 
	$scope = $scope==null? $GLOBALS : $scope; // 如果没有范围则在globals中找寻 
	// 因有可能有相同值的变量,因此先将当前变量的值保存到一个临时变量中,然后再对原变量赋唯一值,以便查找出变量的名称,找到名字后,将临时变量的值重新赋值到原变量	
	$tmp = $var;
		
	$var = 'tmp_value_'.mt_rand();

	console($var);
	$name = array_search($var, $scope, true); // 根据值查找变量名称 

	console($name);
	#console();

	$var = $tmp;	
	return $name;
}

?> 
</body> 
</html>
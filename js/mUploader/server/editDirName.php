<?php  
//修改目录
/*
 * @param  editefile   // 修改文件的方法
 * @param  jpath   // 旧的文件夹名
 * @param  xpath  // 新的文件夹名
 * @param  is_dir()  // 判断有没有旧目录
 * @param  rename() // 修改目录的函数
 */
$img_dirStr2 = '../../../panorama/userLandPointsImg/';
$oldName = $_GET["oldName"];
$newName = $_GET["newName"];
//echo '文件夹'.$oldName.'改为'.$newName;

//utf-8到gb2312
$_path = iconv('utf-8', 'gb2312', $img_dirStr2 .$oldName);//旧文件名
$__path = iconv('utf-8', 'gb2312', $img_dirStr2 .$newName);//新文件名
//$_path=$img_dirStr2 .$oldName;
//$__path =$img_dirStr2 .$newName;
editfile($_path,$__path);
function  editfile($_path,$__path){
    if(file_exists($_path) && is_dir($_path)){//判断路旧径存在且为目录
        
        if(file_exists($__path)==false){//新目录不存在
            if (rename($_path,$__path))//修改目录
            {
                $value['file']='修改成功';
                $value['success']='success';
                //echo $value['file'];
            }
            else
            {
                $value['file']='修改失败';
                $value['fail']='fail';
                echo $value['file'];
            }
        }
        else if(file_exists($__path) && is_dir($__path)){
            $value['file']='有同级目录名相同';
            $value['fail']='fail';
            //echo $value['file'];
        }
    }else{
        if(file_exists($__path)==false){//新目录不存在
            mkdir($__path);
            $value['file']='创建新目录';
            $value['fail']='success';
        }else if(file_exists($__path) && is_dir($__path)){
            $value['file']='有同级目录名相同';
            $value['fail']='fail';
        }
        //echo $value['file'];
        //创建该文件夹
    }
    echo $value['file'];
    return $value; 
}
?>
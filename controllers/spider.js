const getListModel = require('../models/getList');
const urlEncode = require('urlencode');
const superAgent = require('superagent');
require('superagent-charset')(superAgent);
const cheerio = require('cheerio');
const userAgent =  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36';
const cookie = 'ip_ck=5sOD4vzxj7QuMTQyNTY2LjE1MDYwMDcwOTY%3D; listSubcateId=57; Adshow=2; visited_serachKw=vivo%20X20%7COPPO%20R11s%20Plus; lv=1512723492; vn=19; z_pro_city=s_provice%3Dguangdong%26s_city%3Dguangzhou; userProvinceId=30; userCityId=347; userCountyId=0; userLocationId=9; realLocationId=9; userFidLocationId=9; visited_subcateProId=57-1167243';
const search = 'http://detail.zol.com.cn/index.php?c=SearchList&subcateId=57&keyword=';

const list1 = {};

list1['子型号'] = '';
list1['市场定位'] = '';
list1['终端支持能力'] = '';
list1['终端支持能力子项'] = '';
list1['是否支持FR'] = '' ;
list1['LTE设备是否支持CSFB'] = '';
list1['LTE设备是否支持单卡双待'] = '';
list1['TD-LTE-Category等级'] = '';
list1['是否支持上行载波聚合'] = '';
list1['上行载波聚合支持明细'] = '';
list1['是否支持下行载波聚合'] = '';
list1['下行载波聚合支持明细'] = '';
list1['是否支持VOLTE']  = '';
list1['VoLTE是否支持语音通话']='';
list1['VoLTE是否支持视频通话']='';
list1['CPU芯片型号(ARM版本)'] = '';
list1['是否触摸屏'] = '' ;
list1['屏幕个数'] = '1' ;
list1['是否支持多点触摸'] = '';
list1['主屏材质']= '6';
list1['主屏色深'] = '';
list1['输入'] = '';
list1['是否支持快速充电'] = '';
list1['键盘类型'] = '';
list1['卡槽数量']  = '1' ;
list1['SIM卡类型'] = '';
list1['是否支持双卡双待'] = '0';
list1['双卡制式'] = '';
list1['双卡SIM卡IMEI是否相同'] = '';
list1['是否支持OTA'] = '';
list1['SIM卡电压'] = '';
list1['微距镜头'] = '' ;
list1['补光灯个数'] = '';
list1['图像分辨率'] = '';
list1['图像格式']  = '' ;
list1['视频分辨率'] = '';
list1['视频帧数(fps)'] = '';
list1['软件版本(最新'] = '';
list1['开发平台'] = '';
list1['平台提供商'] = '';
list1['平台版本'] = '';
list1['数字基带'] = '';
list1['物理层和协议栈软件'] = '';
list1['模拟基带和射频'] = '';
list1['手机存储空间大小'] = '';
list1['用户可使用的最大内存空间'] = '';
list1['存储卡类型'] = '';
list1['存储卡最大容量'] = '';
list1['通讯录是否支持名片式号码簿']= '是';
list1['通讯录是否支持分组管理']= '是';
list1['网络制式']= '';
list1['制式等级'] ='';
list1['USSD'] = '';
list1['是否支持红外'] = '';
list1['HDMI接口类型'] = '';
list1['HDMI接口版本'] = '';
list1['数据接口类型'] = '';
list1['WAP版本']  = '';
list1['是否支持彩信'] = '1';
list1['是否支持Java'] = '';
list1['支持的图像格式'] = '';
list1['支持的声音格式'] = '';
list1['是否有独立扬声器'] = '是';
list1['是否支持mp3'] = '1';
list1['播放器支持的音乐格式'] = '';
list1['播放器支持的视频格式'] = '';
list1['支持的邮件协议'] = '';
list1['流媒体下载'] = '';
list1['流媒体支持的声音格式'] = '';
list1['流媒体支持的视频格式'] = '';
list1['是否支持动态内存'] = '';
list1['是否支持录音功能'] = '支持';
list1['解锁方式'] = '';
list1['关机闹铃'] = '支持';
list1['重力感应'] = '';
list1['距离感应器器'] = '支持';
list1['电子罗盘'] = '支持';
list1['FM收音机'] = '';
list1['光线感应器'] = '';
list1['长短信'] = '支持';
list1['手机自带短信回执'] = '支持';
list1['短信群发'] = '支持';
list1['MM客户端'] = '0';
list1['手机阅读'] = '0';
list1['无线城市'] = '0';
list1['G-plus游戏包'] = '0';
list1['游戏'] = '支持';
list1['是否支持显示附着状态'] = '';
list1['是否支持显示激活状态'] = '';
list1['是否支持显示数据传输'] = '';
list1['author'] = 'spider';


const getKeyWordResult = async (keyword)=>{
  const res = await superAgent.get(search+urlEncode(keyword,'gbk')).set('User-Agent',userAgent).set('Cookie',cookie).charset();
  const $ = cheerio.load(res.text);
  //搜索结果第一条信息的地址
  const device = $('div#wrapper div.main div.list-item').eq(0).find('h3').find('a').attr('href');
  //console.log(device);
  if(!device) {
    //console.log(`keyword ${keyword} no data match`);
    return {errKeyword:keyword};
  }else{
    return 'http://detail.zol.com.cn'+ device;
  }
};

const getUrl = async (url)=>{
  const list2 = {};
  const res = await superAgent(url).set('User-Agent',userAgent).set('Cookie',cookie).charset();
  const $ = cheerio.load(res.text);
  list2['全称'] =  $('h1.product-model__name').text().toUpperCase();
  list2['url'] =  'http://detail.zol.com.cn' + $('div.section a._j_MP_more').attr('href');
  list2['市场价格'] =  $('b.price-type').text();
  list2['厂商(中文)'] =  $('.breadcrumb a').eq(2).text().replace(/手机/ig,'').toUpperCase();
  list2['品牌(英文)'] =  list2['全称'].replace(/（.*/, '').replace(new RegExp(list2['厂商(中文)']), '').toUpperCase();
  list2['型号'] =  list2['全称'].replace(/（.*/, '').replace(new RegExp(list2['厂商(中文)']), '').toUpperCase();
  return {...list2} ;
};

const getDetail = async (url) =>{
  const list3 = {};
  const res = await superAgent(url).set('User-Agent',userAgent).set('Cookie',cookie).charset();
  const $ =  cheerio.load(res.text);
  const detail = $('div#newTb table li span').map((index, element)=>{
    if($(element).text() !== ''){return $(element).text()}
  }).toArray();
  detail.forEach((item, index)=>{
    switch(item){
      case '支持频段':
        list3['支持TD-LTE频段'] = detail[index+1];
        list3['网络制式'] = detail[index + 1];
        list3['频段'] = detail[index + 1];
        break ;
      case '4G网络':
        list3['是否支持FR'] = '1';
        break ;
      case '导航':
        list3['是否支持GPS'] = detail[index + 1].includes('GPS') ? '1' : '0';
        break;
      case '连接与共享' :
        list3['是否支持NFC'] = detail[index + 1].includes('NFC') ? '是' : '否';
        list3['蓝牙协议集'] = '';
        list3['是否支持蓝牙'] = detail[index + 1].includes('蓝牙')? '1' : '0';
        list3['支持的蓝牙版本'] = detail[index + 1];
        //list3['支持的蓝牙版本'] =detail[index + 1].includes('蓝牙')? detail[index + 1].match(/(蓝牙[^\，]+)/)[1] : '';
        break;
      case '手机尺寸':
        list3['机长(mm)'] = detail[index + 1].match(/(^[^x]+)/)[1];
        list3['机宽(mm)'] = detail[index + 1].match(/x([^x]+)x/)[1];
        list3['机厚(mm)'] = detail[index + 1].match(/x([^x]+)mm$/)[1];
        break;
      case '手机重量':
        list3['重量(g)'] = detail[index + 1].replace(/g/,'');
        break;
      case '造型设计':
        list3['外观'] =  detail[index + 1]  ;
        break;
      case '手机类型':
        list3['是否智能机'] = detail[index + 1].includes('智能') ? '1' : '0' ;
        list3['是否支持快速充电'] = detail[index + 1].includes('快充') ? '是' : '否';
        break;
      case '上市日期':
        list3['上市时间(年月，格式：YYYYMM)'] = detail[index + 1].replace(/[年,月]/g, '').substring(0,6);
        break;
      case '核心数':
        list3['CPU数量'] = detail[index + 1];
        break;
      case 'CPU频率':
        list3['CPU时钟频率(MHz)'] = detail[index + 1];
        break;
      case 'CPU型号':
        list3['CPU厂家'] = detail[index + 1].match(/^([\S]+)/)[1];
        list3['CPU型号'] = detail[index + 1];
        break;
      case '触摸屏类型':
        list3['键盘类型'] = '1';
        list3['是否触摸屏'] = '是';
        list3['触摸屏类型'] = detail[index + 1].includes('电容') ? '1' : detail[index + 1].includes('电阻') ? '2' : '3';
        list3['是否支持多点触摸'] = detail[index + 1].includes('多点') ? '是' : '否' ;
        break;
      case '副屏参数':
        list3['屏幕个数'] = 2;
        break;
      case '主屏尺寸':
        list3['主屏大小(英寸)'] = detail[index + 1].replace(/英寸/, '');
        break;
      case '主屏分辨率':
        list3['主屏分辨率(横)'] = detail[index + 1].match(/([\d]+)x/)[1];
        list3['主屏分辨率(纵)'] = detail[index + 1].match(/x([\d]+)/)[1];
        break;
      case '主屏材质':
        list3['主屏材质'] = detail[index + 1];
        break;
      case '机身接口':
        list3['充电器接口'] = detail[index + 1].replace(/^[^，]+，/, '');
        list3['耳机接口类型'] = detail[index + 1].includes('耳机')? detail[index + 1].match(/(^[^，]+)，/)[1] : '';
        list3['USB接口版本'] = detail[index + 1].replace(/^[^，]+，/, '');
        break;
      case '电池容量':
        list3['电池容量'] = detail[index + 1];
        break;
      case '理论待机时间':
        list3['待机时间(小时)'] = detail[index + 1];
        break;
      case '理论通话时间':
        list3['通话时间(小时)'] = detail[index + 1];
        break;
      case 'SIM卡':
        list3['卡槽数量'] = detail[index + 1].includes('双卡') ? '2' : '1';
        list3['是否支持双卡双待'] = detail[index + 1].includes('双卡') ? '1' : '0';
        //list3['SIM卡类型'] = detail[index + 1].replace(/[^\，]*\，/,'');
        list3['SIM卡类型'] = detail[index + 1];
        break;
      case '摄像头类型':
        list3['摄像头'] = detail[index + 1];
        break;
      case '后置摄像头':
        list3['摄像头像素(万像素)'] = detail[index + 1];
        break;
      case '闪光灯':
        list3['闪光灯个数'] = detail[index + 1];
        break;
      case '拍照功能':
        list3['照相功能'] = detail[index + 1];
        break;
      case '操作系统':
        list3['操作系统'] = detail[index + 1] ;
        list3['操作系统版本'] = detail[index + 1];
        break;
      case 'RAM容量':
        list3['RAM大小'] = detail[index + 1];
        break;
      case 'ROM容量':
        list3['ROM大小'] = detail[index + 1];
        break;
      case '存储卡':
        list3['存储卡类型'] = '1';
        break;
      case '扩展容量':
        list3['存储卡最大容量'] = detail[index + 1];
        break;
      case 'WLAN功能':
        list3['WIFI'] = detail[index + 1].includes('WIFI')?'1':'0';
        list3['WIFI支持协议'] = detail[index + 1];
        list3['是否支持网络热点'] = detail[index + 1].includes('WIFI')?'是':'否';
        break;
    }
  });
  return {...list3};
};


exports.spider = (req, res)=>{
  (async ()=>{
    const result = {errKeyword:[],valid:[],exist:[]};
    for(let keyWord of req.body.query){
      //console.log(keyWord);
      const generalUrl = await getKeyWordResult(keyWord);
      //console.log(generalUrl);
      if(typeof generalUrl === 'string'){
        const generalPage = await getUrl(generalUrl);
        const check = await getListModel.findOne({
          '厂商(中文)':{$regex:generalPage['厂商(中文)'], $options:"i"},
          '型号':{$regex:generalPage['型号'], $options:"i"}
        });
        if(!check){
          const detailInfo = await getDetail(generalPage.url);
          result.valid.push({...list1,...generalPage,...detailInfo});
          await getListModel.create({...list1,...generalPage,...detailInfo})
        }else{
          result.exist.push(check);
        }
      }else{
        result.errKeyword.push(generalUrl.errKeyword)
      }
    }
    return result;
  })()
    .then(result=>res.send(JSON.stringify(result)))
    .catch(err=>res.send(JSON.stringify(err)));
};

exports.handleSpider = async (queries) => {
  //console.log(queries);
  //厂商和型号，用空格可开，输入的时候记得隔开。
  const result = {errKeyword:[],valid:[],exist:[]};
  
  for(let keyWord of queries){
    const info = keyWord.split(' ');
    const deviceInfo = {'厂商(中文)':info[0], '型号':info[1]};
    const generalUrl = await getKeyWordResult(keyWord);
    //console.log(generalUrl);
    if(typeof generalUrl === 'string'){
      const generalPage = await getUrl(generalUrl);
      const check = await getListModel.findOne({
        '厂商(中文)':{$regex:generalPage['厂商(中文)'], $options:"i"},
        '型号':{$regex:generalPage['型号'], $options:"i"}
      });

      if(!check){
        const detailInfo = await getDetail(generalPage.url);
        result.valid.push({...list1,...generalPage,...detailInfo});
        //在info数据库中创建一条爬虫结果，用录入的型号和厂商名称替换 爬虫得到的厂商与品牌
        await getListModel.create({...list1,...generalPage,...detailInfo,...deviceInfo})
      }else{
        result.exist.push(check);
      }
    }else{
      //先检验一下数据是否存在，如果不存在就新增一条数据
      const check = await getListModel.findOne(deviceInfo);
      if(!check){
        await getListModel.create(deviceInfo);
      }
      result.errKeyword.push(generalUrl.errKeyword);
    }
  }
  return result;
};

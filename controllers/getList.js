const getListModel = require('../models/getList');
const charset = require ('superagent-charset');
const superAgent = charset(require('superagent'));

//const superAgent = require('superagent');
const cheerio =require('cheerio');
const phantom = require('phantom');


exports.getList = (req, res)=>{

  const list = {};


  list['子型号'] = '';
  list['市场定位'] = '';
  list['终端支持能力'] = '';
  list['终端支持能力子项'] = '';
  list['是否支持FR'] = '' ;
  list['LTE设备是否支持CSFB'] = '';
  list['LTE设备是否支持单卡双待'] = '';
  list['TD-LTE-Category等级'] = '';
  list['是否支持上行载波聚合'] = '';
  list['上行载波聚合支持明细'] = '';
  list['是否支持下行载波聚合'] = '';
  list['下行载波聚合支持明细'] = '';
  list['是否支持VOLTE']  = '';
  list['VoLTE是否支持语音通话']='';
  list['VoLTE是否支持视频通话']='';
  list['CPU芯片型号(ARM版本)'] = '';
  list['是否触摸屏'] = '' ;
  list['屏幕个数'] = '1' ;
  list['是否支持多点触摸'] = '';
  list['主屏材质']= '6';
  list['主屏色深'] = '';
  list['输入'] = '';
  list['是否支持快速充电'] = '';
  list['键盘类型'] = '';
  list['卡槽数量']  = '1' ;
  list['SIM卡类型'] = '';
  list['是否支持双卡双待'] = '0';
  list['双卡制式'] = '';
  list['双卡SIM卡IMEI是否相同'] = '';
  list['是否支持OTA'] = '';
  list['SIM卡电压'] = '';
  list['微距镜头'] = '' ;
  list['补光灯个数'] = '';
  list['图像分辨率'] = '';
  list['图像格式']  = '' ;
  list['视频分辨率'] = '';
  list['视频帧数(fps)'] = '';
  list['软件版本(最新'] = '';
  list['开发平台'] = '';
  list['平台提供商'] = '';
  list['平台版本'] = '';
  list['数字基带'] = '';
  list['物理层和协议栈软件'] = '';
  list['模拟基带和射频'] = '';
  list['手机存储空间大小'] = '';
  list['用户可使用的最大内存空间'] = '';
  list['存储卡类型'] = '';
  list['存储卡最大容量'] = '';
  list['通讯录是否支持名片式号码簿']= '是';
  list['通讯录是否支持分组管理']= '是';
  list['网络制式']= '';
  list['制式等级'] ='';
  list['USSD'] = '';
  list['是否支持红外'] = '';
  list['HDMI接口类型'] = '';
  list['HDMI接口版本'] = '';
  list['数据接口类型'] = '';
  list['WAP版本']  = '';
  list['是否支持彩信'] = '1';
  list['是否支持Java'] = '';
  list['支持的图像格式'] = '';
  list['支持的声音格式'] = '';
  list['是否有独立扬声器'] = '是';
  list['是否支持mp3'] = '1';
  list['播放器支持的音乐格式'] = '';
  list['播放器支持的视频格式'] = '';
  list['支持的邮件协议'] = '';
  list['流媒体下载'] = '';
  list['流媒体支持的声音格式'] = '';
  list['流媒体支持的视频格式'] = '';
  list['是否支持动态内存'] = '';
  list['是否支持录音功能'] = '支持';
  list['解锁方式'] = '';
  list['关机闹铃'] = '支持';
  list['重力感应'] = '';
  list['距离感应器器'] = '支持';
  list['电子罗盘'] = '支持';
  list['FM收音机'] = '';
  list['光线感应器'] = '';
  list['长短信'] = '支持';
  list['手机自带短信回执'] = '支持';
  list['短信群发'] = '支持';
  list['MM客户端'] = '0';
  list['手机阅读'] = '0';
  list['无线城市'] = '0';
  list['G-plus游戏包'] = '0';
  list['游戏'] = '支持';
  list['是否支持显示附着状态'] = '';
  list['是否支持显示激活状态'] = '';
  list['是否支持显示数据传输'] = '';
  list['author'] = 'spider';


  const getList = async (url)=>{
    const res = await superAgent(url).charset();
    const $ = await cheerio.load(res.text);
    return $('div.info div.title a').map((index, element)=>({url: element.attribs.href})).toArray();
  };


  const getUrl = async (url)=>{
    const res = await superAgent(url).charset();
    const $ = await cheerio.load(res.text);
    list['全称'] = await $('h1.product-model__name').text();
    list['url'] = await 'http://detail.zol.com.cn' + $('div#_j_tag_nav ul li a').eq(3).attr('href');
    list['市场价格'] = await $('b.price-type').text();
    list['厂商(中文)'] = await $('.breadcrumb a').eq(2).text().replace(/手机/ig,'');
    list['品牌(英文)'] = await list['全称'].replace(/（.*/, '').replace(new RegExp(list['厂商(中文)']), '');
    list['型号'] = await list['全称'].replace(/（.*/, '').replace(new RegExp(list['厂商(中文)']), '');
    return list ;
  };

  const getDetail = async(url)=>{
    const instance = await phantom.create(['--ignore-ssl-errors=yes','--load-images=no','--disk-cache=yes']);
    const page = await instance.createPage();
    page.setting('resourceTimeout',5000);
    // await page.on('onResourceRequested',requestData=>{
    //   console.info('Requesting', requestData.url)
    // });
    const status = await page.open(url);
    console.log(status);
    const content = await page.property('content');
    const $ = await cheerio.load(content);
    const detail = await $('div#newTb table li span').map((index, element)=>{
      if($(element).text() !== ''){return $(element).text()}
    }).toArray();

    await detail.forEach((item, index)=>{
      switch(item){
        case '支持频段':
          list['支持TD-LTE频段'] = detail[index + 1].includes('TD-LTE')? detail[index + 1].match(/TD-LTE\s([^\\]+)\n/)[1] :'';
          let i =0;
          list['网络制式'] = ['TD-SCDMA','GSM','CDMA','EDGE','WCDMA','CDMA2000','CDMA 1X',
            'CDMA EVDO'].reduce((pre, cur)=>{
              i++;
              if(detail[index + 1].includes(cur)){
                return pre.concat(i)
              }else{
                return pre
              }},[]).toString();
          list['频段'] = detail[index + 1];
          break ;
        case '4G网络':
          list['是否支持FR'] = '1';
          break ;
        case '导航':
          list['是否支持GPS'] = detail[index + 1].includes('GPS') ? '1' : '0';
          break;
        case '连接与共享' :
          list['是否支持NFC'] = detail[index + 1].includes('NFC') ? '是' : '否';
          list['蓝牙协议集'] = '';
          list['是否支持蓝牙'] = detail[index + 1].includes('蓝牙')? '1' : '0';
          list['支持的蓝牙版本'] = '蓝牙';
          //list['支持的蓝牙版本'] =detail[index + 1].includes('蓝牙')? detail[index + 1].match(/(蓝牙[^\，]+)/)[1] : '';
          break;
        case '手机尺寸':
          list['机长(mm)'] = detail[index + 1].match(/(^[^x]+)/)[1];
          list['机宽(mm)'] = detail[index + 1].match(/x([^x]+)x/)[1];
          list['机厚(mm)'] = detail[index + 1].match(/x([^x]+)mm$/)[1];
          break;
        case '手机重量':
          list['重量(g)'] = detail[index + 1].replace(/g/,'');
          break;
        case '造型设计':
          list['外观'] =  ['翻盖','直板','滑盖','侧滑盖','旋转屏','全键盘','全触屏'].findIndex(item=> item === detail[index + 1])+1+''   ;
          break;
        case '手机类型':
          list['是否智能机'] = detail[index + 1].includes('智能') ? '1' : '0' ;
          list['是否支持快速充电'] = detail[index + 1].includes('快充') ? '是' : '否';
          break;
        case '上市日期':
          list['上市时间'] = detail[index + 1].replace(/[年,月]/g, '').substring(0,6);
          break;
        case '核心数':
          list['CPU数量'] = detail[index + 1];
          break;
        case 'CPU频率':
          list['CPU时钟频率(MHz)'] = detail[index + 1];
          break;
        case 'CPU型号':
          list['CPU厂家'] = detail[index + 1].match(/^([\S]+)/)[1];
          list['CPU型号'] = detail[index + 1];
          break;
        case '触摸屏类型':
          list['键盘类型'] = '1';
          list['是否触摸屏'] = '是';
          list['触摸屏类型'] = detail[index + 1].includes('电容') ? '1' : detail[index + 1].includes('电阻') ? '2' : '3';
          list['是否支持多点触摸'] = detail[index + 1].includes('多点') ? '是' : '否' ;
          break;
        case '副屏参数':
          list['屏幕个数'] = 2;
          break;
        case '主屏尺寸':
          list['主屏大小(英寸)'] = detail[index + 1].replace(/英寸/, '');
          break;
        case '主屏分辨率':
          list['主屏分辨率(横)'] = detail[index + 1].match(/([\d]+)x/)[1];
          list['主屏分辨率(纵)'] = detail[index + 1].match(/x([\d]+)/)[1];
          break;
        case '主屏材质':
          list['主屏材质'] = ['AMOLED','SLCD','TFT','ASV','IPS','其他','OGS'].findIndex(item=>detail[index + 1].includes(item))+1+'';

          break;
        case '机身接口':
          list['充电器接口'] = detail[index + 1].replace(/^[^\，]+\，/, '');
          list['耳机接口类型'] = detail[index + 1].includes('耳机')? detail[index + 1].match(/(^[^\，]+)\，/)[1] : undefined;
          list['USB接口版本'] = detail[index + 1].replace(/^[^\，]+\，/, '');

          break;
        case '电池容量':
          list['电池容量'] = detail[index + 1];
          break;
        case '理论待机时间':
          list['待机时间(小时)'] = detail[index + 1];
          break;
        case '理论通话时间':
          list['通话时间(小时)'] = detail[index + 1];
          break;
        case 'SIM卡':
          list['卡槽数量'] = detail[index + 1].includes('双卡') ? '2' : '1';
          list['是否支持双卡双待'] = detail[index + 1].includes('双卡') ? '1' : '0';
          list['SIM卡类型'] = detail[index + 1].replace(/[^\，]*\，/,'');
          break;
        case '摄像头类型':
          list['摄像头'] = detail[index + 1];
          break;
        case '后置摄像头':
          list['摄像头像素(万像素)'] = detail[index + 1];
          break;
        case '闪光灯':
          list['闪光灯个数'] = detail[index + 1];
          break;
        case '拍照功能':
          list['照相功能'] = detail[index + 1];
          break;
        case '操作系统':
          list['操作系统'] = ['ophone','windows mobile','windows ce','Android','symbian','linux','palm',
            'mkt','其他','iOS','Windows','blackberry','oms','meego'].findIndex(item=>detail[index + 1].includes(item))+1   ;
          list['操作系统版本'] = detail[index + 1];
          break;
        case 'RAM容量':
          list['RAM大小'] = detail[index + 1];
          break;
        case 'ROM容量':
          list['ROM大小'] = detail[index + 1];
          break;
        case '存储卡':
          list['存储卡类型'] = '1';
          break;
        case '扩展容量':
          list['存储卡最大容量'] = detail[index + 1];
          break;
        case 'WLAN功能':
          list['WIFI'] = detail[index + 1].includes('WIFI')?'1':'0';
          list['WIFI支持协议'] = detail[index + 1];
          list['是否支持网络热点'] = detail[index + 1].includes('WIFI')?'是':'否';
          break;
      }
    });

    await instance.exit();
    return list;
  };

  const spider = async (url)=>{
    const list = await getList(url);
    const arr = [];

    for (let item of list){
      let general = await getUrl(item.url);
      arr.push({...general});
    }

    for (let item of arr){
      let detail = await getDetail(item.url);
      await getListModel.create({...detail,...item});

    }

  };

  spider('http://mobile.zol.com.cn/').catch(console.log);
  res.send(JSON.stringify('处理中'));
};

exports.getPrice = (req, res) =>{
  getListModel.find({},{generalUrl:1},(err,doc)=>{
    doc.forEach(item=>{
      superAgent.get(item.generalUrl)
      .charset()
      .then((success)=>{
        const $ = cheerio.load(success.text);
        let price = $('div#_j_local_price a.price').text();
        let fullName =  $('.product-model__name').text();
        getListModel.update({'全称':fullName},{$set:{'市场价格':price}},(err,doc)=>{
          console.log(doc);
        });
      })
    })
  });
  res.send('1')
};


exports.query = (req,res)=>{
  getListModel.query(req.body.query,(err, doc)=>{
    if(err) console.log(err);
    res.send(doc)
  });
};


exports.updates = (req, res) =>{
  getListModel.updates(req.body.update,(err,doc)=>{
    if(err) console.log(err);
    res.send(doc)
  })
};

exports.add=(req, res)=>{
  
  const list = {};


  list['子型号'] = '';
  list['市场定位'] = '';
  list['终端支持能力'] = '';
  list['终端支持能力子项'] = '';
  list['是否支持FR'] = '' ;
  list['LTE设备是否支持CSFB'] = '';
  list['LTE设备是否支持单卡双待'] = '';
  list['TD-LTE-Category等级'] = '';
  list['是否支持上行载波聚合'] = '';
  list['上行载波聚合支持明细'] = '';
  list['是否支持下行载波聚合'] = '';
  list['下行载波聚合支持明细'] = '';
  list['是否支持VOLTE']  = '';
  list['VoLTE是否支持语音通话']='';
  list['VoLTE是否支持视频通话']='';
  list['CPU芯片型号(ARM版本)'] = '';
  list['是否触摸屏'] = '' ;
  list['屏幕个数'] = '1' ;
  list['是否支持多点触摸'] = '';
  list['主屏材质']= '6';
  list['主屏色深'] = '';
  list['输入'] = '';
  list['是否支持快速充电'] = '';
  list['键盘类型'] = '';
  list['卡槽数量']  = '1' ;
  list['SIM卡类型'] = '';
  list['是否支持双卡双待'] = '0';
  list['双卡制式'] = '';
  list['双卡SIM卡IMEI是否相同'] = '';
  list['是否支持OTA'] = '';
  list['SIM卡电压'] = '';
  list['微距镜头'] = '' ;
  list['补光灯个数'] = '';
  list['图像分辨率'] = '';
  list['图像格式']  = '' ;
  list['视频分辨率'] = '';
  list['视频帧数(fps)'] = '';
  list['软件版本(最新'] = '';
  list['开发平台'] = '';
  list['平台提供商'] = '';
  list['平台版本'] = '';
  list['数字基带'] = '';
  list['物理层和协议栈软件'] = '';
  list['模拟基带和射频'] = '';
  list['手机存储空间大小'] = '';
  list['用户可使用的最大内存空间'] = '';
  list['存储卡类型'] = '';
  list['存储卡最大容量'] = '';
  list['通讯录是否支持名片式号码簿']= '是';
  list['通讯录是否支持分组管理']= '是';
  list['网络制式']= '';
  list['制式等级'] ='';
  list['USSD'] = '';
  list['是否支持红外'] = '';
  list['HDMI接口类型'] = '';
  list['HDMI接口版本'] = '';
  list['数据接口类型'] = '';
  list['WAP版本']  = '';
  list['是否支持彩信'] = '1';
  list['是否支持Java'] = '';
  list['支持的图像格式'] = '';
  list['支持的声音格式'] = '';
  list['是否有独立扬声器'] = '是';
  list['是否支持mp3'] = '1';
  list['播放器支持的音乐格式'] = '';
  list['播放器支持的视频格式'] = '';
  list['支持的邮件协议'] = '';
  list['流媒体下载'] = '';
  list['流媒体支持的声音格式'] = '';
  list['流媒体支持的视频格式'] = '';
  list['是否支持动态内存'] = '';
  list['是否支持录音功能'] = '支持';
  list['解锁方式'] = '';
  list['关机闹铃'] = '支持';
  list['重力感应'] = '';
  list['距离感应器器'] = '支持';
  list['电子罗盘'] = '支持';
  list['FM收音机'] = '';
  list['光线感应器'] = '';
  list['长短信'] = '支持';
  list['手机自带短信回执'] = '支持';
  list['短信群发'] = '支持';
  list['MM客户端'] = '0';
  list['手机阅读'] = '0';
  list['无线城市'] = '0';
  list['G-plus游戏包'] = '0';
  list['游戏'] = '支持';
  list['是否支持显示附着状态'] = '';
  list['是否支持显示激活状态'] = '';
  list['是否支持显示数据传输'] = '';
  list['author'] = 'spider';

  const getUrl = async (url)=>{
    const res = await superAgent(url).charset();
    const $ = await cheerio.load(res.text);
    list['全称'] = await $('h1.product-model__name').text();
    list['url'] = await 'http://detail.zol.com.cn' + $('div#_j_tag_nav ul li a').eq(2).attr('href');
    list['市场价格'] = await $('b.price-type').text();
    list['厂商(中文)'] = await $('.breadcrumb a').eq(2).text().replace(/手机/ig,'');
    list['品牌(英文)'] = await list['全称'].replace(/（.*/, '').replace(new RegExp(list['厂商(中文)']), '');
    list['型号'] = await list['全称'].replace(/（.*/, '').replace(new RegExp(list['厂商(中文)']), '');
    return list ;
  };

  const getDetail = async(url)=>{
    const instance = await phantom.create(['--ignore-ssl-errors=yes','--load-images=no','--disk-cache=yes']);
    const page = await instance.createPage();
    page.setting('resourceTimeout',5000);
    // await page.on('onResourceRequested',requestData=>{
    //   console.info('Requesting', requestData.url)
    // });
    const status = await page.open(url);
    console.log(status);
    const content = await page.property('content');
    const $ = await cheerio.load(content);
    const detail = await $('div#newTb table li span').map((index, element)=>{
      if($(element).text() !== ''){return $(element).text()}
    }).toArray();
    

    await detail.forEach((item, index)=>{
      switch(item){
        case '支持频段':
          list['支持TD-LTE频段'] = detail[index + 1].includes('TD-LTE')? detail[index + 1].match(/TD-LTE\s([^\\]+)\n/)[1] :'';
          let i =0;
          list['网络制式'] = ['TD-SCDMA','GSM','CDMA','EDGE','WCDMA','CDMA2000','CDMA 1X',
            'CDMA EVDO'].reduce((pre, cur)=>{
            i++;
            if(detail[index + 1].includes(cur)){
              return pre.concat(i)
            }else{
              return pre
            }},[]).toString();
          list['频段'] = detail[index + 1];
          break ;
        case '4G网络':
          list['是否支持FR'] = '1';
          break ;
        case '导航':
          list['是否支持GPS'] = detail[index + 1].includes('GPS') ? '1' : '0';
          break;
        case '连接与共享' :
          list['是否支持NFC'] = detail[index + 1].includes('NFC') ? '是' : '否';
          list['蓝牙协议集'] = '';
          list['是否支持蓝牙'] = detail[index + 1].includes('蓝牙')? '1' : '0';
          list['支持的蓝牙版本'] = '蓝牙';
          //list['支持的蓝牙版本'] =detail[index + 1].includes('蓝牙')? detail[index + 1].match(/(蓝牙[^\，]+)/)[1] : '';
          break;
        case '手机尺寸':
          list['机长(mm)'] = detail[index + 1].match(/(^[^x]+)/)[1];
          list['机宽(mm)'] = detail[index + 1].match(/x([^x]+)x/)[1];
          list['机厚(mm)'] = detail[index + 1].match(/x([^x]+)mm$/)[1];
          break;
        case '手机重量':
          list['重量(g)'] = detail[index + 1].replace(/g/,'');
          break;
        case '造型设计':
          list['外观'] =  ['翻盖','直板','滑盖','侧滑盖','旋转屏','全键盘','全触屏'].findIndex(item=> item === detail[index + 1])+1+''   ;
          break;
        case '手机类型':
          list['是否智能机'] = detail[index + 1].includes('智能') ? '1' : '0' ;
          list['是否支持快速充电'] = detail[index + 1].includes('快充') ? '是' : '否';
          break;
        case '上市日期':
          list['上市时间'] = detail[index + 1].replace(/[年,月]/g, '').substring(0,6);
          break;
        case '核心数':
          list['CPU数量'] = detail[index + 1];
          break;
        case 'CPU频率':
          list['CPU时钟频率(MHz)'] = detail[index + 1];
          break;
        case 'CPU型号':
          list['CPU厂家'] = detail[index + 1].match(/^([\S]+)/)[1];
          list['CPU型号'] = detail[index + 1];
          break;
        case '触摸屏类型':
          list['键盘类型'] = '1';
          list['是否触摸屏'] = '是';
          list['触摸屏类型'] = detail[index + 1].includes('电容') ? '1' : detail[index + 1].includes('电阻') ? '2' : '3';
          list['是否支持多点触摸'] = detail[index + 1].includes('多点') ? '是' : '否' ;
          break;
        case '副屏参数':
          list['屏幕个数'] = 2;
          break;
        case '主屏尺寸':
          list['主屏大小(英寸)'] = detail[index + 1].replace(/英寸/, '');
          break;
        case '主屏分辨率':
          list['主屏分辨率(横)'] = detail[index + 1].match(/([\d]+)x/)[1];
          list['主屏分辨率(纵)'] = detail[index + 1].match(/x([\d]+)/)[1];
          break;
        case '主屏材质':
          list['主屏材质'] = ['AMOLED','SLCD','TFT','ASV','IPS','其他','OGS'].findIndex(item=>detail[index + 1].includes(item))+1+'';

          break;
        case '机身接口':
          list['充电器接口'] = detail[index + 1].replace(/^[^\，]+\，/, '');
          list['耳机接口类型'] = detail[index + 1].includes('耳机')? detail[index + 1].match(/(^[^\，]+)\，/)[1] : undefined;
          list['USB接口版本'] = detail[index + 1].replace(/^[^\，]+\，/, '');

          break;
        case '电池容量':
          list['电池容量'] = detail[index + 1];
          break;
        case '理论待机时间':
          list['待机时间(小时)'] = detail[index + 1];
          break;
        case '理论通话时间':
          list['通话时间(小时)'] = detail[index + 1];
          break;
        case 'SIM卡':
          list['卡槽数量'] = detail[index + 1].includes('双卡') ? '2' : '1';
          list['是否支持双卡双待'] = detail[index + 1].includes('双卡') ? '1' : '0';
          list['SIM卡类型'] = detail[index + 1].replace(/[^\，]*\，/,'');
          break;
        case '摄像头类型':
          list['摄像头'] = detail[index + 1];
          break;
        case '后置摄像头':
          list['摄像头像素(万像素)'] = detail[index + 1];
          break;
        case '闪光灯':
          list['闪光灯个数'] = detail[index + 1];
          break;
        case '拍照功能':
          list['照相功能'] = detail[index + 1];
          break;
        case '操作系统':
          list['操作系统'] = ['ophone','windows mobile','windows ce','Android','symbian','linux','palm',
            'mkt','其他','iOS','Windows','blackberry','oms','meego'].findIndex(item=>detail[index + 1].includes(item))+1   ;
          list['操作系统版本'] = detail[index + 1];
          break;
        case 'RAM容量':
          list['RAM大小'] = detail[index + 1];
          break;
        case 'ROM容量':
          list['ROM大小'] = detail[index + 1];
          break;
        case '存储卡':
          list['存储卡类型'] = '1';
          break;
        case '扩展容量':
          list['存储卡最大容量'] = detail[index + 1];
          break;
        case 'WLAN功能':
          list['WIFI'] = detail[index + 1].includes('WIFI')?'1':'0';
          list['WIFI支持协议'] = detail[index + 1];
          list['是否支持网络热点'] = detail[index + 1].includes('WIFI')?'是':'否';
          break;
      }
    });
    await instance.exit();
    return list;
  };

  const add = async (url) =>{

    await getUrl(url);
    await getDetail(list.url);
    await getListModel.create(list);
    return list;
    
  };

  add(req.body.add)
  .then(list=>{
    res.send(list);
  })
  .catch(err=>{
    console.log(err);
    res.send('2')
  })



};

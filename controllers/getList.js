const getListModel = require('../models/getList');
const charset = require ('superagent-charset');
const superAgent = charset(require('superagent'));
const cheerio =require('cheerio');

exports.getList = (req, res)=>{

  const list = {};
  const detail = [];
  list['是否支持GPS'] = false;
  list['是否支持NFC'] = false;
  list['是否支持FR'] = false ;
  list['是否触摸屏'] = false ;
  list['是否支持多点触摸'] = false;
  list['屏幕个数'] = 1 ;
  list['是否支持快速充电'] = false;
  list['卡槽数量'] = 1;
  list['通讯录是否支持名片式号码簿']=true;
  list['通讯录是否支持名片式号码簿']=true;
  list['是否支持蓝牙'] = false;
  list['WIFI'] = false;
  list['是否支持网络热点'] = false;
  list['url'] = '';
  list['价格'] = '';
  list['子型号'] = '';
  list['双卡制式'] = '';
  list['操作系统版本'] = '';
  list['CSFB']= '';
  list['单卡双待'] = '';
  list['上行载波聚合'] = '';
  list['下行载波聚合']  = '';
  list['VOLTE'] = '';

  superAgent.get('http://mobile.zol.com.cn/')
    .charset()
    .then((success)=>{
      const $ = cheerio.load(success.text);
      $('#manu-switc-1 ul li .title a').each((index, element)=>{
        superAgent.get($(element).attr('href'))
          .charset()
          .then((success)=>{
            const $ = cheerio.load(success.text);
            let hrefParam =  $('#_j_tag_nav .nav__list li').eq(3).find('a').attr('href');
            let href = 'http://detail.zol.com.cn'+hrefParam;
            superAgent.get(href)
              .charset()
              .then((success)=>{
                const $ = cheerio.load(success.text);
                list['全称'] = $('#page-title').text().replace(/参数/,'');
                list['厂商'] = $('.breadcrumb a').eq(2).text().replace(/手机/ig,'');
                list['品牌(英文)'] = $('#page-title').text().match(/(.+)\（/)[1].replace(new RegExp(list['厂商']),'');
                list['型号'] = $('#page-title').text().match(/(.+)\（/)[1].replace(new RegExp(list['厂商']),'');
                list['generalUrl'] = 'http://detail.zol.com.cn'+$('.breadcrumb a').eq(3).attr('href');
                $('#newTb table li span').each((index, element)=>{
                  if($(element).text() !== '') detail.push($(element).text())
                });
                detail.forEach((item, index)=> {
                  switch(item){
                    case '支持频段':
                      list['支持TD-LTE频段'] = detail[index + 1].match(/TD-LTE\s([^\\]+)\n/)[1];
                      list['频段'] = detail[index + 1];
                      break ;
                    case '4G网络':
                      list['网络制式'] =  detail[index + 1];
                      list['终端支持能力'] = detail[index + 1];
                      list['是否支持FR'] = true;
                      break ;
                    case '3G网络':
                      list['网络制式'] = list['网络制式'] ? list['网络制式'] + detail[index + 1] : detail[index + 1];
                      list['终端支持能力'] = list['网络制式'] ? list['网络制式'] + detail[index + 1] : detail[index + 1];
                      break ;
                    case '导航':
                      list['是否支持GPS'] = detail[index + 1].includes('GPS');
                      break;
                    case '连接与共享' :
                      list['是否支持NFC'] = detail[index + 1].includes('NFC');
                      //list['蓝牙协议集'] = detail[index + 1].match(/(蓝牙[^\，]+)/)[1];
                      list['是否支持蓝牙'] = detail[index + 1].includes('蓝牙');
                      //list['支持的蓝牙版本'] = detail[index + 1].match(/(蓝牙[^\，]+)/)[1];
                      break;
                    case 'CPU型号':
                      list['CPU芯片型号(ARM版本)'] = detail[index + 1];
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
                      list['外观'] = detail[index + 1].replace(/g/,'');
                      break;
                    case '手机类型':
                      list['市场定位'] = detail[index + 1];
                      list['是否智能机'] = detail[index + 1].includes('智能');
                      list['是否支持快速充电'] = detail[index + 1].includes('快充');
                      break;
                    case '上市日期':
                      list['上市时间'] = detail[index + 1];
                      break;
                    case '核心数':
                      list['CPU数量'] = detail[index + 1];
                      break;
                    case 'CPU型号':
                      list['CPU厂家'] = detail[index + 1].match(/^([\S]+)/)[1];
                      list['CPU型号'] = detail[index + 1];
                      break;
                    case '触摸屏类型':
                      list['是否触摸屏'] = true;
                      list['触摸屏类型'] = detail[index + 1];
                      list['是否支持多点触摸'] = detail[index + 1].includes('多点');
                      break;
                    case '副屏参数':
                      list['屏幕个数'] = 2;
                      break;
                    case '主屏尺寸':
                      list['主屏大小(英寸)'] = detail[index + 1];
                      break;
                    case '主屏分辨率':
                      list['主屏分辨率(横)'] = detail[index + 1].match(/([\d]+)x/)[1];
                      list['主屏分辨率(纵)'] = detail[index + 1].match(/x([\d]+)/)[1];
                      break;
                    case '主屏材质':
                      list['主屏材质'] = detail[index + 1];
                      break;
                    case '屏幕像素密度':
                      list['屏幕像素密度'] = detail[index + 1];
                      break;
                    case '机身接口':
                      list['充电器接口'] = detail[index + 1].replace(/^[^\，]+\，/, '');
                      list['耳机接口类型'] = detail[index + 1].includes('耳机')? detail[index + 1].match(/(^[^\，]+)\，/)[1] : undefined;
                      break;
                    case '电池容量':
                      list['电池容量'] = detail[index + 1];
                      break;
                    case '理论待机时间':
                      list['待机时间'] = detail[index + 1];
                      break;
                    case '理论通话时间':
                      list['通话时间'] = detail[index + 1];
                      break;
                    case '操作类型':
                      list['操作类型'] = detail[index + 1];
                      break;
                    case 'SIM卡':
                      list['SIM卡'] = detail[index + 1];
                      break;
                    case '摄像头类型':
                      list['摄像头'] = detail[index + 1];
                      break;
                    case '后置摄像头':
                      list['后置摄像头'] = detail[index + 1];
                      break;
                    case '前置摄像头':
                      list['前置摄像头'] = detail[index + 1];
                      break;
                    case '闪光灯':
                      list['闪光灯'] = detail[index + 1];
                      break;
                    case '拍照功能':
                      list['拍照功能'] = detail[index + 1];
                      break;
                    case '视频拍摄':
                      list['视频拍摄'] = detail[index + 1];
                      break;
                    case '操作系统':
                      list['操作系统'] = detail[index + 1];
                      break;
                    case 'RAM容量':
                      list['RAM容量'] = detail[index + 1];
                      break;
                    case 'ROM容量':
                      list['ROM容量'] = detail[index + 1];
                      break;
                    case '存储卡':
                      list['存储卡'] = detail[index + 1];
                      break;
                    case '扩展容量':
                      list['扩展容量'] = detail[index + 1];
                      break;
                    case 'WLAN功能':
                      list['WIFI'] = detail[index + 1].includes('WIFI');
                      list['WIFI支持协议'] = detail[index + 1];
                      list['是否支持网络热点'] = detail[index + 1].includes('WIFI');
                      break;
                  }
                });
               // console.log(list);
                getListModel.create(list ,(err)=>{
                  if(err) console.log('从首页存入失败'+err);
                });

              });

          });
      });
      res.send(JSON.stringify('存一堆东东'));
    });
};

exports.getPrice = (req, res) =>{
  getListModel.find({},{generalUrl:1},(err,doc)=>{
    doc.forEach(item=>{
      superAgent.get(item.generalUrl)
      .charset()
      .then((success)=>{
        const $ = cheerio.load(success.text);
        let price = $('#_j_local_price a.price').text();
        let fullName =  $('.product-model__name').text();
        getListModel.update({'全称':fullName},{$set:{'价格':price}},(err,doc)=>{
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


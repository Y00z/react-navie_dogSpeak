/**
 * Created by Yooz on 2017/3/31.
 */

'use strict'

module.exports = {
    header: {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    },
    api: {
        //base: 'http://rap.taobao.org/mockjs/15752/',
        base:'http://192.168.0.12:3000/',
        index: 'init',                  //首页
        liek: 'liek',                   //点赞
        comments: 'pinglun',            //评论
        sendComments: 'submit',         //发送评论
        //-------------user-------------//
        login: 'api/u/verify',        //验证(登录)
        getVerityCode: 'api/u/signup',            //登录(获取验证码)
        signature: 'api/signature',   //生成签名
        update: 'api/u/update'         //用户资料更新
    },
    cloudinary: {
        cloud_name: 'deq99znbe',
        api_key: '132214329484465',
        api_secret: 'Lz3pLZyJ0ahd-C-5s7fbob8NGS0',
        base: 'http://res.cloudinary.com/deq99znbe',
        image: 'https://api.cloudinary.com/v1_1/deq99znbe/image/upload',
        video: 'https://api.cloudinary.com/v1_1/deq99znbe/video/upload',
        audio: 'https://api.cloudinary.com/v1_1/deq99znbe/audio/upload',
    },
    qiniu:{
        upload: 'http://upload.qiniu.com'
    }
}
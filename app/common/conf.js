/**
 * Created by Yooz on 2017/3/31.
 */

'use strict'

module.exports = {
    header : {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    },
    api: {
        base: 'http://rap.taobao.org/mockjs/15752/',
        index: 'init',                  //首页
        liek: 'liek',                   //点赞
        comments: 'pinglun',            //评论
        sendComments: 'submit',         //发送评论
        //-------------user-------------//
        verity : 'api/u/verify',        //获取验证码
        login:'api/u/login',            //登录
        signature : 'api/u/signature',   //生成签名
        update : 'api/u/update'         //用户资料更新
    }
}
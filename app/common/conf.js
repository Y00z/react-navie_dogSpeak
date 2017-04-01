/**
 * Created by Yooz on 2017/3/31.
 */

'use strict'

module.exports = {
    header: {
        'Aceept': 'application/json',
        'Content-Type': 'application/json'
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

    }
}
# -react-navie_dogSpeak
狗狗说

npm install rnpm -g

rnpm link react-native-vector-icons


rnpm link react-native-video



npm install react-native-sk-countdown --save

进入mode_modules\react-native-sk-countdown目录，找到CountDownText.js
改成
import React,{Component} from 'react'
import {
    StyleSheet,
    Text,
} from 'react-native';
var update = require('react-addons-update')
var countDown = require('./countDown')

并且安装react-addons-update
npm install react-addons-update --save


妈了个巴子，注意options里面的参数千万别写错了。
# -react-navie_dogSpeak
狗狗说

npm install rnpm -g

rnpm link react-native-vector-icons

rnpm link react-native-video

react-native link react-native-audio

react-native link react-native-sound
b
在build.gradle中的dependencies加入compile project(':react-native-audio')

在清单文件AndroidManifest.xml中加入权限
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.RECORD_AUDIO"/>

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

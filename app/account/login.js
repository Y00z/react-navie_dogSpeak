/**
 * Created by Yooz on 2017/3/31.
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Navigator,
    ListView,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button';
import {CountDownText} from 'react-native-sk-countdown'
var Dimensions = require("Dimensions");
var {width, height} = Dimensions.get('window');
var Mock = require('mockjs');
var conf = require('./../common/conf');
var Detail = require('./detail');
import request from '../common/request'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: '',    //手机号
            codeSend: false,   //是否第一次已经发生验证码
            verifyCode: '',        //验证码
            isCountDown: false,    //是否正在倒计时。
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{backgroundColor:'orange',width: width,height: 40,}}>
                    <Text style={{fontSize: 18,color: 'white',textAlign: 'center',paddingTop:6}}>快速登录</Text>
                </View>
                <TextInput
                    placeholder="请输入手机号。"
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    keyboardType={"numeric"}
                    underlineColorAndroid="transparent"   //去掉底边框
                    style={styles.textInput}
                    multiline={false}            //是否可以输入多行文字
                    defaultValue={this.state.phoneNumber}
                    onChangeText={(text)=>{
                                this.setState({
                                    phoneNumber:text
                                })
                            }}
                />
                {
                    this.state.codeSend ?
                        <View>
                            <View style={{flexDirection:'row'}}>
                                <TextInput
                                    placeholder="请输入验证码"
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    keyboardType={"numeric"}
                                    underlineColorAndroid="transparent"   //去掉底边框
                                    style={styles.inputverifyStyles}
                                    multiline={false}            //是否可以输入多行文字
                                    defaultValue={this.state.verify}
                                    onChangeText={(text)=>{
                                    this.setState({
                                        verifyCode:text
                                        })
                                    }}
                                />

                                {   this.state.isCountDown
                                    ?
                                    <CountDownText
                                        style={styles.cd}
                                        countType='seconds' // 计时类型：seconds / date
                                        auto={true} // 自动开始
                                        afterEnd={() => this._end()} // 结束回调
                                        timeLeft={10} // 正向计时 时间起点为0秒
                                        step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                                        startText='获取验证码' // 开始的文本
                                        endText='获取验证码' // 结束的文本
                                        intervalText={(sec) => sec + '秒重新获取'} // 定时的文本回调
                                    />
                                    :
                                    <Button
                                        containerStyle={{
                                        padding: 10,
                                        marginTop: 12,
                                        overflow: 'hidden',
                                        borderRadius: 4,
                                        backgroundColor: 'red'}}
                                        style={{fontSize: 16, color: 'white'}}
                                        onPress={()=>this._reSendSMS()}>
                                        重新获取验证码
                                    </Button>

                                }
                            </View>

                            <Button
                                containerStyle={{padding:10,marginTop:10, borderRadius:4, backgroundColor: 'white',borderWidth:2,borderColor:'red'}}
                                style={{fontSize: 20, color: 'red'}}
                                onPress={()=>this._login()}>
                                登录
                            </Button>
                        </View>
                        :
                        <Button
                            containerStyle={{padding:10,marginTop:10,overflow:'hidden', borderRadius:4, backgroundColor: 'white',borderWidth:2,borderColor:'red'}}
                            style={{fontSize: 20, color: 'green'}}
                            onPress={()=>this._sendSMS()}>
                            获取验证码
                        </Button>

                }
            </View>
        )
    }

    //重新发送验证码
    _reSendSMS = () => {
        if (!this.state.isCountDown) {
            this.setState({
                isCountDown: true
            })
        }
    }

    //结束倒计时
    _end = () => {
        if (this.state.isCountDown) {
            this.setState({
                isCountDown: false
            })
        }
        return;
    }

    //登录
    _login = () => {
        if (this.state.phoneNumber.length == 0)
            return alert("电话号码不能为空");

        if (this.state.verifyCode.length == 0)
            return alert("验证码不能为空");
        // fetch(conf.api.base + conf.api.login, {
        //     method: "POST",
        //     body: "&phoneNumber=" + this.state.phoneNumber + "&verifyCode=" + this.state.verifyCode
        // })
        request.post(conf.api.base + conf.api.login,{
            phoneNumber : this.state.phoneNumber,
            verifyCode : this.state.verifyCode
        })
            // .then((response) => response.json())
            .then((response) => {
                if (response && response.success) {
                    this.props.afterLogin(response.data)
                } else {
                    alert("登录失败");
                }
            })
            .catch((error) => {
                alert("登录错误");
                console.error(error)
            })
    }

    //发送验证码
    _sendSMS = () => {
        if (this.state.isCountDown)
            return alert("请稍后");

        if (this.state.phoneNumber.length == 0)
            return alert("电话号码不能为空");

        // fetch(conf.api.base + conf.api.verity, {
        //     method: 'POST',
        //     body: "phoneNumber=" + this.state.phoneNumber
        // })
        request.post(conf.api.base + conf.api.getVerityCode,{
            phoneNumber : this.state.phoneNumber
        })
            .then((response) => {
                alert(JSON.stringify(response))
                if (response && response.success) {
                    if (!this.state.codeSend) {
                        this.setState({
                            codeSend: true,
                            isCountDown: true
                        })
                    }
                } else {
                    // alert("验证码获取失败");
                }
            })
            .catch((error) => {
                alert("验证码获取错误");
                console.error(error)
            })
    }
}


const styles = StyleSheet.create({
    cd: {
        fontSize: 18,
        color: 'white',
        padding: 10,
        marginTop: 12,
        overflow: 'hidden',
        borderRadius: 4,
        backgroundColor: 'red',
    },
    inputverifyStyles: {
        width: width * 0.65,
        marginTop: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: 'white',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    textInput: {
        // width: width * 0.98,
        // height: 40,
        // borderWidth: 1,
        // borderRadius: 3,
        // borderColor: 'white',
        // color: 'white',

        marginTop: 8,
        padding: 10,
        // color: 'white',
        fontSize: 16,
        backgroundColor: 'white',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    container: {
        backgroundColor: 'rgba(240,239,245,1.0)',
        flex: 1,
    }
})
module.exports = Login;

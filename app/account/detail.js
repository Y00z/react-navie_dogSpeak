/**
 * Created by Yooz on 2017/3/24.
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Navigator,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
var Video = require('react-native-video').default
var Dimensions = require("Dimensions");
var {width, height} = Dimensions.get('window');

export default class detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: 0.01,  //转换后的当前进度。
            cuttentTime: 0, //当前播放进度
            totalTime: 0,    //总共播放进度
            isLoading: true,  //是否正在加载
            isRate: 0,
            paused: false,     //是否正在播放，false为暂停。
            isEnding: false   //是否播放完毕
        }
    }

    render() {
        return (
            <View style={{backgroundColor: 'rgba(240,239,245,1.0)', flex: 1}}>
                <View style={styles.accountTopStyles}>
                    <TouchableOpacity activeOpacity={0.7}
                                      style={{position: 'absolute', left: 16,flexDirection:'row',alignItems: 'center'}}
                                      onPress={() => this.props.navigator.pop()}>
                        <Icon size={35} style={{color: 'white'}} name="ios-arrow-back"/>
                        <Text style={{fontSize:16,color:'white',marginLeft:5}}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.accountTopTextStyles}>详情页</Text>
                </View>
                <View style={styles.viedoBox}>
                    <Text style={styles.detailTitle}>{this.props.data.title}</Text>
                    <TouchableOpacity activeOpacity={0.9} onPress={()=>this._paused()}>
                        <Video
                            ref="videoPlayer"
                            source={{uri: this.props.data.videoUrl}}
                            volume={3}  //声音放大倍数
                            paused={this.state.paused}  //是否暂停，一进来就播放。
                            rate={this.state.isRate}    //控制暂停/播放，0 代表暂停paused, 1代表播放normal.
                            muted={false}    //静音
                            repeat={false}      //是否重复播放
                            resizeMode='cover'  //视频拉伸方式， contain：包含
                            playInBackground={false}     // 当app转到后台运行的时候，播放是否暂停
                            playWhenInactive={false}     // [iOS] Video continues to play when control or notification center are shown. 仅适用于IOS
                            style={styles.backgroundVideo}
                            onLoadStart={()=>this._onLoadStart()}      //当视频开始加载时的回调函数
                            onLoad={(data)=>this._onLoad(data)}           //当视频加载完毕时的回调函数
                            onProgress={(data)=>this._onProgress(data)}       //播放中每250毫秒调用一次
                            onEnd={()=>this._onEnd()}            //播放结束的时候调用
                            onError={()=>this._onError()}          //播放出错调用
                        />
                    </TouchableOpacity>
                    {
                        this.state.paused ?
                            <TouchableOpacity activeOpacity={0.5} style={styles.playBox} onPress={()=>this._resume()}>
                                <Icon style={styles.play} size={30}
                                      name="ios-play"/>
                            </TouchableOpacity> : null
                    }

                    {
                        this.state.isLoading ?
                            <ActivityIndicator style={{height: 80}} size="small"/> : null
                    }

                    <View style={styles.progressBox}>
                        <View style={[styles.progressBar,{width:width * this.state.progress}]}>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    _rePlay = () => {
        this.refs.videoPlayer.seek(0)
    }

    _paused = () => {
        if (!this.state.paused) {
            this.setState({
                paused: true
            })
        }
    }

    _resume = () => {
        if (this.state.paused) {
            this.setState({
                paused: false
            })
        }
        if (this.state.isEnding) {
            this._rePlay()
        }
    }


    _onLoadStart = () => {
        this.setState({
            isLoading: true
        })
    }

    _onLoad = (data) => {
        // var totalTime = data.duration
    }

    _onProgress = (data) => {
        // var currentTime = Number(data.currentTime.toFixed(2))
        var currentTime = data.currentTime
        var playableDuration = data.playableDuration
        //比例数，整数，
        // var percent = Number((currentTime / this.state.totalTime).toFixed(2));
        // alert(JSON.stringify(data));
        // alert(playableDuration);
        var percent = currentTime / this.state.totalTime;
        this.setState({
            totalTime: playableDuration,    //视频加载完毕，设置视频总长度
            currentTime: currentTime,
            progress: percent,
            isLoading: false,
            isEnding: false
        })
    }

    _onEnd = () => {
        this.setState({
            paused: true,
            isEnding: true
        })
    }

    _onError = () => {
        alert("视频出错了，很抱歉")
    }

}


const styles = StyleSheet.create({
    playBox: {
        position: 'absolute',
        bottom: 137,
        right: 155,
        width: 40,
        height: 40,
    },
    play: {
        borderRadius: 25,
        borderColor: 'white',
        borderWidth: 1,
        color: 'orange',
        paddingTop: 5,
        paddingLeft: 15,
    },
    progressBox: {
        width: width,
        height: 3,
        backgroundColor: '#ccc'
    },
    progressBar: {
        height: 3,
        backgroundColor: 'red'

    },
    detailTitle: {
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 10,
        fontSize: 16,
        color: 'black'
    },
    viedoBox: {
        width: width,
        height: 360
    },
    backgroundVideo: {
        width: width,
        height: 300
    },
    tabView: {
        flex: 1,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },
    card: {
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: 'rgba(0,0,0,0.1)',
        margin: 5,
        height: 150,
        padding: 15,
        shadowColor: '#ccc',
        shadowOffset: {width: 2, height: 2,},
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    accountTopTextStyles: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center'
    },
    accountTopStyles: {
        backgroundColor: 'orange',
        width: width,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
module.exports = detail;

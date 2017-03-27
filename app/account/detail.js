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
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
var Video = require('react-native-video').default
var Dimensions = require("Dimensions");
var {width, height} = Dimensions.get('window');

export default class detail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }


    render() {
        return (
            <View style={{backgroundColor: 'rgba(240,239,245,1.0)', flex: 1}}>
                <View style={styles.accountTopStyles}>
                    <TouchableOpacity style={{position: 'absolute', left: 16}}
                                      onPress={() => this.props.navigator.pop()}>
                        <Icon size={35} style={{color: 'white'}} name="ios-arrow-back"/>
                    </TouchableOpacity>
                    <Text style={styles.accountTopTextStyles}>详情页</Text>
                </View>
                <View style={styles.viedoBox}>
                    <Text style={styles.detailTitle}>{this.props.data.title}</Text>
                    <Video
                        ref="videoPlayer"
                        source={{uri: this.props.data.videoUrl}}
                        volume={3}  //声音放大倍数
                        paused={false}  //是否暂停，一进来就播放。
                        rate={0}    //0暂停，  1就是正常
                        muted={false}    //静音
                        repeat={false}      //是否重复播放
                        resizeMode='cover'  //视频拉伸方式， contain：包含
                        playInBackground={false}     // 当app转到后台运行的时候，播放是否暂停
                        playWhenInactive={false}     // [iOS] Video continues to play when control or notification center are shown. 仅适用于IOS
                        style={styles.backgroundVideo}
                        onLoadStart={()=>this._onLoadStart()}      //视频开始播放的时候调用
                        onLoad={()=>this._onLoad()}           //加载中会不断调用
                        onProgress={()=>this._onProgress()}       //播放中每250毫秒调用一次
                        onEnd={()=>this._onEnd()}            //播放结束的时候调用
                        onError={()=>this._onError()}          //播放出错调用
                    />
                </View>
            </View>
        )
    }

    _onLoadStart = () => {

    }

    _onLoad = () => {

    }

    _onProgress = (data) => {

    }

    _onEnd = () => {

    }

    _onError = () => {

    }
}


const styles = StyleSheet.create({
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
        height: 360
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

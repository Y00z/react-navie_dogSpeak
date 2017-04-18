/**
 * Created by Yooz on 2017/3/13.
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
} from 'react-native';
import ImagePicker from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/Ionicons';
var Video = require('react-native-video').default;
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window')
var request = require('./../common/request')
var conf = require('./../common/conf')
var photoOptions = {
    title: '选择视频',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '录像10秒',
    chooseFromLibraryButtonTitle: '选择已有视频',
    videoQuality: 'medium',
    durationLimit: 10,                           //录像最长10秒
    mediaType: 'video',                        //类型
    quality: 0.8,                               //图片质量
    noData: false,                              //如果是true,就不会转成base64
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
}

export default class Creation extends Component {
    constructor(props) {
        super(props)
        var user = this.props.user || {}
        this.state = {
            user: user,
            previewVideo: null,
            //视频播放
            progress: 0.01,             //转换后的当前进度。
            paused: false,              //是否正在播放，false为暂停。
            isEnding: false,            //是否播放完毕
            muted: false,               //是否静音
            isEnding: false,            //是否播放完毕

            //视频上传
            videoUploading: true,       //视频是否正在上传
            videoUploadProgress: 0.1,   //视频上传进度
            videoUploaded: true,        //是否上传结束
            video: null
        }
    }

    render() {
        return (
            <View style={{backgroundColor: 'rgba(240,239,245,1.0)', flex: 1,alignItems: 'center'}}>
                <View style={styles.creattionTopStyles}>
                    <Text style={styles.creattionTopTextStyles}>理解狗狗,从配音开始</Text>
                    {
                        this.state.previewVideo && this.state.videoUploaded
                        ? <TouchableOpacity style={styles.creattionTopRightStyles} onPress={()=>this._pickerVideo()}>
                            <Text style={styles.creattionTopRightTextStyles}>更换视频</Text>
                        </TouchableOpacity>
                        : null
                    }
                </View>
                {
                    this.state.previewVideo
                        ?
                        <View style={{width: width,height: 300}}>
                            <TouchableOpacity activeOpacity={0.9} onPress={()=>this._paused()}>
                                <Video
                                    ref="videoPlayer"
                                    source={{uri: this.state.previewVideo}}
                                    volume={3}  //声音放大倍数
                                    paused={this.state.paused}  //是否暂停，一进来就播放。
                                    rate={this.state.isRate}    //控制暂停/播放，0 代表暂停paused, 1代表播放normal.
                                    muted={this.state.muted}    //静音
                                    repeat={false}      //是否重复播放
                                    resizeMode='cover'  //视频拉伸方式， contain：包含
                                    playInBackground={false}     // 当app转到后台运行的时候，播放是否暂停
                                    playWhenInactive={false}     // [iOS] Video continues to play when control or notification center are shown. 仅适用于IOS
                                    style={{width:width , height:300}}
                                    onLoadStart={()=>this._onLoadStart()}      //当视频开始加载时的回调函数
                                    onLoad={(data)=>this._onLoad(data)}           //当视频加载完毕时的回调函数
                                    onProgress={(data)=>this._onProgress(data)}       //播放中每250毫秒调用一次
                                    onEnd={()=>this._onEnd()}            //播放结束的时候调用
                                    onError={()=>this._onError()}          //播放出错调用
                                />
                                {
                                    !this.state.videoUploaded && this.state.videoUploading
                                        ?
                                        <View>
                                            <View style={styles.progressBox}>
                                                <View
                                                    style={[styles.progressBar,{width:width * this.state.videoUploadProgress}]}>
                                                </View>
                                            </View>
                                            <Text>正在生成静音视频，已完成{(this.state.videoUploadProgress * 100).toFixed(2) + '%'}</Text>
                                        </View>
                                        :
                                        null
                                }
                            </TouchableOpacity>

                            {
                                this.state.paused ?
                                    <TouchableOpacity activeOpacity={0.5} style={styles.playBox}
                                                      onPress={()=>this._resume()}>
                                        <Icon style={styles.play} size={60}
                                              name="ios-play"/>
                                    </TouchableOpacity> : null
                            }
                        </View>
                        :
                        <TouchableOpacity onPress={()=>this._pickerVideo()}>

                            <View style={styles.middleStyle}>
                                <Image source={require('./../assets/images/record.png')}
                                       style={{width:100,height:100}}/>
                                <Text style={{color:'black',fontSize:15}}>点我上传视频</Text>
                                <Text>建议时长不超过20秒</Text>
                            </View>
                        </TouchableOpacity>
                }
            </View>
        )
    }

    getQiniuToken = () => {
        var accessToken = this.state.user.accessToken
        var signatureURL = conf.api.base + conf.api.signature
        return request.post(signatureURL, {
            accessToken: accessToken,
            cloud: 'qiniu',
            type: 'video'
        })
    }

    _pickerVideo = () => {
        ImagePicker.showImagePicker(photoOptions, (response) => {
            if (response.didCancel) {
                return
            }
            this.setState({
                previewVideo: response.uri
            })
            //把图片上传到Cloudinary图床
            var timestamp = Date.now()
            var tags = 'app,avatar'     //图片标签
            var folder = 'avatar'       //图床文件夹
            console.log("11")
            this.getQiniuToken()
                .then((data) => {
                    if (data && data.success) {
                        var token = data.data.token
                        var key = data.data.key
                        //构建上传的表单。
                        var body = new FormData()
                        body.append('token', token)
                        body.append('key', key)
                        body.append('file', {
                            type: 'video/mp4',
                            uri: this.state.previewVideo,
                            name: key
                        })
                        this._upload(body)
                    }
                })

            // fetch(signatureURL, {
            //     method: "POST",
            //     body: "&accessToken=" + accessToken + "&timestamp=" + timestamp + "&type=avatar"
            // })
            //     .then((response) => response.json())
            //     .then((response) => {
            //         var data = Mock.mock(response)
            //         if (data && data.success) {
            //             // var signature = 'folder=' + folder + "&tags=" + tags +
            //             //     '&timestamp=' + timestamp + conf.cloudinary.api_secret
            //             // signature = sha1(signature)
            //             signature = data.data
            //             //构建上传的表单。
            //             var body = new FormData()
            //             body.append('folder', folder)
            //             body.append('signature', signature)
            //             body.append('tags', tags)
            //             body.append('timestamp', timestamp)
            //             body.append('api_key', conf.cloudinary.api_key)
            //             body.append('resource_type', 'image')
            //             body.append('file', avartarData)
            //             this._upload(body)
            //         }
            //     })
        })
    }

    //发送异步请求
    _upload = (body) => {
        var xhr = new XMLHttpRequest()
        var url = conf.qiniu.upload
        console.log(body)
        this.setState({
            videoUploading: true,
            videoUploadProgress: 0,
            videoUploaded: false
        })
        xhr.open('POST', url)
        xhr.onload = () => {
            if (xhr.status !== 200) {
                alert("请求失败")
                console.log(xhr.responseText)
                return
            }
            if (!xhr.responseText) {
                alert("请求超时")
                console.log(xhr.responseText)
                return
            }
            //上传成功后
            var response
            try {
                response = JSON.parse(xhr.response)
            } catch (e) {
                console.log(e)
            }
            console.log(response)
            //成功后，把头像地址替换成图床的地址
            if (response) {
                // var user = this.state.user
                // //如果有public_id 说明用的是cloudinary图床
                // if (response.public_id)
                //     user.avatar = response.public_id
                // if (response.key)   //如果有key,说明用的是七牛图床
                //     user.avatar = response.key
                this.setState({
                    video: response,
                    videoUploading: false,
                    videoUploadProgress: 0,
                    videoUploaded: true
                })
            }
        }
        //获取头像上传进度。
        if (xhr.upload) {
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    var percent = Number((event.loaded / event.total).toFixed(2))
                    this.setState({
                        videoUploadProgress: percent
                    })
                }
            }
        }
        xhr.send(body)
    }


    _rePlay = () => {
        this.refs.videoPlayer.seek(0)
    }

    _paused = () => {
        if (!this.state.isLoading) {
            if (!this.state.paused) {
                this.setState({
                    paused: true
                })
            }
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
        // var currentTime = data.currentTime
        // var playableDuration = data.playableDuration
        //比例数，整数，
        // var percent = Number((currentTime / this.state.totalTime).toFixed(2));
        // alert(JSON.stringify(data));
        // alert(playableDuration);
        // var percent = currentTime / this.state.totalTime;
        // this.setState({
        //     totalTime: playableDuration,    //视频加载完毕，设置视频总长度
        //     currentTime: currentTime,
        //     isLoading: false,
        //     isEnding: false
        // })
    }

    _onEnd = () => {
        this.setState({
            paused: true,
        })
    }

    _onError = () => {
        alert("视频出错了，很抱歉")
    }
}


const styles = StyleSheet.create({
    progressBox: {
        width: width,
        height: 3,
        backgroundColor: '#ccc'
    },
    progressBar: {
        height: 3,
        backgroundColor: 'red'

    },
    playBox: {
        position: 'absolute',
        bottom: 130,
        right: 150,
        width: 70,
        height: 70,
    },
    play: {
        borderRadius: 35,
        borderColor: 'white',
        borderWidth: 1,
        color: 'orange',
        paddingTop: 3,
        paddingLeft: 25,
    },
    middleStyle: {
        width: width * 0.95,
        height: 180,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'red',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
    creattionTopTextStyles: {
        fontSize: 18,
        color: 'white'
    },
    creattionTopStyles: {
        backgroundColor: 'orange',
        width: width,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    creattionTopRightTextStyles: {
        fontSize: 13,
        color: 'white'
    },
    creattionTopRightStyles: {
        position: 'absolute',
        right: 20,
        top: 12,
    }
});
module.exports = Creation;

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
    AsyncStorage,
    Platform,
    PermissionsAndroid
} from 'react-native';
import {CountDownText} from 'react-native-sk-countdown'
import ImagePicker from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/Ionicons'
import {AudioRecorder, AudioUtils} from 'react-native-audio'
import Sound from 'react-native-sound';
var Video = require('react-native-video').default
var Dimensions = require('Dimensions')
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
            previewVideo: null,         //存放视频地址
            //视频播放
            currentTime: 0, //当前播放进度
            totalTime: 0,                //视频总长度
            progress: 0.01,             //转换后的当前进度。
            paused: false,              //是否正在播放，false为暂停。
            isEnding: false,            //是否播放完毕
            muted: false,               //是否静音
            isEnding: false,            //是否播放完毕

            //视频上传
            videoUploading: true,       //视频是否正在上传
            videoUploadProgress: 0.0,   //视频上传进度
            videoUploaded: false,        //是否上传结束
            video: null,

            //倒计时
            countdowning: false,         //倒计时中
            counted: false,                //倒计时结束

            //录音
            recording: false,           //录音中
            record: false,              //是否录音完毕。
            audioPath: AudioUtils.DocumentDirectoryPath + '//dog.aac', //录音的路径
            finished: false,
            audioPlaying: false,        //录音是否正在播放
            recordTime: 0.0,            //录音时间

            hasPermission: undefined,
        }
    }

    render() {
        return (
            <View style={{backgroundColor: 'rgba(240,239,245,1.0)', flex: 1, alignItems: 'center'}}>
                <View style={styles.creattionTopStyles}>
                    <Text style={styles.creattionTopTextStyles}>理解狗狗,从配音开始</Text>
                    {
                        this.state.previewVideo && this.state.videoUploaded
                            ?
                            <TouchableOpacity style={styles.creattionTopRightStyles}
                                              onPress={() => this._pickerVideo()}>
                                <Text style={styles.creattionTopRightTextStyles}>更换视频</Text>
                            </TouchableOpacity>
                            : null
                    }
                </View>
                {
                    this.state.previewVideo
                        ?
                        <View style={{width: width, height: 300}}>
                            <TouchableOpacity activeOpacity={0.9} onPress={() => this._paused()}>
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
                                    style={{width: width, height: 300}}
                                    onLoadStart={() => this._onLoadStart()}      //当视频开始加载时的回调函数
                                    onLoad={(data) => this._onLoad(data)}           //当视频加载完毕时的回调函数
                                    onProgress={(data) => this._onProgress(data)}       //播放中每250毫秒调用一次
                                    onEnd={() => this._onEnd()}            //播放结束的时候调用
                                    onError={() => this._onError()}          //播放出错调用
                                />

                                {   //录音完毕后，预览
                                    this.state.record
                                        ?
                                        <TouchableOpacity style={{position: 'absolute', right: 20, top: 239,}}
                                                          onPress={() => this._preview()}>
                                            <View
                                                style={{
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: 8,
                                                    borderWidth: 1,
                                                    borderColor: 'red',
                                                    flexDirection: 'row',
                                                    paddingLeft: 5,
                                                    paddingRight: 5
                                                }}>
                                                <Icon name="ios-play" size={30} style={{width: 30, height: 30}}/>
                                                <Text>预览</Text>
                                            </View>
                                        </TouchableOpacity>
                                        : null
                                }

                                {   //生成静音视频的进度条
                                    !this.state.videoUploaded && this.state.videoUploading
                                        ?
                                        <View>
                                            <View style={styles.progressBox}>
                                                <View
                                                    style={[styles.progressBar, {width: width * this.state.videoUploadProgress}]}>
                                                </View>
                                            </View>
                                            <Text>正在生成静音视频，已完成{(this.state.videoUploadProgress * 100).toFixed(2) + '%'}</Text>
                                        </View>
                                        :
                                        null
                                }


                                {   //开始录音后的视频进度条
                                    this.state.videoUploaded && this.state.counted
                                        ?
                                        <View style={styles.progressBox}>
                                            <View
                                                style={[styles.progressBar, {width: width * this.state.progress}]}>
                                            </View>
                                        </View>
                                        :
                                        null
                                }


                                {   //准备开始录音的倒计时
                                    this.state.videoUploaded
                                        ?
                                        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: -20}}>
                                            <View
                                                style={[styles.record, (this.state.recording || this.state.audioPlaying) && styles.recordOutline]}>
                                                {
                                                    this.state.countdowning
                                                        ? <CountDownText
                                                            style={styles.cd}
                                                            countType='seconds' // 计时类型：seconds / date
                                                            auto={true} // 自动开始
                                                            afterEnd={() => this._end()} // 结束回调
                                                            timeLeft={3} // 正向计时 时间起点为0秒
                                                            step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                                                            startText='' // 开始的文本
                                                            endText='Go' // 结束的文本
                                                            intervalText={(sec) => sec + ''}/> // 定时的文本回调
                                                        :
                                                        <TouchableOpacity onPress={() => this._counting()}
                                                                          style={{width: 50, height: 50}}>
                                                            <Icon name="ios-mic" size={50}
                                                                  style={{
                                                                      width: 50,
                                                                      height: 50,
                                                                      color: 'white',
                                                                      textAlign: 'center'
                                                                  }}/>
                                                        </TouchableOpacity>
                                                }
                                            </View>
                                        </View>
                                        : null
                                }
                            </TouchableOpacity>
                            {   //正在录音中
                                this.state.recording
                                    ?
                                    <View
                                        style={{flexDirection: 'row', justifyContent: 'center', marginTop: 8}}><Text>录制声音中</Text></View>
                                    : null
                            }

                        </View>
                        :
                        <TouchableOpacity onPress={() => this._pickerVideo()}>

                            <View style={styles.middleStyle}>
                                <Image source={require('./../assets/images/record.png')}
                                       style={{width: 100, height: 100}}/>
                                <Text style={{color: 'black', fontSize: 15}}>点我上传视频</Text>
                                <Text>建议时长不超过20秒</Text>
                            </View>
                        </TouchableOpacity>
                }
            </View>
        )
    }

    //检查权限
    _checkPermission = () => {
        if (Platform.OS !== 'android') {
            return Promise.resolve(true);
        }

        const rationale = {
            'title': 'Microphone Permission',
            'message': 'AudioExample needs access to your microphone so you can record audio.'
        };

        return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
            .then((result) => {
                console.log('Permission result:', result);
                return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
            });
    }

    componentDidMount = () => {
        AsyncStorage.getItem("user")
            .then((data) => {
                var user
                if (data)
                    user = JSON.parse(data)
                if (user && user.accessToken) {
                    this.setState({
                        user: user
                    })
                }
            })
        //初始化加上检测音频
        this._checkPermission().then((hasPermission) => {
            this.setState({hasPermission});

            if (!hasPermission) return;

            this.prepareRecordingPath(this.state.audioPath);

            AudioRecorder.onProgress = (data) => {
                this.setState({recordTime: Math.floor(data.currentTime)});
            };

            AudioRecorder.onFinished = (data) => {
                // Android callback comes in the form of a promise instead.
                if (Platform.OS === 'ios') {
                    this._finishRecording(data.status === "OK", data.audioFileURL);
                }
            };
        });
    }

    _finishRecording = (didSucceed, filePath) => {
        this.setState({finished: didSucceed});
        console.log(`Finished recording of duration ${this.state.recordTime} seconds at path: ${filePath}`);
    }


    //初始化音频
    prepareRecordingPath = (audioPath) => {
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000
        });
    }

    //预览
    _preview = () => {
        // if (this.state.audioPlaying)
        //     AudioRecorder.stopRecording()
        this.setState({
            audioPlaying: true,
            paused: false,
            progress: 0.0,
        })
        this.refs.videoPlayer.seek(0)

        setTimeout(() => {
            var sound = new Sound(this.state.audioPath, '', (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                }
            });

            setTimeout(() => {
                sound.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            }, 100);
        }, 100);


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
                previewVideo: response.uri,
            })
            //把图片上传到Cloudinary图床
            var timestamp = Date.now()
            var tags = 'app,avatar'     //图片标签
            var folder = 'avatar'       //图床文件夹
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
        })
    }

    //发送异步请求
    _upload = (body) => {
        var xhr = new XMLHttpRequest()
        var url = conf.qiniu.upload
        this.setState({
            videoUploading: true,
            videoUploadProgress: 0,
            videoUploaded: false,
            record: false,
            audioPlaying: false
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
            //成功后，把头像地址替换成图床的地址
            if (response) {
                this.setState({
                    video: response,
                    videoUploading: false,
                    videoUploadProgress: 0,
                    videoUploaded: true
                })

                //上传视频到服务器进行同步
                var accessToken = this.state.user.accessToken
                var videoUrl = conf.api.base + conf.api.video
                request.post(videoUrl, {
                    accessToken: accessToken,
                    video: response
                })
                    .then((data) => {
                        if (!data || !data.success) {
                            console.log(error)
                            alert("视频同步出错，请重新上传")
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                        alert("服务器出错,请重新上传")
                    })

            }
        }
        //获取上传进度。
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

    _end = () => {
        this.setState({
            counted: true,
            countdowning: false,
            paused: false,
            recording: true,
            record: false,
            progress: 0.0,
        })
        this.refs.videoPlayer.seek(0)

        if (this.state.videoUploaded) {

            if (!this.state.hasPermission) {
                console.warn('Can\'t record, no permission granted!');
                return;
            }
            try {
                // 启动音频录制
                AudioRecorder.startRecording()
            } catch (error) {
                console.log(error)
            }
        }
        // this._rePlay()
    }

    _counting = () => {
        this.setState({
            countdowning: true
        })
    }

    _rePlay = () => {
        this.refs.videoPlayer.seek(0)
        this.setState({
            paused: false
        })
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
        var totalTime = data.duration
        this.setState({
            totalTime: totalTime,    //视频加载完毕，设置视频总长度
        })
    }
    _onProgress = (data) => {
        // var currentTime = Number(data.currentTime.toFixed(2))
        var currentTime = data.currentTime
        var playableDuration = data.playableDuration
        //比例数，整数，
        var percent = Number((currentTime / this.state.totalTime).toFixed(2));
        var percent = currentTime / this.state.totalTime;
        this.setState({
            currentTime: currentTime,
            progress: percent,
        })
    }

    _onEnd = () => {
        this.setState({
            paused: true,
            recording: false,
            audioPlaying:false
        })
        if (this.state.recording) {
            // 停止音频录制
            try {
                const filePath = AudioRecorder.stopRecording()
                this.setState({
                    recording: false,
                    record: true,
                })
                if (Platform.OS === 'android') {
                    this._finishRecording(true, filePath);
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    _onError = () => {
        alert("视频出错了，很抱歉")
    }
}


const styles = StyleSheet.create({
    recordOutline: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center'
    },
    record: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cd: {
        color: 'white',
        textAlign: 'center',
        fontSize: 28
    },
    progressBox: {
        width: width,
        height: 3,
        backgroundColor: '#ccc',
    },
    progressBar: {
        height: 3,
        backgroundColor: 'red'

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

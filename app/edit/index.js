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
    ScrollView,
    AsyncStorage
} from 'react-native';
var Dimensions = require('Dimensions');
var {width, height} =Dimensions.get('window')
var conf = require('./../common/conf');
import Icon from 'react-native-vector-icons/Ionicons';
import  ImagePicker from 'react-native-image-picker';
var sha1 = require('sha1');
var Mock = require('mockjs');
import * as Progress from 'react-native-progress';
var _ = require('lodash')

var CLOUDINARY = {
    cloud_name: 'deq99znbe',
    api_key: '132214329484465',
    api_secret: 'Lz3pLZyJ0ahd-C-5s7fbob8NGS0',
    base: 'http://res.cloudinary.com/deq99znbe',
    image: 'https://api.cloudinary.com/v1_1/deq99znbe/image/upload',
    video: 'https://api.cloudinary.com/v1_1/deq99znbe/video/upload',
    audio: 'https://api.cloudinary.com/v1_1/deq99znbe/audio/upload',
}

var photoOptions = {
    title: '选择头像',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '选择相册',
    quality: 0.8,                                //图片质量
    allowsEditing: true,                         //是否允许拉伸剪裁
    noData: false,                               //如果是true,就不会转成base64
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
}

function avatar(id, type) {
    if (id.indexOf("http") > -1)
        return id
    if (id.indexOf("data:image") > -1)
        return id
    return CLOUDINARY.base + "/" + type + "/upload/" + id
}

export default class Edit extends Component {

    constructor(props) {
        super(props)
        var user = this.props.user || {}
        this.state = {
            avatarSource: null,
            user: user,
            avatarProgress: 0,
            avatarUploading: false         //头像是否正在上传
        }
    }

    render() {
        var user = this.state.user;
        return (
            <View style={{backgroundColor: 'rgba(240,239,245,1.0)', flex: 1}}>
                <View style={styles.accountTopStyles}>
                    <Text style={styles.accountTopTextStyles}>狗狗的账户</Text>
                </View>
                <ScrollView>
                    <View>
                        {
                            user.avatar
                                ?       //有头像的时候
                                <View>
                                    <Image style={styles.backgroundIMG}
                                           source={{uri:avatar(user.avatar,'image')}}/>
                                    <TouchableOpacity activeOpacity={0.8} onPress={()=>this._pickerIMG()}
                                                      style={styles.radiusBack}>
                                        {
                                            this.state.avatarUploading
                                                ?
                                                <Progress.Circle size={70}
                                                                 color={'#ee735c'}
                                                                 progress={this.state.avatarProgress}
                                                                 showsText={true}/>
                                                :
                                                <Image style={styles.radiusIMG}
                                                       source={{uri:avatar(user.avatar,'image')}}/>
                                        }
                                    </TouchableOpacity>
                                </View>
                                :       //没头像的时候
                                <View>
                                    <TouchableOpacity activeOpacity={0.8} onPress={()=>this._pickerIMG()}
                                                      style={styles.radiusNotBack}>
                                        <View style={styles.radiusNotBox}>
                                            <Text style={{color:'white',marginBottom:5}}>添加狗狗头像</Text>
                                            <View
                                                style={{backgroundColor:'white',width:80,height:80,justifyContent:'center',alignItems: 'center',paddingLeft:3}}>
                                                {
                                                    this.state.avatarUploading
                                                        ?
                                                        <Progress.Circle size={70}
                                                                         color={'#ee735c'}
                                                                         progress={this.state.avatarProgress}
                                                                         showsText={true}/>
                                                        :
                                                        <Icon size={70} style={styles.radiusIMG}
                                                              name="ios-cloud-upload-outline"/>
                                                }
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                        }
                    </View>
                    <TouchableOpacity onPress={()=>this.props.logout()}>
                        <Text>edit</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }

    //把更新后的用户数据发送给服务器同步起来
    _asyncUser = (isAvatar) => {
        var user = this.state.user
        if (user && user.accessToken) {
            var url = conf.api.base + conf.api.update
            var options = _.extend(conf.header, {
                body: JSON.stringify(user)
            });
            fetch(url, options)
                .then((response) => response.json())
                .then((response) => {
                    var data = Mock.mock(response)
                    var user = data.data
                    if (isAvatar)
                        alert("头像更新成功")
                    this.setState({
                        user: user
                    }, function () {
                        AsyncStorage.setItem('user', JSON.stringify(user))
                    })
                })
        }
    }

    _pickerIMG = () => {
        ImagePicker.showImagePicker(photoOptions, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                return
            }
            //把选择的图片转换成base64，然后存储到user对象。
            var avartarData = 'data:image/jpeg;base64,' + response.data
            //把图片上传到Cloudinary图床
            var timestamp = Date.now()
            var tags = 'app,avatar'     //图片标签
            var folder = 'avatar'       //图床文件夹
            var accessToken = this.state.user.accessToken
            var signatureURL = conf.api.base + conf.api.signature
            fetch(signatureURL, {
                method: "POST",
                body: "&accessToken=" + accessToken + "&timestamp=" + timestamp + "&type=avatar"
            })
                .then((response) => response.json())
                .then((response) => {
                    var data = Mock.mock(response)
                    if (data && data.success) {
                        var signature = 'folder=' + folder + "&tags=" + tags +
                            '&timestamp=' + timestamp + CLOUDINARY.api_secret
                        signature = sha1(signature)
                        //构建上传的表单。
                        var body = new FormData()
                        body.append('folder', folder)
                        body.append('signature', signature)
                        body.append('tags', tags)
                        body.append('timestamp', timestamp)
                        body.append('api_key', CLOUDINARY.api_key)
                        body.append('resource_type', 'image')
                        body.append('file', avartarData)
                        this._upload(body)
                    }
                })
        })
    }

    //发送异步请求
    _upload = (body) => {
        var xhr = new XMLHttpRequest()
        var url = CLOUDINARY.image
        this.setState({
            avatarUploading: true,
            avatarProgress: 0
        })
        xhr.open('POST', url)
        xhr.onload = () => {
            if (xhr.status !== 200) {
                alert("请求失败");
                return
            }
            if (!xhr) {
                alert("请求超时");
                return
            }

            //上传成功后
            var response
            try {
                response = JSON.parse(xhr.response)
                //alert(JSON.stringify(response))
            } catch (e) {
                console.log(e)
            }
            //成功后，把头像地址替换成图床的地址
            if (response && response.public_id) {
                var user = this.state.user
                user.avatar = response.public_id
                this.setState({
                    user: user,
                    avatarUploading: false,
                    avatarProgress: 0
                })
                this._asyncUser(true)
            }
        }
        //获取头像上传进度。
        if (xhr.upload) {
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    var percent = Number((event.loaded / event.total).toFixed(2))
                    this.setState({
                        avatarProgress: percent
                    })
                }
            }
        }

        xhr.send(body)


    }

    componentDidMount() {
        //alert(this.state.user.avatar);
    }
}


const styles = StyleSheet.create({
    radiusIMG: {
        width: 70,
        height: 70,
        borderRadius: 45
    },
    radiusBack: {
        width: 100,
        height: 100,
        position: 'absolute',
        left: 140,
        top: 40,
    },
    radiusNotBox: {
        position: 'absolute',
        left: 140,
        top: 25,
    },
    radiusNotBack: {
        width: width,
        height: 158,
        backgroundColor: '#ccc'
    },
    backgroundIMG: {
        width: width,
        height: 158
    },
    accountTopTextStyles: {
        fontSize: 18,
        color: 'white'
    },
    accountTopStyles: {
        backgroundColor: 'orange',
        width: width,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
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
});
module.exports = Edit;
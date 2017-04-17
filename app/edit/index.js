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
    AsyncStorage,
    Modal,
    TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import  ImagePicker from 'react-native-image-picker'
import Button from 'react-native-button'
import * as Progress from 'react-native-progress'
var Dimensions = require('Dimensions')
var {width, height} =Dimensions.get('window')
var conf = require('./../common/conf')
var sha1 = require('sha1')
var Mock = require('mockjs')
var _ = require('lodash')
import request from '../common/request'


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
    if (id.indexOf("avatar") > -1)
        return conf.cloudinary.base + "/" + type + "/upload/" + id

    return 'http://oi6ni1o6u.bkt.clouddn.com/' + id
}

export default class Edit extends Component {

    constructor(props) {
        super(props)
        var user = this.props.user || {}
        this.state = {
            avatarSource: null,
            user: user,
            avatarProgress: 0,
            avatarUploading: false,         //头像是否正在上传
            modalVisible: false            //modal是否显示
        }
    }

    render() {
        var user = this.state.user
        return (
            <View style={{backgroundColor: 'rgba(240,239,245,1.0)', flex: 1}}>
                <View style={styles.accountTopStyles}>
                    <Text style={styles.accountTopTextStyles}>狗狗的账户</Text>
                    <TouchableOpacity style={styles.topRightedit} activeOpacity={0.8} onPress={()=>this._edit()}>
                        <Text style={styles.accountTopTextStyles}>编辑</Text>
                    </TouchableOpacity>
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
                    <Button
                        containerStyle={{padding:10,marginTop:20,marginLeft:20,marginRight:20, borderRadius:4, backgroundColor: 'white',borderWidth:2,borderColor:'red'}}
                        style={{fontSize: 20, color: 'red'}}
                        onPress={()=>this.props.logout()}>
                        退出登录
                    </Button>
                </ScrollView>
                <Modal
                    animationType={"slide"}         //modal弹出的动画
                    visible={this.state.modalVisible}       //是否可见
                    onRequestClose={()=>this._onRequestClose()}           //关闭的时候调用
                >
                    <View>
                        <TouchableOpacity style={styles.closeModal} onPress={()=>this._closeModal()}>
                            <Icon size={50} name="ios-close-outline"/>
                        </TouchableOpacity>
                        <View style={{flexDirection: 'column',marginTop:80}}>
                            <View style={{flexDirection: 'row',alignItems: 'center',marginTop:20}}>
                                <Text style={{marginLeft:20}}>名称:</Text>
                                <TextInput
                                    placeholder="输入你的名称"
                                    style={styles.textInput}
                                    underlineColorAndroid="transparent"
                                    defaultValue={this.state.user.nikename}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    onChangeText={(text)=>this._changeUserStatu('nikename',text)}
                                />
                            </View>

                            <View style={{flexDirection: 'row',alignItems: 'center',marginTop:20}}>
                                <Text style={{marginLeft:20}}>品种:</Text>
                                <TextInput
                                    placeholder="输入你的品种"
                                    style={styles.textInput}
                                    underlineColorAndroid="transparent"
                                    defaultValue={this.state.user.breed}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    onChangeText={(text)=>this._changeUserStatu('breed',text)}
                                />
                            </View>

                            <View style={{flexDirection: 'row',alignItems: 'center',marginTop:20}}>
                                <Text style={{marginLeft:20}}>年龄:</Text>
                                <TextInput
                                    placeholder="输入你的年龄"
                                    style={styles.textInput}
                                    underlineColorAndroid="transparent"
                                    defaultValue={this.state.user.age}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    onChangeText={(text)=>this._changeUserStatu('age',text)}
                                />
                            </View>

                            <View
                                style={{flexDirection: 'row',alignItems: 'center',marginTop:20,justifyContent:'space-between',paddingRight:80}}>
                                <Text style={{marginLeft:20}}>性别:</Text>
                                <Icon.Button
                                    //默认gender布局，如果user.gender == 'male' 就切换genderChecked布局
                                    style={[styles.gender , user.gender == 'male'&& styles.genderChecked]}
                                    name="ios-person"
                                    onPress={()=>this._changeUserStatu('gender','male')}
                                >
                                    男
                                </Icon.Button>

                                <Icon.Button
                                    style={[styles.gender , user.gender == 'female'&& styles.genderChecked]}
                                    name="ios-person-outline"
                                    onPress={()=>this._changeUserStatu('gender','female')}
                                >
                                    女
                                </Icon.Button>
                            </View>


                            <View style={{flexDirection: 'row',marginTop:20,justifyContent:'center'}}>
                                <Button
                                    containerStyle={{padding:10,marginTop:20, borderRadius:4, backgroundColor: 'white',borderWidth:2,borderColor:'red'}}
                                    style={{fontSize: 20, color: 'red'}}
                                    onPress={()=>this._save()}>
                                    保存修改
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    _save = () => {
        this._asyncUser()
    }

    //修改后保存
    _changeUserStatu = (key, value) => {
        var user = this.state.user
        user[key] = value
        this.setState({
            user: user
        })
    }

    _onRequestClose = () => {

    }

    //关闭modal
    _closeModal = () => {
        if (this.state.modalVisible) {
            this.setState({
                modalVisible: false
            })
        }
    }

    //编辑
    _edit = () => {
        if (!this.state.modalVisible) {
            this.setState({
                modalVisible: true
            })
        }
    }

    //把更新后的用户数据发送给服务器同步起来
    _asyncUser = (isAvatar) => {
        var user = this.state.user
        if (user && user.accessToken) {
            var url = conf.api.base + conf.api.update
            var options = _.extend(conf.header, {
                body: JSON.stringify(user)
            })
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
                        this._closeModal()
                        AsyncStorage.setItem('user', JSON.stringify(user))
                    })
                })
        }
    }

    getQiniuToken = () => {
        var accessToken = this.state.user.accessToken
        var signatureURL = conf.api.base + conf.api.signature
        return request.post(signatureURL, {
            accessToken: accessToken,
            cloud: 'qiniu'
        })
    }

    _pickerIMG = () => {
        ImagePicker.showImagePicker(photoOptions, (response) => {
            console.log('Response = ', response)
            if (response.didCancel) {
                return
            }
            //把选择的图片转换成base64，然后存储到user对象。
            var avartarData = 'data:image/jpeg;base64,' + response.data
            var uri = response.uri
            //把图片上传到Cloudinary图床
            // var timestamp = Date.now()
            // var tags = 'app,avatar'     //图片标签
            // var folder = 'avatar'       //图床文件夹
            this.getQiniuToken()
                .then((data) => {
                    if (data && data.success) {
                        var token = data.data.token
                        var key = data.data.key
                        //构建上传的表单。
                        var body = new FormData()
                        body.append('token', token)
                        body.append('key',key)
                        body.append('file', {
                            type: 'image/jpeg',
                            uri: uri,
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
        this.setState({
            avatarUploading: true,
            avatarProgress: 0
        })
        xhr.open('POST', url)
        xhr.onload = () => {
            if (xhr.status !== 200) {
                alert("请求失败")
                return
            }
            if (!xhr) {
                alert("请求超时")
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
            if (response) {
                var user = this.state.user
                //如果有public_id 说明用的是cloudinary图床
                if (response.public_id)
                    user.avatar = response.public_id
                if (response.key)   //如果有key,说明用的是七牛图床
                    user.avatar = response.key
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
    gender: {
        backgroundColor: '#ccc',
    },
    genderChecked: {
        backgroundColor: '#ee735c',
    },
    textInput: {
        width: width * 0.7,
        height: 40,
        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#ccc',
        marginLeft: 20,
    },
    closeModal: {
        position: 'absolute',
        top: 20,
        right: 80
    },
    topRightedit: {
        position: 'absolute',
        right: 15,
        top: 8
    },
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

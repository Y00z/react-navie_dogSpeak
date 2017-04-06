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
    ScrollView
} from 'react-native';
var Dimensions = require('Dimensions');
var {width, height} =Dimensions.get('window')
import Icon from 'react-native-vector-icons/Ionicons';
import  ImagePicker from 'react-native-image-picker';

var CLOUDINARY = {
    cloud_name: 'deq99znbe',
    api_key: '132214329484465',
    api_secret: 'Lz3pLZyJ0ahd-C-5s7fbob8NGS0',
    base: 'http://res.cloudinary.com/deq99znbe',
    image : 'https://api.cloudinary.com/v1_1/deq99znbe/image/upload',
    video : 'https://api.cloudinary.com/v1_1/deq99znbe/video/upload',
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

export default class Edit extends Component {
    constructor(props) {
        super(props)
        var user = this.props.user || {}
        this.state = {
            avatarSource: null,
            user: user
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
                            user.avatar.indexOf('http:') == -1
                                ?       //有头像的时候
                                <View>
                                    <Image style={styles.backgroundIMG}
                                           source={{uri:user.avatar}}/>
                                    <TouchableOpacity activeOpacity={0.8} onPress={()=>this._pickerIMG()}
                                                      style={styles.radiusBack}>
                                        <Image style={styles.radiusIMG}
                                               source={{uri:user.avatar}}/>
                                    </TouchableOpacity>
                                </View>

                                :       //没头像的时候
                                <View>
                                    <Image style={styles.backgroundIMG}
                                           source={{uri:'http://oi8g0l23v.bkt.clouddn.com/qbc.jpg'}}/>
                                    <TouchableOpacity activeOpacity={0.8} onPress={()=>this._pickerIMG()}
                                                      style={styles.radiusNotBack}>
                                        <Text style={{color:'white',marginBottom:5}}>添加狗狗头像</Text>
                                        <View
                                            style={{backgroundColor:'white',width:80,height:80,justifyContent:'center',alignItems: 'center',paddingLeft:8}}>
                                            <Icon size={70} style={styles.radiusIMG} name="ios-cloud-upload-outline"/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                        }
                    </View>

                </ScrollView>
            </View>
        )
    }

    _pickerIMG = () => {
        ImagePicker.showImagePicker(photoOptions, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                return
            }
            //把选择的图片转换成base64，然后存储到user对象。
            var avartarData = 'data:image/jpeg;base64,' + response.data
            var user = this.state.user
            user.avatar = avartarData
            this.setState({
                user: user
            })


        })
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
    radiusBack:{
        width: 100,
        height: 100,
        position: 'absolute',
        left: 140,
        top: 40,
    },
    radiusNotBack: {
        width: 100,
        height: 100,
        position: 'absolute',
        left: 140,
        top: 25,
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

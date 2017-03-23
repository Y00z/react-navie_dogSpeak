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
    ListView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
var Dimensions = require("Dimensions");
var {width, height} = Dimensions.get('window');
var Mock = require('mockjs');
export default class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            })
        }
    }

    static defaultProps = {
        uri_api: 'http://rap.taobao.org/mockjs/15752/init?reqParam=dog'
    }

    render() {
        return (
            <View style={{backgroundColor: 'rgba(240,239,245,1.0)'}}>
                <View style={styles.accountTopStyles}>
                    <Text style={styles.accountTopTextStyles}>狗狗说</Text>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                />
            </View>
        )
    }

    componentDidMount() {
        this.initData()
    }

    initData() {
        fetch(this.props.uri_api)
            .then((response) => response.json())
            .then((response) => {
                var data = Mock.mock(response);
                this.parseData(data.data);
            })
            .catch((error) => {
                console.error(error)
            })
    }

    parseData(data) {
        var listArr = [];
        for (var i = 0; i < data.length; i++) {
            var itemData = data[i];
            listArr.push(itemData);
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(listArr)
        });
    }

    _renderRow(rowData) {
        return (
            <View style={{marginBottom: 5}}>
                <View style={{backgroundColor: 'white', alignItems: 'center'}}>
                    <Text style={styles.accountTopItemTextStyles}>{rowData.title}</Text>
                </View>
                <Image style={styles.accountImgStyles} source={{uri: rowData.imgUrl}}/>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={styles.accountBottomItemStyles}>
                        <Icon size={30} name="ios-heart-outline"/>
                        <Text style={{marginLeft: 10}}>喜欢</Text>
                    </View>
                    <View style={styles.accountBottomItemStyles}>
                        <Icon size={30} name="ios-chatboxes-outline"/>
                        <Text style={{marginLeft: 10}}>评论</Text>
                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    accountTopItemTextStyles: {
        fontSize: 17,
        color: 'black',
        padding: 5,
    },
    accountBottomItemStyles: {
        backgroundColor: 'white',
        width: width / 2 - 1,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    accountImgStyles: {
        width: width,
        height: 200
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
})
module.exports = Account;

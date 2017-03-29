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
    ListView,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
var Dimensions = require("Dimensions");
var {width, height} = Dimensions.get('window');
var Mock = require('mockjs');
var Detail = require('./detail');
var cacheResult = {     //缓存的数据。
    nextPage: 1,
    items: [],
    total: 0
}

export default class Account extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }),
            isMoreLoading: false,    //是否正在加载更多数据
            isRefreshing: false,     //是否正在刷新
            isLiek: false
        }
    }

    static defaultProps = {
        uri_api: 'http://rap.taobao.org/mockjs/15752/init?reqParam=dog',
        liek_api: 'http://rap.taobao.org/mockjs/15752/liek?up=123&accessToken=321'
    }

    render() {
        return (
            <View style={{backgroundColor: 'rgba(240,239,245,1.0)', flex: 1}}>
                <View style={styles.accountTopStyles}>
                    <Text style={styles.accountTopTextStyles}>狗狗说</Text>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    automaticallyAdjustContentInsets={false}
                    enableEmptySections={true}
                    onEndReached={() => this._fetchMore()}   //加载更多
                    onEndReachedThreshold={20}
                    renderFooter={() => this._renderFooter()}
                    showsVerticalScrollIndicator={false}    //隐藏纵向滚动条
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#ff0000"
                            title="拼命加载中..."
                            titleColor="#00ff00"
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#ffff00"/> }
                />
            </View>
        )
    }

    _onRefresh = () => {
        if (this.state.isRefreshing) {
            return null;
        }
        this.initData(0);
    }

    _renderFooter = () => {       //全部加载完毕的时候。
        if (!this._hasMore() && cacheResult.total !== 0) {
            return <View>
                <Text style={{fontSize: 15, color: 'gray', textAlign: 'center'}}>已经没有更多数据了</Text>
            </View>
        }

        if (!this.state.isMoreLoading) {
            return <View></View>
        }

        return <ActivityIndicator style={{height: 80}} size="small"/>
    }

    _hasMore = () => {     //当视频总量，等于  已经缓存了的视频总量
        if (cacheResult.total <= cacheResult.items.length) {
            return false
        } else {    //当视频总量，不等于  已经缓存了的视频总量，说明还有数据
            return true;
        }
    }

    _fetchMore = () => {     //加载更多，如果没有了更多数据，或者正在加载数据的状态中，就return
        if (!this._hasMore() || this.state.isMoreLoading) {
            return null;
        }
        var page = cacheResult.nextPage;
        this.initData(page)
    }


    componentDidMount() {
        this.initData(1)
    }

    initData = (page) => {
        if (page !== 0) {       //如果page不等于0，说明不是下拉刷新，只设置加载更多就行了
            this.setState({
                isMoreLoading: true,
            })
        } else {                //如果page等于0，说明是下拉刷新，设置下拉刷新就行了
            this.setState({
                isRefreshing: true
            })
        }

        fetch(this.props.uri_api + "&page=" + page)
            .then((response) => response.json())
            .then((response) => {
                var data = Mock.mock(response);
                var item = cacheResult.items.slice();  //把缓存中的item数组放到一个新的数组里面
                if (page !== 0) {
                    item = item.concat(data.data)           //item里面追加新加载的数据。
                    cacheResult.nextPage += 1
                } else {
                    item = data.data
                }
                cacheResult.items = item               //cacheResult里面放着所有加载的数据
                cacheResult.total = data.total
                setTimeout(() => {
                    if (page !== 0) {
                        this.setState({
                            isMoreLoading: false,
                            dataSource: this.state.dataSource.cloneWithRows(cacheResult.items)
                        })
                    } else {
                        this.setState({
                            isRefreshing: false,
                            dataSource: this.state.dataSource.cloneWithRows(cacheResult.items)
                        })
                    }
                }, 300)
            })
            .catch((error) => {
                if (page !== 0) {
                    this.setState({
                        isMoreLoading: false,
                    })
                } else {
                    this.setState({
                        isRefreshing: false
                    })
                }
                console.error(error)
            })
    }

    _renderRow = (rowData, sectionID, rowID, highlightRow) => {
        return (
            <View style={{marginBottom: 5}}>
                <TouchableOpacity onPress={() => this.pushToAccountDetail(rowData, rowID)}>
                    <View>
                        <View style={{backgroundColor: 'white', alignItems: 'center'}}>
                            <Text style={styles.accountTopItemTextStyles}>{rowData.title}</Text>
                        </View>
                        <Image style={styles.accountImgStyles} source={{uri: rowData.imgUrl}}/>
                        <Icon style={styles.play} size={30} name="ios-play"/>
                    </View>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => this._up()}>
                        <View style={styles.accountBottomItemStyles}>
                            <Icon size={30}
                                  name={this.state.isLiek ? "ios-heart" : "ios-heart-outline"}
                                  style={this.state.isLiek ? [styles.up] : null}
                            />
                            <Text style={{marginLeft: 10}}>喜欢</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.accountBottomItemStyles}>
                        <Icon size={30} name="ios-chatboxes-outline"/>
                        <Text style={{marginLeft: 10}}>评论</Text>
                    </View>
                </View>
            </View>
        )
    }

    pushToAccountDetail = (rowData, rowID) => {
        this.props.navigator.push({
            component: Detail,
            title: '详情页',
            passProps: {
                data: rowData,
                rowId: rowID
            }
        })
    }

    _up = () => {
        fetch(this.props.liek_api + "&page=")
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    this.setState({
                        isLiek: !this.state.isLiek
                    })
                }else{
                    alert("点赞错误");
                }
            })
            .catch((error) => {
                alert("点赞错误");
                console.error(error)
            })
    }
}


const styles = StyleSheet.create({
    up: {
        color: 'red'
    },
    play: {
        borderRadius: 25,
        borderColor: 'white',
        borderWidth: 1,
        color: 'orange',
        position: 'absolute',
        bottom: 15,
        right: 30,
        width: 40,
        height: 40,
        paddingTop: 5,
        paddingLeft: 15
    },
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

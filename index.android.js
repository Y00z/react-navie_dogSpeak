/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Navigator
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import Icon from 'react-native-vector-icons/Ionicons';

var Account = require('./app/account/index')
var Edit = require('./app/edit/index')
var Creation = require('./app/creation/index')

export default class rn_pet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedTab: "account"
        }
    }

    render() {
        return (
            <TabNavigator
                tabBarStyle={{height: 53, overflow: 'hidden'}}>
                {this._renderTabBarItem('account', "首页", 'ios-videocam-outline', 'ios-videocam', Account,)}
                {this._renderTabBarItem('creation', "录音", 'ios-recording-outline', 'ios-recording', Creation)}
                {this._renderTabBarItem('edit', "我的", 'ios-more-outline', 'ios-more', Edit, "1")}
            </TabNavigator>

        )
    }

    _renderTabBarItem(selectedTab, title, renderIcon, renderSelectedIcon, component, badgeText) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === selectedTab}
                title={title}
                renderIcon={() => <Icon size={30} name={renderIcon}/>}
                renderSelectedIcon={() => <Icon size={30}  name={renderSelectedIcon}/>}
                onPress={() => this.setState({selectedTab: selectedTab})}
                badgeText={badgeText}>
                <Navigator
                    initialRoute={{name: {title}, component: component}}
                    configureScene={(route, routeStack) => {
                        return Navigator.SceneConfigs.PushFromRight;
                    }}
                    //route拿到路由!!route.component拿到的是initialRoute下的component
                    //然后把component给渲染成组件并且return出去，并且把navigator设置成属性
                    renderScene={(route, navigator) => {
                        return <route.component navigator={navigator}  {...route.passProps} />;
                    }}
                />
            </TabNavigator.Item>
        )
    }
}


const styles = StyleSheet.create({
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
    img: {
        height: 280,
        width: 280,
        alignSelf: 'center',
    }
});
AppRegistry.registerComponent('rn_pet', () => rn_pet);

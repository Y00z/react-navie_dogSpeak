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
    Navigator
} from 'react-native';
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window')

export default class Creation extends Component {
    render() {
        return (
            <View style={{backgroundColor: 'rgba(240,239,245,1.0)', flex: 1}}>
                <View style={styles.creattionTopStyles}>
                    <Text style={styles.creattionTopTextStyles}>理解狗狗,从配音开始</Text>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
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
});
module.exports = Creation;

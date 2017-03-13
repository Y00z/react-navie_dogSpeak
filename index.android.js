/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    AppRegistry,
    Text,
    View
} = ReactNative;

const rn_pet = React.createClass({
    render() {
        return (
            <View>
                <Text>Hello World</Text>
            </View>
        )
    },
});


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
});
AppRegistry.registerComponent('rn_pet', () => rn_pet);

import React, { Component } from 'react';
import {View ,Button, StyleSheet } from 'react-native';
import {TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: ""
        }
    }
    //user log in function
    login = async () => {

        //Validation here...

        return fetch("http://localhost:3333/api/1.0.0/login", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 400){
                throw 'Invalid email or password';
            }else if(response.status === 500){
                throw 'Server Error'   
            }else
            throw 'Something went wrong';
        })
        .then(async (responseJson) => {
                console.log(responseJson);
                await AsyncStorage.setItem('@session_token', responseJson.token);
                await AsyncStorage.setItem('@user_id', responseJson.id);
                this.props.navigation.navigate("Home");
        })
        .catch((error) => {
            console.log(error);
        })
    }

    //rendering to screen
    render(){
        return (
            <View style={styles.container1}>
                <TextInput
                    placeholder="Enter your email..."
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <TextInput
                    placeholder="Enter your password..."
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    secureTextEntry
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <Button
                    title="Login"
                    onPress={() => this.login()}
                />
                <Button
                    title="Don't have an account?"
                    color="darkblue"
                    onPress={() => this.props.navigation.navigate("Signup")}
                />
            </View>
        )
    }
}

export default LoginScreen;
//style sheet for page styling
const styles = StyleSheet.create(
    {
      container1:
      {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: 1
      },
    });
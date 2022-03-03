import React, {Component} from 'react';
import {View, Text, Button, StyleSheet, Image, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class HomeScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
      userData: []
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getUserData();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  
  getLogo = async () =>
  {
    const userId = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + userId + "/photo", {
          'headers': {
            'X-Authorization':  value
          }
        })
        .then((res) => {
            return res.blob();
        })
        .then((resBlob) => {
          let data = URL.createObjectURL(resBlob);
          this.setState({
            isLoading: false,
            photo: data
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  getUserData = async () => 
  {
    const userId = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + userId, {
          'headers': {
            'X-Authorization':  value
          }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              console.log("Un Aurthorised");
            }else if(response.status === 404){
              console.log("Not Found");
            }else if(response.status === 500){
              console.log("Server Error");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          this.setState({
            userData: responseJson
          })
          this.getData();
        })
        .catch((error) => {
            console.log(error);
        })
  }

  getData = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/search", {
          'headers': {
            'X-Authorization':  value
          }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          this.setState({
            listData: responseJson
          })
          this.getLogo();
        })
        .catch((error) => {
            console.log(error);
        })
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

  render() {
    
    if (this.state.isLoading){
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Loading..</Text>
        </View>
      );
    }else{
      return (
          <View style={styles.container1}>

          <Image
          style={styles.logo}
          source={{uri: this.state.photo}}
          />
          
          <Text>{this.state.userData.first_name}</Text>
          <Text>{this.state.userData.last_name}</Text>

          <Text>{this.state.userData.email}</Text>

          <Button
          title="Log Out"
          onPress={() => this.props.navigation.navigate("Logout")}
          />
          <Button
          title="Edit Profile"
          onPress={() => this.props.navigation.navigate("Edit")}
          />

        </View>
      );
    }
    
  }
}

const styles = StyleSheet.create(
  {
    container1:
    {
      flex:1,
      flexDirection: 'column',
      justifyContent:'space-evenly',
      alignItems: 'center',
      padding: 10
    },
    logo:
    {
      width: 200,
      height: 200
    }
  });


export default HomeScreen;

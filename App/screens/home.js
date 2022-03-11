import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, Image, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class HomeScreen extends Component {
  constructor(props) {
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
      this.getUserData();
      this.getPicture();
    });
    this.getUserData();
    this.getPicture();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  //checking user is logged in, if not, redirect to log in page
  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  //getting logged in users profile picture
  getPicture = async () => {
    const userId = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + userId + "/photo", {
      'headers': {
        'X-Authorization': value,
        'Content-Type': 'image/png'
      }
    })
      .then((response) => {
        if(response.status === 200){
          return response.blob();
        } else if (response.status === 401) {
          console.log("Un Aurthorised");
        } else if (response.status === 404) {
          console.log("Not Found");
        } else if (response.status === 500) {
          console.log("Server Error");
        } else {
          throw 'Something went wrong';
        } 
      })
      .then((responsePicture) => {
        let data = URL.createObjectURL(responsePicture);
        this.setState({
          isLoading: false,
          photo: data
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }
//getting user data from the database to be displayed
  getUserData = async () => {
    const userId = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + userId, {
      'headers': {
        'X-Authorization': value,
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 401) {
          console.log("Un Aurthorised");
        } else if (response.status === 404) {
          console.log("Not Found");
        } else if (response.status === 500) {
          console.log("Server Error");
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          userData: responseJson
        })
      }).catch((error) => {
        console.log(error);
      })
  }
//rending to the screen
  render() {

    if (this.state.isLoading) {
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
    } else {
      //displaying user image, first and last name as well as email
      //styling being called from stylesheet
      //buttons for navigating specific screens
      return (
        <View style={styles.container1}>

          <Image
            style={styles.logo}
            source={{ uri: this.state.photo}}
          />

          <Text>{this.state.userData.first_name}</Text>
          <Text>{this.state.userData.last_name}</Text>

          <Text>{this.state.userData.email}</Text>

          <Button
            title="Edit Profile"
            onPress={() => this.props.navigation.navigate("Edit")}
          />
          <Button
            title="Friends"
            onPress={() => this.props.navigation.navigate("Friends")}
          />
          <Button
            title="Posts"
            onPress={() => this.props.navigation.navigate("Posts")}
          />
          <Button
            title="Log Out"
            onPress={() => this.props.navigation.navigate("Logout")}
          />
        </View>
      );
    }

  }
}
export default HomeScreen;
//style sheet for page styling
const styles = StyleSheet.create(
  {
    container1:
    {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      padding: 10
    },
    logo:
    {
      width: 200,
      height: 200
    }
  });




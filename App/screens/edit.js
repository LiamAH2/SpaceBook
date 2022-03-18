import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, Image, ScrollView, TextInput, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class EditScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
      userData: []
    }
  }

  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async() => {
    
      this.checkLoggedIn();
      this.getUserData();
    });
    this.getUserData();
  }

  componentWillUnmount() {
    this.unsubscribe();

  }

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
        if (response.status === 200) {
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
  //getting user data
  getUserData = async () => {
    const userId = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + userId, {
      'headers': {
        'X-Authorization': value
      }
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 401) {
          console.log("Un Aurthorised");
        } else if (response.status === 403) {
          console.log("Forbidden");
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
        this.getPicture();
      })
      .catch((error) => {
        console.log(error);
      })
  }


  //checking user logged in
  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };



  //edditing current user info
  edit = async () => {
    const userId = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    let to_send = {};

    if (this.state.first_name != this.state.userData.first_name) {
      to_send['first_name'] = this.state.first_name;
    }

    if (this.state.last_name != this.state.userData.last_name) {
      to_send['last_name'] = this.state.last_name;
    }

    if (this.state.email != this.state.userData.email) {
      to_send['email'] = this.state.email;
    }
    return fetch("http://localhost:3333/api/1.0.0/user/" + userId, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'X-Authorization': value
      },
      body: JSON.stringify(to_send)
    })
      .then((response) => {
        if (response.status === 200) {
          this.props.navigation.navigate("Home");
          return response.json();
        } else if (response.status === 400) {
          throw "bad request";
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
          throw "Un Aurthorised";
        } else if (response.status === 403) {
          throw "Forbidden"
        } else if (response.status === 404) {
          throw "Not Found";
        } else if (response.status === 500) {
          throw "Server Error";
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  //displaying to page
  render() {
    return (
      <View style={styles.container1}>

        <Image
          style={styles.logo}
          source={{ uri: this.state.photo }}
        />
        <Button
          title="Edit Picture"
          onPress={() => this.props.navigation.navigate("UpdatePhoto")}
        />
        <Text>{this.state.userData.first_name}</Text>
        <Text>{this.state.userData.last_name}</Text>

        <Text>{this.state.userData.email}</Text>

        <ScrollView>
          <TextInput
            placeholder="Enter new first name"
            onChangeText={(first_name) => this.setState({ first_name })}
            defaultValue={this.state.first_name}
            style={{ padding: 5, borderWidth: 1, margin: 5 }}
          />
          <TextInput
            placeholder="enter new last name"
            onChangeText={(last_name) => this.setState({ last_name })}
            defaultValue={this.state.last_name}
            style={{ padding: 5, borderWidth: 1, margin: 5 }}
          />
          <TextInput
            placeholder="Enter new email"
            onChangeText={(email) => this.setState({ email })}
            defaultValue={this.state.email}
            style={{ padding: 5, borderWidth: 1, margin: 5 }}
          />
          <Button
            title="Update info"
            onPress={() => this.edit()}
          />
          <Button
            title="Return home"
            onPress={() => this.props.navigation.navigate("Home")}
          />
        </ScrollView>
      </View>
    );
  }
}



export default EditScreen;
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
    },
    camera:
    {
      flex: 1,
    }

  });
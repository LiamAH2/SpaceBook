import React, {Component} from 'react';
import {View, Text, Button, StyleSheet, Image, ScrollView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class EditScreen extends Component {
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
  

  
  //getting user profile picture
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
  //getting user data
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
            }else if(response.status === 403){
                console.log("Forbidden");
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

    if (this.state.first_name != this.state.first_name){
      to_send['user_givenname'] = this.state.first_name;
    }

    if (this.state.last_name != this.state.last_name){
      to_send['user_familyname'] = this.state.last_name;
    }

    if (this.state.email != this.state.email){
      to_send['user_email'] = this.state.email;
    }

    console.log(JSON.stringify(to_send));

    return fetch("http://localhost:3333/api/1.0.0/user/", {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(to_send)
    })
    .then((responseJson) => {
        this.setState({
            listData: responseJson
          })
    })
    .catch((error) => {
      console.log(error);
    })
  }
//displaying to page
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
          <Button
          title="Edit Picture"
          onPress={() => this.props.navigation.navigate("Edit")}
          />
          <Text>{this.state.userData.first_name}</Text>
          <Text>{this.state.userData.last_name}</Text>

          <Text>{this.state.userData.email}</Text>

        <ScrollView>
                <TextInput
                    placeholder="Enter new first name"
                    onChangeText={(first_name) => this.setState({first_name})}
                    value={this.state.first_name}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <TextInput
                    placeholder="enter new last name"
                    onChangeText={(last_name) => this.setState({last_name})}
                    value={this.state.last_name}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <TextInput
                    placeholder="Enter new email"
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                    style={{padding:5, borderWidth:1, margin:5}}
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
    },
    butttongroup:
    {
      flex:1  
    }
  });


export default EditScreen;

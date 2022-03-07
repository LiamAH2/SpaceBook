import React, {Component} from 'react';
import {View, Text, Button, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';

class EditScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      editing: false,
      listData: [],
      userData: [],
      hasPermission: null,
      type: Camera.Constants.Type.back
    }
  }

  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();  
    });
    this.getUserData();
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({hasPermission: status === 'granted'});
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

 

  sendToServer = async (data) => {
    // Get these from AsyncStorage
    const userId = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');

    let res = await fetch(data.base64);
    let blob = await res.blob();

    return fetch("http://localhost:3333/api/1.0.0/user/" + userId + "/photo", {
        method: "POST",
        headers: {
            "Content-Type": "image/png",
            "X-Authorization": value
        },
        body: blob
    })
    .then((response) => {
        console.log("Picture added", response);
        {window.location.reload(false);}
    })
    .catch((err) => {
        console.log(err);
    })
}

takePicture = async () => {
  if(this.camera){
      const options = {
          quality: 0.5, 
          base64: true,
          onPictureSaved: (data) => this.sendToServer(data)
      };
      await this.camera.takePictureAsync(options); 
  } 
}

//edditing current user info
  edit = async () => {
    const userId = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    let to_send = {};

    if (this.state.first_name != this.state.userData.first_name){
      to_send['first_name'] = this.state.first_name;
    }

    if (this.state.last_name != this.state.userData.last_name){
      to_send['last_name'] = this.state.last_name;
    }

    if (this.state.email != this.state.userData.email){
      to_send['email'] = this.state.email;
    }

    console.log(JSON.stringify(to_send));

    return fetch("http://localhost:3333/api/1.0.0/user/" + userId, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          'X-Authorization':  value
        },
        body: JSON.stringify(to_send)
    })
    .then((response) => {
      if(response.status === 200)
      return response.json();
      window.location.reload(false);
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
    }
    else if(this.state.editing){
      if(this.state.hasPermission){
        return(
          <View style={styles.container1}>
            <Camera 
              style={styles.container1} 
              type={this.state.type}
              ref={ref => this.camera = ref}
            >
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.takePicture();
                  }}>
                  <Text style={styles.text}> Take Photo </Text>
                </TouchableOpacity>
              </View>
            </Camera>
          </View>
        );
      }else{
        return(
          <Text>No access to camera</Text>
        );
      }
    }
    else{
      return (
          <View style={styles.container1}>

          <Image
          style={styles.logo} 
          source={{uri: this.state.photo}}
          />
           <Button
          title="Edit Picture"
          onPress={() => this.setState({editing: true})}
          />
          <Text>{this.state.userData.first_name}</Text>
          <Text>{this.state.userData.last_name}</Text>

          <Text>{this.state.userData.email}</Text>

        <ScrollView>
                <TextInput
                    placeholder="Enter new first name"
                    onChangeText={(first_name) => this.setState({first_name})}
                    defaultValue={this.state.first_name}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <TextInput
                    placeholder="enter new last name"
                    onChangeText={(last_name) => this.setState({last_name})}
                    defaultValue={this.state.last_name}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <TextInput
                    placeholder="Enter new email"
                    onChangeText={(email) => this.setState({email})}
                    defaultValue={this.state.email}
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
    camera:
    {
      flex: 1,
    }

  });


export default EditScreen;

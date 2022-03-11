import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';

//updating users picture using the camera
class UpdatePhoto extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      hasPermission: null,
      type: Camera.Constants.Type.back
    }
  }
//checking if permissions have been granted or denied for the camera
  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.checkLoggedIn();
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log("Status", status);
      this.setState({ hasPermission: status === 'granted', isLoading: false });
    });
    const { status } = await Camera.requestCameraPermissionsAsync();
    console.log("Status", status);
    this.setState({ hasPermission: status === 'granted', isLoading: false });

  }

  componentWillUnmount() {
    this.unsubscribe();

  }


  //checking user logged in
  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };


//sending new photo to database using POST method
  sendToServer = async (data) => {
    // Get these from AsyncStorage
    const userId = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');

    let res = await fetch(data.base64);
    let blob = await res.blob();

    //sending photo data to DB using POST
    return fetch("http://localhost:3333/api/1.0.0/user/" + userId + "/photo", {
      method: "POST",
      headers: {
        "Content-Type": "image/png",
        "X-Authorization": value
      },
      body: blob
    })
    //navigation to gome page when picture has been taken
      .then((response) => {
        console.log("Picture added", response);
        this.props.navigation.navigate("Home");
      })
      .catch((err) => {
        console.log(err);
      })
  }
//taking picture of the user and calling the sendToServer function above
  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => this.sendToServer(data)
      };
      //setting camera options using above options
      await this.camera.takePictureAsync(options);
    }
  }


  //displaying to page
  render() {
    //if camera has permissions granted, will display it to page
    if (this.state.hasPermission) {
      return (
        <View style={styles.container}>
          <Camera
            style={styles.camera}
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
    } else {
      //no permission shows below message
      return (
        <Text>No access to camera</Text>
      );
    }
  }
}

//styling for the camera
const styles = StyleSheet.create(
  {
    container:
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


export default UpdatePhoto;

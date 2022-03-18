/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, Text, Button, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles';

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
      userData: [],
    };
  }

  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      let nullUserID = await AsyncStorage.getItem('@user_id');
      if (!this.props.route.params) {
        nullUserID = await AsyncStorage.getItem('@user_id');
      } else {
        nullUserID = this.props.route.params.user_id;
      }
      this.checkLoggedIn();
      this.getUserData(nullUserID);
      this.getPicture(nullUserID);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // checking user is logged in, if not, redirect to log in page
  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  // getting user data from the database to be displayed
  getUserData = async (userId) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
      headers: {
        'X-Authorization': value,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          console.log('Un Aurthorised');
          this.props.navigate.navigation('Login');
        } else if (response.status === 404) {
          console.log('Not Found');
        } else if (response.status === 500) {
          console.log('Server Error');
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          userData: responseJson,
        });
      }).catch((error) => {
        console.log(error);
      });
  };

  // getting logged in users profile picture
  getPicture = async (userId) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo`, {
      method: 'GET',
      headers: {
        'X-Authorization': value,
        'Content-Type': 'image/png',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.blob();
        } if (response.status === 401) {
          console.log('Un Aurthorised');
          this.props.navigate.navigation('Login');
        } else if (response.status === 404) {
          console.log('Not Found');
        } else if (response.status === 500) {
          console.log('Server Error');
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responsePicture) => {
        const data = URL.createObjectURL(responsePicture);
        this.setState({
          isLoading: false,
          photo: data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // rending to the screen
  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>Loading..</Text>
        </View>
      );
    }
    // displaying user image, first and last name as well as email
    // styling being called from stylesheet
    // buttons for navigating specific screens
    return (
      <View style={styles.container1}>

        <Image
          style={styles.logo}
          source={{ uri: this.state.photo }}
        />

        <Text>{this.state.userData.first_name}</Text>
        <Text>{this.state.userData.last_name}</Text>

        <Text>{this.state.userData.email}</Text>

        <Button
          color="#ff5c5c"
          title="Edit Profile"
          onPress={() => this.props.navigation.navigate('Edit')}
        />
        <Button
          color="#ff5c5c"
          title="Friends"
          onPress={() => this.props.navigation.navigate('Friends')}
        />
        <Button
          color="#ff5c5c"
          title="Posts"
          onPress={() => this.props.navigation.navigate('Posts')}
        />
        <Button
          color="#ff5c5c"
          title="Log Out"
          onPress={() => this.props.navigation.navigate('Logout')}
        />
      </View>
    );
  }
}
export default HomeScreen;

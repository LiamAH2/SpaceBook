import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';

class FriendsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      q: '',
      requestList: [],
      friendList: [],
      friendSearch: [],
      sendRequest: [],
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.requestList();
      this.listFriend();
    });
    this.listFriend();
    this.requestList();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  // Search friend function
  friendSearch = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.q}&search_in=all&limit=20&offset=0`, {
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 400) {
          throw 'Bad Request';
        } else if (response.status === 401) {
          this.props.navigation.navigate('Login');
          throw 'Un Aurthorised';
        } else if (response.status === 500) {
          throw 'Server Error';
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          friendSearch: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // listing friends current user is friends with
  listFriend = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('@user_id');
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/friends`, {
      method: 'GET',
      headers: {
        'X-Authorization': value,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          this.props.navigation.navigate('Login');
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          friendList: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // GET requests (display list)
  requestList = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/friendrequests', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          console.log('Un Aurthorised');
        } else if (response.status === 500) {
          console.log('Server Error');
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          requestList: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Accept request POST
  acceptRequest = async (user_id) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${user_id}`, {
      method: 'POST',
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          this.props.navigation.navigate('Login');
        } else {
          throw 'Something went wrong';
        }
      })
      .then(() => {
        this.setState({
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // reject request DELETE
  rejectRequest = async (user_id) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${user_id}`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          this.props.navigation.navigate('Login');
        } else {
          throw 'Something went wrong';
        }
      })
      .then(() => {
        this.setState({
          isLoading: false,

        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // send friend request
  // eslint-disable-next-line
  sendRequest = async (user_id) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/friends`, {
      method: 'POST',
      headers: {
        'X-Authorization': value,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else if (response.status === 401) {
          this.props.navigation.navigate('Login');
          throw 'Un Aurthorised';
        } else if (response.status === 403) {
          throw 'Already Friends with this user';
        } else if (response.status === 404) {
          throw 'Not Found';
        } else if (response.status === 500) {
          throw 'Server Error';
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          sendRequest: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <View style={styles.container1}>
        <TextInput
          placeholder="Search"
          onChangeText={(q) => this.setState({ q })}
          value={this.state.q}
        />
        <Button
          title="Search"
          onPress={() => this.friendSearch(this.state.q)}
        />
        <FlatList
          data={this.state.friendSearch}
          renderItem={({ item }) => (
            <View>
              <Text>
                {item.user_givenname}
                {' '}
                {item.user_familyname}
              </Text>
              <Button
                title="View Profile"
                onPress={() => this.props.navigation.navigate('Home', { user_id: item.user_id })}
              />
              <Button
                title="Add Friend"
                onPress={() => this.sendRequest(item.user_id)}
              />
            </View>

          )}
          keyExtractor={(item) => item.user_id.toString()}
        />
        <FlatList
          data={this.state.friendList}
          renderItem={({ item }) => (
            <View>

              <Text>
                {item.user_givenname}
                {' '}
                {item.user_familyname}
              </Text>
              <Button
                title="View Profile"
                onPress={() => this.props.navigation.navigate('Home', { user_id: item.user_id })}
              />
            </View>
          )}
          keyExtractor={(item) => item.user_id.toString()}
        />
        <FlatList
          data={this.state.requestList}
          renderItem={({ item }) => (
            <View>
              <Text>
                Add +
                {' '}
                {item.first_name}
                {' '}
                {item.last_name}
                {' '}
                as a friend
              </Text>
              <Button
                title="Accept"
                onPress={() => this.acceptRequest(item.user_id)}
              />
              <Button
                title="Reject"
                onPress={() => this.rejectRequest(item.user_id)}
              />
            </View>
          )}
          keyExtractor={(item) => item.user_id.toString()}
        />
        <Button
          title="Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
      </View>

    );
  }
}
export default FriendsScreen;

const styles = StyleSheet.create(
  {
    container1:
    {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      padding: 50,
    },
    logo:
    {
      width: 200,
      height: 200,
    },
  },
);

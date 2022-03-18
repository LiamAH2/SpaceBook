/* eslint-disable camelcase */
import React, { Component } from 'react';
import {
  View, Button, ScrollView, TextInput, Text, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles';

class PostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      userData: [],
      postList: [],
      newPost: [],
      getPost: [],
      text: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.postList();
      this.getPost();
    });
    this.postList();
    this.getPost();
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

  // functions below

  // GET list of posts for a user
  /*
    get posts for another user
    err list- 200, 401, 403, 404, 500
    */
  postList = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('@user_id');
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post`, {
      method: 'GET',
      headers: {
        'X-Authorization': value,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          this.props.navigation.navigate('Login');
          throw 'Un Aurthorised';
        } else if (response.status === 403) {
          throw 'Can only view the posts of yourself or your friends';
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
          postList: responseJson,
          text: responseJson.text,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // POST new post
  /*
    add new post to current logged in user
    err list - 201, 401, 404, 500
    */
  newPost = async () => {
    const userId = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post`, {
      method: 'POST',
      headers: {
        'X-Authorization': value,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state),
    })
      .then((response) => {
        if (response.status === 201) {
          this.props.navigation.navigate('Home');
          return response.json();
        } if (response.status === 401) {
          this.props.navigation.navigate('Login');
          throw 'Un Aurthorised';
        } else if (response.status === 404) {
          throw 'Not Found';
        } else if (response.status === 500) {
          throw 'Server Error';
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // GET single post
  /*
    view a post from user
    err list - 200, 401, 403, 404, 500
    */
  getPost = async () => {
    const userId = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    const postID = await AsyncStorage.getItem('@post_id');
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post${postID}`, {
      method: 'GET',
      headers: {
        'X-Authorization': value,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          this.props.navigation.navigate('Login');
          throw 'Un Aurthorised';
        } else if (response.status === 403) {
          throw 'Can only view the posts of yourself or your friends';
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
          getPost: responseJson,
          text: responseJson.text,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // DELETE post
  /*
    delete post from current logged in user
    err list - 200, 401, 403, 404, 500
    */
  deletePost = async (post_ID) => {
    const userId = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post${post_ID}`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          this.props.navigation.navigate('Login');
          throw 'Un Aurthorised';
        } else if (response.status === 403) {
          throw 'Forbidden - you can only delete your own posts';
        } else if (response.status === 404) {
          throw 'Not Found';
        } else if (response.status === 500) {
          throw 'Server Error';
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // PATCH post
  /*
    update current logged in post
    err list - 200, 400, 401, 403, 404, 500
    */
  editPost = async () => {
    const userId = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    const postID = await AsyncStorage.getItem('@post_id');
    const to_send = {};

    if (this.state.post !== this.state.userData.post) {
      to_send.post = this.state.post;
    }
    console.log(JSON.stringify(to_send));

    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post${postID}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'X-Authorization': value,
      },
      body: JSON.stringify(to_send),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 400) {
          throw 'bad request';
        } else if (response.status === 401) {
          this.props.navigation.navigate('Login');
          throw 'Un Aurthorised';
        } else if (response.status === 403) {
          throw 'Can only view the posts of yourself or your friends';
        } else if (response.status === 404) {
          throw 'Not Found';
        } else if (response.status === 500) {
          throw 'Server Error';
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // POST liking
  /*
    like a post
    err list - 200, 401, 403, 404, 500
    */
  postLike = async () => {
    const userId = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    const postID = await AsyncStorage.getItem('@post_id');
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post${postID}/like`, {
      method: 'POST',
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 400) {
          throw 'bad request';
        } else if (response.status === 401) {
          this.props.navigation.navigate('Login');
          throw 'Un Aurthorised';
        } else if (response.status === 403) {
          throw 'You have already liked this post';
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
          postList: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // DELETE like
  /*
    unlike a post
    err list - 200, 401, 403, 404, 500
    */
  unlikePost = async () => {
    const userId = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    const postID = await AsyncStorage.getItem('@post_id');
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post${postID}/like`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          this.props.navigation.navigate('Login');
          throw 'Un Aurthorised';
        } else if (response.status === 403) {
          throw 'You have unliked this post';
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
          postList: responseJson,

        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // rendering to screen
  render() {
    return (
      <View style={styles.container1}>
        <ScrollView>
          <TextInput
            placeholder="Make a new post!"
            onChangeText={(text) => this.setState({ text })}
            Value={this.state.text}
            style={{ padding: 5, borderWidth: 1, margin: 5 }}
          />
          <Button
            title="Submit Post"
            onPress={() => this.newPost()}
          />
          <FlatList
            data={this.state.postList}
            renderItem={({ item }) => (
              <View style={styles.post}>
                <Text>
                  {item.text}
                  {' '}
                  <Button
                    color="green"
                    title="Like"
                    onPress={() => this.postLike()}
                  />
                  <Button
                    color="red"
                    title="Dislike"
                    onPress={() => this.unlikePost()}
                  />
                  <Button
                    color="orange"
                    title="Delete Post"
                    onPress={() => this.deletePost()}
                  />
                  <Button
                    color="yellow"
                    title="Edit Post"
                    onPress={() => this.editPost()}
                  />
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.post_id.toString()}
          />
        </ScrollView>
      </View>
    );
  }
}

export default PostScreen;

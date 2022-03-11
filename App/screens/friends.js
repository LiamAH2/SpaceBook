import React, {Component} from 'react';
import {View, Text, Button, StyleSheet,FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendsScreen extends Component {
    constructor(props){
      super(props);
  
      this.state = {
        isLoading: true,
        listData: [],
        userData: [],
        requestList: [],
        friendList: []
      }
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
          this.getData();
          this.requestList();
        });
      
        this.getData();
        this.requestList();
      }
    
      componentWillUnmount() {
        this.unsubscribe();
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
                isLoading: false,
                listData: responseJson
              })
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
    

      //search friend quety GET
      listFriend = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        const userId = await AsyncStorage.getItem('@user_id');
        return fetch("http://localhost:3333/api/1.0.0/user/" + userId + "/friends", {
          method: 'GET',
              'headers': {
                'X-Authorization':  value,
                'Content-Type': 'application/json'
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
                isLoading: false,
                friendList: responseJson
              })
            })
            .catch((error) => {
                console.log(error);
            })
      }
        //Add new friend POST
        /*
        addFriend = async() => {
          const userId = await AsyncStorage.getItem('@user_id');
          const value = await AsyncStorage.getItem('@session_token');
  
          return fetch("http://localhost:3333/api/1.0.0/user" + userId, {
              method: 'post',
              headers: {
                'X-Authorization':  value,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(this.state)
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
                 console.log("friend added", responseJson);
                 this.props.navigation.navigate("Home");
          })
          .catch((error) => {
              console.log(error);
          })
      }
*/
      //LEAVE EVERYTHING ALONE BELOW HERE LIAM
        //GET requests (display list)
        requestList = async () => {
          const value = await AsyncStorage.getItem('@session_token');
          return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
            method: 'GET',
                'headers': {
                  'Content-Type': 'application/json',
                  'X-Authorization':  value
                }
              })
              .then((response) => {
                if(response.status === 200){
                    return response.json()
                }else if(response.status === 401){
                  console.log("Un Aurthorised");
                }else if(response.status === 500){
                  console.log("Server Error");
                }else{
                    throw 'Something went wrong';
                }
            })
              .then((responseJson) => {
                this.setState({
                  isLoading: false,
                  requestList: responseJson
                })
              })
              .catch((error) => {
                  console.log(error);
              })
        }
        //Accept request POST
        acceptRequest = async (user_id) => {
          const value = await AsyncStorage.getItem('@session_token');
          return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + user_id, {
            method: 'POST',
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
                  isLoading: false,
                  listData: responseJson
                })
              })
              .catch((error) => {
                  console.log(error);
              })
        }
        //reject request DELETE
        rejectRequest = async (user_id) => {
          const value = await AsyncStorage.getItem('@session_token');
          return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + user_id, {
            method: 'DELETE',
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
                  isLoading: false,
                  listData: responseJson
                  
                })
              })
              .catch((error) => {
                  console.log(error);
              })
        }
        
      render() {
          return (
            <View style={styles.container1}>
                  <FlatList
                    data={this.state.requestList}
                    renderItem={({item}) => (
                        <View>
                          
                          <Text>{item.first_name} {item.last_name}</Text>
                          <Button
                    title="Accept"
                    onPress={() => this.acceptRequest(item.user_id)}
                />
                <Button
                    title="Deny"
                    onPress={() => this.rejectRequest(item.user_id)}
                />
                        </View>
                    )}
                    keyExtractor={(item,index) => item.user_id.toString()}
                  />
                  <FlatList
                    data={this.state.friendList}
                    renderItem={({item}) => (
                        <View>
                          
                          <Text>{item.user_givenname} {item.user_familyname}</Text>
                          
                        </View>   
                    )}
                    keyExtractor={(item,index) => item.user_id.toString()}
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
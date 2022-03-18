import { StyleSheet } from 'react-native';

export default StyleSheet.create(
  {
    container1:
      {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#91f2f2',
        paddingBottom: 50,
      },
    logo:
      {
        width: 200,
        height: 200,
      },
    camera:
    {
      flex: 1,
    },
    post:
    {
      flex: 1,
      flexWrap: 'wrap',
      alignItems: 'center',
      borderWidth: 2,
      padding: 5,
      justifyContent: 'space-evenly',
      margin: 5,
      backgroundColor: 'white',
    },
    friends:
    {
      flex: 1,
      flexWrap: 'wrap',
      alignItems: 'center',
      borderWidth: 2,
      padding: 5,
      justifyContent: 'space-evenly',
      margin: 5,
      backgroundColor: 'white',
    },
  },
);

import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SettingsScreen() {

  // const get = async () => {
  //   try{
  //     const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  //     const json = await response.json();
  //     console.log('json', json);

  //     const data = await fetch('http://192.168.111.151:5000/api/users/me')
  //     const jsonData = await data.json()
  //     console.log('jsonData', jsonData)
  //   }
  //   catch(err){
  //     console.log('error', err)
  //   }}

  //   useEffect(() => {
  //     get()
  //   }
  // , [])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Screen</Text>
      <Text style={styles.description}>
        This is the settings page accessible from the drawer
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
});
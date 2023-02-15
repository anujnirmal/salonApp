import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import Authentication from './components/Authentication/Authentication';

function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    console.log("User is" + user);
    return (
      <View>
        <Authentication />
      </View>
    );
  }

  const handleLogOut = () => {

    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  }

  return (
    <View>
      <Text>Welcome {user.email}</Text>
      <Button onPress={handleLogOut} title='Sign Out' />
    </View>
  );
}

export default App;
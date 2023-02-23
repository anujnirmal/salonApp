import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import Authentication from './src/components/Authentication/Authentication';
import Dashboard from './src/screens/dashboard/Dashboard';

function App() {
  // Set an initializing state whilst Firebase connects
  const [visible, setVisible] = useState(false);
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

  return (
    <Dashboard user={user}/>
  );
}

export default App;
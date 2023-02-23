import React from 'react'
import { View, Text, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import SelectRole from '../selectRole/SelectRole';
import UserDashboard from './UserDashBoard';

const Dashboard = ({ user }) => {

  const [userData, setUserData] = React.useState({});
  const [userType, setUserType] = React.useState(null);

  React.useEffect(() => {
    getUserDetail();
  }, [])

  const getUserDetail = async () => {
    try {
      await firestore()
        .collection('Users').where('emailId', '==', user.email).get()
        .then(async (userData) => {

          let tempUserData = userData.docs[0]._data;
          let docId = userData.docs[0].id;
          setUserData((prevValue) => {
            return {
              googleUserData: user,
              user: tempUserData,
              docId: docId,
            }
          })
          setUserType(tempUserData.role)
        })

    } catch (error) {
      console.log(error);
    }
  }

  console.log(userData)



  return (
    <>
    {
      userType !== null && 
      <>
      {userType === "" && <SelectRole userData={userData} setUserType={setUserType} />}
      {userType === "USER" &&
        <>
          <UserDashboard userData={userData}/>
        </>
      }

      {userType === "SHOPOWNER" &&
        <>
          <View>
            <Text>Welcome shop owner {user.email}</Text>
            <Button onPress={handleLogOut} title='Sign Out' />
          </View>
        </>
      }
      </>
      }
    </>
  )

}

export default Dashboard
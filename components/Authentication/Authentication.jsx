import React from 'react'
import { SafeAreaView, ActivityIndicator, Button, Image, TouchableOpacity, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Logo from "../../assets/logo/logo2.png";
import tw from 'twrnc';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


const EMAILREGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

const Authentication = () => {
    const [loginForm, setLoginForm] = React.useState({
        userName: "",
        emailId: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = React.useState(false);

    const [loginPage, setLoginpage] = React.useState(true);

    const [number, onChangeNumber] = React.useState('');

    const handleFormChange = (e, fieldName) => {
        console.log(e);
        setLoginForm((prevValue) => {
            return {
                ...prevValue,
                [fieldName]: e,
            }
        })
    }

    const validateInputs = () => {
        if (EMAILREGEX.test(loginForm.emailId) !== true) {
            Alert.alert("Error", "Please enter correct email id");
            return "error";
        } else if (loginForm?.password?.length < 6) {
            Alert.alert("Error", "Password should be greater then 6 characters",);
            return "error";
        } else if (loginPage === false && loginForm.password !== loginForm.confirmPassword) {
            Alert.alert("Error", "Confirm password should be same as password");
            return "error";
        } else if (loginPage === false && loginForm.userName.length < 3) {
            Alert.alert("Error", "Username should be greater then 3 character");
        }
        return "success";
    }

    const handleAuthentication = async () => {
        setLoading(true);
        if (validateInputs() === "error") {
            setLoading(false)
            return;
        }

        try {
            if (loginPage) {
                let salonUser = await auth().signInWithEmailAndPassword(loginForm.emailId.toLowerCase(), loginForm.password);
                setLoading(false);
                return;
            } else {
                let salonUser = await auth().createUserWithEmailAndPassword(loginForm.emailId.toLowerCase(), loginForm.password);

                firestore()
                    .collection('Users')
                    .add({
                        emailId: salonUser.user.email,
                        userName: loginForm.userName,
                    })
                    .then(() => {
                        console.log('User added!');
                    });
                    setLoading(false);
                    return;
            }
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                // console.log('That email address is already in use!');
            }

            if (error.code === 'auth/invalid-email') {
                Alert.alert("Error", "Invalid Email")
                // console.log('That email address is invalid!');
            }
            if (error.code === 'auth/user-not-found') {
                Alert.alert("Error", "Email Id or password Incorrect")
            }

            Alert.alert("Error", "Wrong email or password")
            setLoading(false);
            return;
        }

    }

    const changeScreen = () => {
        setLoginpage(!loginPage);
    }

    return (
        <SafeAreaView>
            <View>

                <Text style={tw`text-center text-[14]`}>{loginPage ? "Login" : "Sign Up"}</Text>
                {loginPage ? null :
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => handleFormChange(e, "userName")}
                        value={loginForm.userName}
                        placeholder="username"
                    />
                }
                <TextInput
                    style={styles.input}
                    onChangeText={(e) => handleFormChange(e, "emailId")}
                    value={loginForm.emailId}
                    placeholder="email id"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(e) => handleFormChange(e, "password")}
                    value={loginForm.password}
                    placeholder="password"
                    type={"password"}
                    secureTextEntry={true}
                />
                {loginPage ? null :
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => handleFormChange(e, "confirmPassword")}
                        value={loginForm.confirmPassword}
                        placeholder="confirm password"
                        type={"password"}
                        secureTextEntry={true}
                    />
                }
            </View>

            <View >
                {/* <Button
                    onPress={handleAuthentication}
                    title={loginPage ? "Login" : "SignUp"}
                    style={tw`bg-current`}
                    disabled={loading ? true : false}
                /> */}
 <TouchableOpacity onPress={handleAuthentication}>
        <View
          style={{
            ...styles.button,
            backgroundColor: loading ? "#4caf50" : "#8bc34a",
          }}
        >
          {loading && <ActivityIndicator size="large" color="yellow" />}
          <Text style={styles.buttonText}>
            {loginPage ? "Login" : "Sign Up"}
          </Text>
        </View>
      </TouchableOpacity>
            </View>
            <View style={tw`mt-3`}>
                <Text
                    onPress={changeScreen}
                    style={tw`text-center text-[4] text-gray-400`}
                    disabled={loading ? true : false}
                >
                    {loginPage ? "Sign Up" : "Login"}
                </Text>
            </View>
            <View style={styles.container}>
     
    </View>
        </SafeAreaView>
    )
}



const styles = StyleSheet.create({
    input: {
        height: 40,
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 5,
        padding: 10,
        width: '100%',
    },
    button: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#666",
        borderRadius: 10,
      },
      buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 20
      },
});

export default Authentication
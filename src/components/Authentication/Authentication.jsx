import React from 'react'
import { SafeAreaView, AsyncStorage, ActivityIndicator, Button, Image, TouchableOpacity, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
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
        phoneNumber: "",
    });

    const [loading, setLoading] = React.useState(false);

    const [loginPage, setLoginpage] = React.useState(true);

    const handleFormChange = (e, fieldName) => {
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

                setLoading(false);
                return;
            } else {
                let salonUser = await auth().createUserWithEmailAndPassword(loginForm.emailId.toLowerCase(), loginForm.password);

                firestore()
                    .collection('Users')
                    .add({
                        emailId: salonUser.user.email,
                        userName: loginForm.userName,
                        role: "",
                    })
                    .then(() => {
                        console.log('User added!');
                    });
                setLoading(false);
                return;
            }
        } catch (error) {
            console.log(error);
            if (error.code === 'auth/email-already-in-use') {
                // console.log('That email address is already in use!');
                Alert.alert("Error", "You have already registered please login")
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

            <Image
                style={styles.ImgLogo}
                source={require('../../assets/logo/logo.png')}
            />

            <Text style={tw`text-center text-[12]`}>{loginPage ? "Login" : "Sign Up"}</Text>
            <View style={tw`mt-10 `}>

                {loginPage ? null :
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.inputText}
                            onChangeText={(e) => handleFormChange(e, "userName")}
                            value={loginForm.userName}
                            placeholder="username"
                        />
                    </View>
                }
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        onChangeText={(e) => handleFormChange(e, "emailId")}
                        value={loginForm.emailId}
                        placeholder="email id"
                    />
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        onChangeText={(e) => handleFormChange(e, "password")}
                        value={loginForm.password}
                        placeholder="password"
                        type={"password"}
                        secureTextEntry={true}
                    />
                </View>
                {loginPage ? null :
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.inputText}
                            onChangeText={(e) => handleFormChange(e, "confirmPassword")}
                            value={loginForm.confirmPassword}
                            placeholder="confirm password"
                            type={"password"}
                            secureTextEntry={true}
                        />
                    </View>
                }
                {loginPage ? null :
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.inputText}
                            onChangeText={(e) => handleFormChange(e, "phoneNumber")}
                            value={loginForm.phoneNumber}
                            placeholder="phone no."
                            type={"phone"}
                        />
                    </View>
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
                    {loginPage ? "Dont't have an account? Sign Up" : "Already have an account? Login"}
                </Text>
            </View>
        </SafeAreaView>
    )
}



const styles = StyleSheet.create({
    button: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: "80%",
        alignSelf: 'center',
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

    inputView: {
        width: '80%',

        borderRadius: 10,
        height: 45,
        marginBottom: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        padding: 20,
        borderBottomWidth: 1, // width of the border
        borderColor: '#000000',
    },
    inputText: {
        height: 50,
        color: 'black',
    },
    loginBtn: {
        width: '80%',
        backgroundColor: '#fb5b5a',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 10,
    },
    loginText: {
        color: 'white',
        
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ImgLogo: {
        width: -50,
        height: 200,
    },
});

export default Authentication
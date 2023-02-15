import React from 'react'
import { SafeAreaView, Button, Image, TouchableOpacity, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Logo from "../../assets/logo/logo2.png";
import tw from 'twrnc';
import auth from '@react-native-firebase/auth';

const EMAILREGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

const Authentication = () => {
    const [loginForm, setLoginForm] = React.useState({
        emailId: "",
        password: "",
        confirmPassword: "",
    });

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
        if (EMAILREGEX.test(loginForm.emailId) !== true){
            Alert.alert("Error", "Please enter correct email id");
            return "error";
        }else if (loginForm?.password?.length < 6) {
            Alert.alert("Error", "Password should be greater then 6 characters",);
            return "error";
        }else if (loginPage === false && loginForm.password !== loginForm.confirmPassword ){
            Alert.alert("Error", "Confirm password should be same as password");
            return "error";
        }
        return "success";
    }

    const handleAuthentication = async () => {

        if(validateInputs() === "error"){
            return;
        }

        try {
            if (loginPage) {
                let salonUser = await auth().signInWithEmailAndPassword(loginForm.emailId.toLowerCase(), loginForm.password);
            } else {
                let salonUser = await auth().createUserWithEmailAndPassword(loginForm.emailId.toLowerCase(), loginForm.password);
            }
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
            }

            if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
            }
            if(error.code === 'auth/user-not-found'){
                Alert.alert("Error", "Email Id or password Incorrect")
            }
            console.error(error);
        }

    }

    const changeScreen = () => {
        setLoginpage(!loginPage);
    }

    return (
        <SafeAreaView>
            <View>

                <Text style={tw`text-center text-[14]`}>Login</Text>
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
                        placeholder="password"
                        type={"password"}
                        secureTextEntry={true}
                    />
                }
            </View>

            <View >
                <Button
                    onPress={handleAuthentication}
                    title={loginPage ? "Login" : "SignUp"}
                    style={tw`bg-current`}
                />

            </View>
            <View style={tw`mt-3`}>
                <Text
                    onPress={changeScreen}
                    style={tw`text-center text-[4] text-gray-400`}
                >
                    {loginPage ? "Sign Up" : "Login"}
                </Text>
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
});

export default Authentication
import React from 'react'
import { SafeAreaView, AsyncStorage, ActivityIndicator, Button, Image, TouchableOpacity, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import tw from 'twrnc';
import firestore from '@react-native-firebase/firestore';

const SelectRole = ({userData, setUserType}) => {
    const [loading, setLoading] = React.useState({
        buttonOne: false,
        buttonTwo: false,
    });

    const setUserRole = async (role) => {

        try {

           if(role === "USER"){
            setLoading({
                buttonOne: false,
                buttonTwo: true
            })
           }else {
            setLoading({
                buttonOne: true,
                buttonTwo: false
            })
           }
           console.log("Userdata" + userData);
            await firestore()
                .collection('Users').doc(userData.docId)
                .update({
                    role: role
                })
                .then(() => {
                    console.log('User added!');
                    Alert.alert("Success", "Role Updated");
                })

                setUserType(role);
                setLoading({
                    buttonOne: false,
                    buttonTwo: false
                })

        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Error Updating role")
            setLoading({
                buttonOne: false,
                buttonTwo: false
            })
        }

    }

    return (
        <SafeAreaView>
            <View>

                <Text style={tw`text-center text-[14]`}>Register as...</Text>

                <TouchableOpacity onPress={() => setUserRole("SHOPOWNER")}>
                    <View
                        style={{
                            ...styles.buttonOne,
                            backgroundColor: loading.buttonOne ? "#4caf50" : "#8bc34a",
                        }}
                    >
                        {loading.buttonOne && <ActivityIndicator size="large" color="yellow" />}
                        <Text style={styles.buttonText}>
                            SHOP OWNER
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setUserRole("USER")} style={tw`mt-2`}>
                    <View
                        style={{
                            ...styles.buttonTwo,
                            backgroundColor: loading.buttonTwo ? "#4caf50" : "#8bc34a",
                        }}
                    >
                        {loading.buttonTwo && <ActivityIndicator size="large" color="yellow" />}
                        <Text style={styles.buttonText}>
                            USER
                        </Text>
                    </View>
                </TouchableOpacity>
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
    buttonOne: {
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
    buttonTwo: {
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

export default SelectRole
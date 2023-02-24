import React from "react";
import { Text, View, Button, TextInput, StyleSheet, Alert } from "react-native";
import tw from "twrnc";
import firestore from "@react-native-firebase/firestore";

const AddService = ({ userData }) => {
  const [formData, setFormData] = React.useState({
    serviceName: "",
    price: null,
    id: null,
  });
  const handleAddService = async () => {
    if (formData.id === null) {
      return Alert.alert("Error", "Please enter valid id");
    }

    if (formData.serviceName === "") {
      return Alert.alert("Error", "Please enter service name");
    }

    if (formData.price === "") {
      return Alert.alert("Error", "Please enter price");
    }

    console.log(userData.docId);

    firestore()
      .collection("Users")
      .doc(userData.docId)
      .update({
        services: firestore.FieldValue.arrayUnion({
          id: parseInt(formData.id),
          name: formData.serviceName,
          price: parseInt(formData.price),
        }),
      })
      .then(() => {
        console.log("User added!");
        Alert.alert("Success", "Role Updated");
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("Error", "Some Error");
      });
  };

  const handleFormChange = (e, fieldName) => {
    setFormData((prevValue) => {
      return {
        ...prevValue,
        [fieldName]: e,
      };
    });
  };

  return (
    <>
      <View style={tw`w-full h-full`}>
        <View>
          <Text style={tw`mt-25 text-center text-[5]`}>
            Please Add Services
          </Text>
        </View>
        <View>
          <TextInput
            style={styles.input}
            onChangeText={(e) => handleFormChange(e, "id")}
            value={formData.id}
            placeholder="Id"
          />
          <TextInput
            style={styles.input}
            onChangeText={(e) => handleFormChange(e, "serviceName")}
            value={formData.serviceName}
            placeholder="Service Name"
          />
          <TextInput
            style={styles.input}
            onChangeText={(e) => handleFormChange(e, "price")}
            value={formData.price}
            placeholder="Price"
          />
        </View>
        <View style={tw`absolute bottom-0 w-full z-50`}>
          <Button onPress={() => handleAddService()} title="Add" />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 5,
    padding: 10,
    width: "100%",
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
    fontSize: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#bbded6",
  },
  selectButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: "#8ac6d1",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: "#ffb6b9",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  Container: {
    marginTop: 30,
    marginBottom: 50,
    alignItems: "center",
  },
  progressBarContainer: {
    marginTop: 20,
  },
  imageBox: {
    width: 300,
    height: 300,
  },
});

export default AddService;

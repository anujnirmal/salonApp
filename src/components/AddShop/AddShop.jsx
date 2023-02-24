import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import tw from "twrnc";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import firestore from "@react-native-firebase/firestore";
import * as ImagePicker from "react-native-image-picker";
import storage from "@react-native-firebase/storage";
import * as Progress from "react-native-progress";

const AddShop = ({ userData, setAddShop }) => {
  const [shopDetails, setShopDetails] = React.useState({
    shopName: "",
    address: "",
    latitude: "",
    longitude: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [addMap, setAddMap] = useState(false);
  const drawer = useRef(null);
  const [drawerPosition, setDrawerPosition] = useState("left");
  const [markers, setMarkers] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [bookService, setBookService] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [position, setPosition] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  useEffect(() => {
    Geolocation.getCurrentPosition((info) => {
      console.log(info);
      const crd = info.coords;
      setPosition({
        latitude: crd.latitude,
        longitude: crd.longitude,
        latitudeDelta: 0.0421,
        longitudeDelta: 0.0421,
      });
    });
  }, []);

  const handleLocationClick = (coordinates) => {
    setMarkers(coordinates);
  };

  const handleConfirmButton = async () => {
    console.log("Hello");
    if (markers === null) {
      return Alert.alert("Error", "Please tap on the map to select the map");
    }

    setAddMap(false);
  };

  // const handleShopToDb = async () => {
   

  //   await uploadImage();
  //   // updated in db
    
  // };

  const selectImage = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        console.log(response);
        const source = { uri: response.assets[0].uri };
        console.log("SOurce is " + JSON.stringify(source));
        setImage(source);
      }
    });
  };

  const handleFormChange = (e, fieldName) => {
    setShopDetails((prevValue) => {
      return {
        ...prevValue,
        [fieldName]: e,
      };
    });
  };

  const handleShopToDb = async () => {
    try {
      //   console.log("Images is " + JSON.stringify(image.uri))
      const { uri } = image;
      const filename = uri.substring(uri.lastIndexOf("/") + 1);
      const uploadUri =
        Platform.OS === "ios" ? uri.replace("file://", "") : uri;
      setUploading(true);
      setTransferred(0);
      const task = storage().ref(filename).putFile(uploadUri);
      // set progress state
      task.on("state_changed", (snapshot) => {
        setTransferred(
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
        );
      });

      await task.then((e) => {
        storage()
          .ref(e?.metadata?.fullPath)
          .getDownloadURL()
          .then((url) => {
            // Do something with the URL ...
            console.log("url " + url);
            if (shopDetails.shopName === "") {
              return Alert.alert("Error", "Please add shop name");
            }
        
            if (shopDetails.address === "") {
              return Alert.alert("Error", "Please add address");
            }

            firestore()
      .collection("Users")
      .doc(userData.docId)
      .update({
        shops: [
          {
            description: shopDetails.address,
            latitude: markers.latitude,
            longitude: markers.longitude,
            shopName: shopDetails.shopName,
            imageUrl: url,
          },
        ],
      })
      .then(() => {
        console.log("User added!");
        Alert.alert("Success", "Role Updated");
        setAddShop(false);
      });
          });
      });
    } catch (e) {
      console.log("Erors" + e);
    }
    setUploading(false);
    Alert.alert(
      "Photo uploaded!",
      "Your photo has been uploaded to Firebase Cloud Storage!"
    );
    setImage(null);
  };

  return (
    <>
    {console.log(imageUrl)}
      {!addMap ? (
        <View style={tw`mt-30 w-full h-full`}>
          <Text style={tw`text-center text-[5]`}>Add Shop Details</Text>
          <TextInput
            style={styles.input}
            onChangeText={(e) => handleFormChange(e, "shopName")}
            value={shopDetails.shopName}
            placeholder="Shop Name"
          />
          <TextInput
            style={styles.input}
            onChangeText={(e) => handleFormChange(e, "address")}
            value={shopDetails.address}
            placeholder="Address"
          />
          <View style={tw`w-30`}>
            <Button
              onPress={() => setAddMap(true)}
              title={markers ? "Change Shop location" : "Add Shop Location"}
            />
          </View>
          <View>
          {uploading && (
                <View style={styles.progressBarContainer}>
                  <Progress.Bar progress={transferred} width={300} />
                </View>
              ) }
          </View>
          <View style={tw`mt-20 w-full`}>
            <Button onPress={() => handleShopToDb()} title="Add Shop to map" />
          </View>
          <View>
            <TouchableOpacity style={styles.selectButton} onPress={selectImage}>
              <Text style={styles.buttonText}>Pick an image</Text>
            </TouchableOpacity>
            <View style={styles.imageContainer}>
              
            </View>
          </View>
        </View>
      ) : (
        <View style={tw`w-full`}>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={{ width: "100%", height: "100%" }}
            initialRegion={position}
            followsUserLocation={true}
            // region={position}
            minZoomLevel={14}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={true}
            scrollEnabled={true}
            zoomEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}
            onPress={(e) => {
              handleLocationClick(e.nativeEvent.coordinate);
            }}
          >
            <View>
              {markers && (
                <Marker
                  coordinate={{
                    latitude: markers?.latitude,
                    longitude: markers?.longitude,
                  }}
                  title={"My Shop"}
                />
              )}
            </View>
          </MapView>
          <View style={tw`absolute bottom-0 w-full z-50`}>
            <Button onPress={() => handleConfirmButton()} title="Confirm" />
          </View>
        </View>
      )}
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

export default AddShop;

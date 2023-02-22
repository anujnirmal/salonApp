import React, { useRef, useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation';
import firestore from '@react-native-firebase/firestore';
import tw from 'twrnc';
import {
    Button,
    DrawerLayoutAndroid,
    Text,
    StyleSheet,
    Pressable,
    View,
    Alert,
    Modal,
    Image
}
    from 'react-native';
//import Scissor from "../../assets/scissor.png";
import BookService from '../BookService/BookService';

const UserDashboard = ({ userData }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const drawer = useRef(null);
    const [drawerPosition, setDrawerPosition] = useState('left');
    const [markers, setMarkers] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);
    const [bookService, setBookService] = useState(false);
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
            })
        });

        getShopsNearMe();
    }, []);


    const handleShopSelect = (marker) => {
        console.log(marker);
        setSelectedShop(marker);
        setModalVisible(true);
    }

    const getShopsNearMe = async () => {
        try {
            await firestore()
                .collection('Users').where('role', '==', "SHOPOWNER").get()
                .then(async (userData) => {

                    for (let i = 0; i < userData?.docs.length; i++) {

                        let shopOwners = {
                            shopOwnerId: userData?.docs[i].id,
                            ...userData.docs[i]._data,
                        }

                        setMarkers(oldArray => [...oldArray, shopOwners])

                    }

                })

        } catch (error) {
            console.log(error);
        }
    }

    const handleLogOut = () => {
        auth()
            .signOut()
            .then(() => console.log('User signed out!'));
    }

    const handleBookServiceClick = () => {
        setModalVisible(false);
        setBookService(true);
    }
    
    const navigationView = () => (
        <View style={[styles.container, styles.navigationContainer]}>
            {/* Add Image */}
            <View style={tw`mb-10`}>
                <FontAwesomeIcon name="user-circle" size={100} />
                <Text style={tw`text-center mt-2`}>{userData?.user?.userName}</Text>
                <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        marginTop: 20
                    }}
                />

            </View>
            <View style={tw`w-60`}>
                <View style={tw`mb-4`}>
                    <Pressable style={styles.button} onPress={()=>{
                        console.log("hiiiiiiiiii")
                    }} >
                        <Text style={styles.text}>Profile</Text>
                    </Pressable>
                </View>
                <View style={tw`mb-4`}>
                    <Pressable style={styles.button} >
                        <Text style={styles.text}>Appointments</Text>
                    </Pressable>
                </View>

                <View style={tw`mb-4`}>
                    <Pressable style={styles.button} >
                        <Text style={styles.text}>About Us</Text>
                    </Pressable>
                </View>
                <View style={tw`mb-4`}>
                    <Pressable style={styles.button} onPress={handleLogOut} >
                        <Text style={styles.text}>Sign Out</Text>
                    </Pressable>
                </View>

            </View>

        </View>
    );



    return (
        <DrawerLayoutAndroid
            ref={drawer}
            drawerWidth={300}
            drawerPosition={drawerPosition}
            renderNavigationView={navigationView}>
                 <View >

{selectedShop !== null && <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}
                    on
                    >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Pressable style={tw`absolute top-3 right-3`} onPress={() => setModalVisible(false)} >
                                <Text style={tw`text-[5] `}>X</Text>
                            </Pressable>
                            <Image source={{uri: selectedShop?.shops[0].imageUrl}} style={tw`w-40 h-40`}/>
                            <Text style={tw`text-[8]`}>{selectedShop?.shops[0].shopName}</Text>
                            <Text style={styles.modalText}>{selectedShop?.shops[0].description}</Text>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => handleBookServiceClick()}>
                                <Text style={styles.textStyle}>Book Services</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
}
            </View>
            {bookService ?
                <View>
                    <View style={tw`absolute top-0 left-0 w-full`}>
                        <View style={tw`bg-sky-500 w-full`}>
                            <View style={tw`bg-slate-300 m-3 w-15 flex justify-center items-center rounded-full p-4`}>
                                <Pressable onPress={() => drawer.current.openDrawer()}>
                                    <FontAwesomeIcon name="bars" size={25} />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    <BookService selectedShop={selectedShop}/>
                </View>
                :
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

                    >
                        {markers.map((marker, index) => {
                            return <View key={index}>
                                {marker?.shops?.map((shop, index) => {
                                    return <Marker
                                        coordinate={{ latitude: shop.latitude, longitude: shop.longitude }}
                                        title={shop.shopName}
                                        description={shop.description}
                                        key={index}
                                        onPress={() => handleShopSelect(marker)}
                                    />
                                })}
                            </View>


                        })}

                    </MapView>
                    <View style={tw`absolute top-0 left-0`}>
                        <View style={tw`bg-slate-300 m-3 rounded-full p-4`}>
                            <Pressable onPress={() => drawer.current.openDrawer()}>
                                <FontAwesomeIcon name="bars" size={25} />
                            </Pressable>
                        </View>
                    </View>
                </View>
            }
        </DrawerLayoutAndroid>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
    },
    navigationContainer: {
        backgroundColor: '#ecf0f1',
        height: 100
    },
    paragraph: {
        padding: 16,
        fontSize: 15,
        textAlign: 'center',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        // borderRadius: 4,
        // elevation: 3,
        // backgroundColor: 'black',
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'black',
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
      buttonOpen: {
        backgroundColor: '#F194FF',
      },
      buttonClose: {
        backgroundColor: '#2196F3',
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
      },
});

export default UserDashboard
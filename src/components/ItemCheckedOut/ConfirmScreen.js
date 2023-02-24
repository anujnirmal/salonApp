import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from "react-native";
import React from "react";
import tw from "twrnc";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import Success from "../global/Success";

const ConfirmScreen = ({ date, itemsList, selectedShop, userData, closeBookService, price, time }) => {
  const [booked, setBooked] = React.useState(false);
  
  const bookService = async () => {
    try {
      firestore()
      .collection("Bookings")
      .add({
        shopOwnerId: selectedShop.shopOwnerId,
        userId: userData.docId,
        clientName: userData?.user?.userName,
        emailId: userData?.user?.emailId,
        services: itemsList,
        price: price,
        time: time,
        date: date
      })
      .then(() => {
        console.log("User added!");
        setBooked(true);
      });
  }catch(err) {
      console.log(err) 
      Alert.alert("Error", "There was some error");
    }
  }
   

  return (
    <>
    {booked &&  
      <View style={tw`w-full h-full absolute`}>
      <Success closeBookService={closeBookService} />
    </View>
  }
  
      <View style={tw`w-full h-full`}>
        <Text style={tw`text-center mt-8 text-lg text-white`}>
          {console.log(userData)}
          Confirm Appointment
        </Text>
        <Text style={tw`mt-10 pl-2 text-[5]`}>Total Price: {price}</Text>
        <Text style={tw`mt-1 pl-2 text-[5]`}>Time Selected {time}</Text>
        <Text style={tw`mt-1 pl-2 text-[5]`}>Time Selected {date}</Text>
        <Text style={tw`text-center mt-15 pl-2 text-[5] font-bold`}>
          Please check your selected service
        </Text>
        <ScrollView style={tw`mt-4 mb-16`}>
          {itemsList?.map((item, index) => {
            {
              console.log(item);
            }
            return (
              <View style={styles.modalView} key={index}>
                <View style={tw`flex-row`}>
                  <View style={{ flex: 5 }}>
                    <Text style={tw`text-[6 ]`}>{item.name}</Text>
                    <Text>Price: Rs. {item?.price}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <View
          style={tw`absolute bottom-0 w-full h-15 flex items-center justify-center bg-sky-500`}
        >
          <Pressable
            onPress={() => {
              bookService();
            }}
          >
            <Text style={tw`text-white text-[5]`}>Book</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  modalView: {
    margin: 10,
    backgroundColor: "#edf2f2",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ConfirmScreen;

import React, { useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import firestore from "@react-native-firebase/firestore";
import tw from 'twrnc';

const Appointments = ({ userData }) => {
  const [allBookingData, setAllBookinData] = React.useState(null);
  const [allClientNames, setAllClientNames] = React.useState({});
  useEffect(() => {
    getAllAppointments();
  }, []);

  const getAllAppointments = async () => {
    try {
      await firestore()
        .collection("Bookings")
        .where("shopOwnerId", "==", userData.docId)
        .get()
        .then(async (bookinData) => {
            console.log(bookinData.docs);
          setAllBookinData(bookinData.docs);
       
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View>
      <ScrollView style={tw`mt-25 mb-16`}>
        {allBookingData?.map((service, index) => {
          return (
            <View style={styles.modalView} key={index}>
              <View style={tw`flex-row`}>
                <View style={{ flex: 5 }}>
                <Text>
                    Client Name: {service?._data?.clientName}
                  </Text>
                  <Text>
                    Email Id: {service?._data?.emailId}
                  </Text>
                  <Text>
                    Date: {service?._data?.date}
                  </Text>
                  <Text >
                    Time: {service?._data?.time}
                  </Text>
                  <Text >
                    Price: {service?._data?.price}
                  </Text>

                  <Text style={tw`text-center text-[4]`}>
                   Selected Services
                  </Text>

                  {service?._data?.services?.map((name, index) => {
                    
                    return (
                    <View>
                        <Text>{name.name}</Text>
                    </View>   
        )})}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
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

export default Appointments;

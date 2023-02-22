import React, { useEffect, useState } from 'react'
import { View, Text, Pressable, StyleSheet, ScrollView, Button, Alert } from 'react-native'
import tw from 'twrnc';
import CheckBox from '@react-native-community/checkbox';
import ItemCheckout from '../../components/ItemCheckedOut/ItemCheckout';

const BookService = ({ selectedShop }) => {
    const [selectedItem, setSelectedItem] = useState([])
    const [checkBox, setCheckBox] = useState({})
    const [price, setPrice] = useState(null);
    const [itemCheckOut, setItemCheckOut] = useState(false);

    useEffect(() => {
        for (let i = 0; i < selectedShop?.services?.length; i++) {
            let id = selectedShop.services[i].id;
            setCheckBox((prevValue) => {
                return {
                    ...prevValue,
                    [id]: false
                }
            })
        }

    }, [])

    const handleItemSelect = (service) => {

        let found = false;

    
        for (let i = 0; i < checkBox.length; i++) {
            if (selectedItem?.[i]?.[service.id] === true) {
                console.log("Inside");
                found = true;
                return;
            }
        }

        if (found === true) {
            return;
        }

        let itemFound = 0;
        // console.log("Temp" + JSON.stringify(tempSelectedItems))

        setCheckBox((prevValue) => {
            let id = service.id;
            return {
                ...prevValue,
                [id]: !checkBox[id],
            }
        })

        // find the index of the selected item
        // -1 = not found, any number apart from this means found and the number is the index in the array
        const indexOfShopItem = selectedItem.findIndex(item => item?.id === service?.id);
        if(indexOfShopItem < 0){
            setSelectedItem((prevValue) => {
                return [...prevValue, service]
            })
        }else {
            console.log("deleting" + indexOfShopItem)
            // create a copy of the selected item
            const tempShopItemList = [...selectedItem];
            // deleting the found item on deselect
            tempShopItemList.splice(indexOfShopItem, 1);
            setSelectedItem(tempShopItemList);

        }

        // Calculate price
        let totalPrice = 0;
        if(indexOfShopItem >= 0){
            totalPrice = price - service.price;
        }else {
            if(selectedItem.length === 0){
               totalPrice = price + service.price;
            }else {
                for (let i = 0; i < selectedItem.length; i++) {
                    totalPrice += selectedItem[i].price;
                    console.log("price" + totalPrice)
                }
                totalPrice = service?.price + totalPrice; 
            }
        }
        setPrice(totalPrice);
    }

    return (
        <>
         {console.log("HHEHEHEH" + JSON.stringify(selectedItem))}
            {itemCheckOut ?
                <ItemCheckout itemsList={selectedItem} />
                :
                <View style={tw`w-full h-full`}>
                    <View>
                        <Text style={tw`text-center mt-8 text-lg text-white`}>Choose service</Text>
                    </View>
                    <View style={tw`absolute bottom-0 w-full h-15 flex items-center justify-center bg-sky-500`}>
                        <Pressable onPress={() => {
                            if(selectedItem.length === 0){
                                Alert.alert("Please select atleast one service");
                                return
                            }
                            setItemCheckOut(true)

                        }}><Text style={tw`text-white text-[5]`}>Checkout {selectedItem.length} items, Total: Rs. {price}</Text></Pressable>
                    </View>
                    <ScrollView style={tw`mt-5 mb-16`}>

                        {selectedShop?.services?.map((service, index) => {
                            return <View style={styles.modalView} key={index}>
                                <View style={tw`flex-row`}>

                                    <View style={{ flex: 1 }}>
                                        {checkBox !== null &&
                                            <CheckBox
                                                disabled={false}
                                                value={checkBox[service.id]}
                                                onValueChange={() => handleItemSelect(service)}
                                            />
                                        }
                                    </View>
                                    <View style={{ flex: 5 }}>
                                        <Text style={tw`text-[6 ]`} onPress={() => handleItemSelect(service)}>{service.name}</Text>
                                        <Text onPress={() => handleItemSelect(service)}>Price: Rs. {service?.price}</Text>
                                    </View>
                                </View>
                            </View>
                        })}

                    </ScrollView>

                </View>
            }
        </>


    )
}



const styles = StyleSheet.create({
    modalView: {
        margin: 10,
        backgroundColor: '#edf2f2',
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

});


export default BookService
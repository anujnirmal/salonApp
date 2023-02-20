import React, {useEffect, useState} from 'react'
import { View, Text, Pressable, StyleSheet, ScrollView, Button } from 'react-native'
import tw from 'twrnc';
import CheckBox from '@react-native-community/checkbox';
import ItemCheckout from '../../components/ItemCheckedOut/ItemCheckout';

const BookService = ({selectedShop}) => {
    const [selectedItem, setSelectedItem] = useState([])
    const [checkBox, setCheckBox] = useState()
    const [price, setPrice] = useState(0);
    const [itemCheckOut, setItemCheckOut] = useState(false);

    useEffect(() => {
        for (let i = 0; i < selectedShop?.services?.length; i++) {
            setCheckBox((prevValue) => {
                return {
                    [selectedShop.services[i].id]: false
                }
            })
        }

    }, [])
 
    const handleItemSelect = (service) => {

        let found = false;

        console.log(checkBox)

        for (let i = 0; i < checkBox.length; i++) {           
            if(selectedItem[i][service.id] === true){
                        console.log("Inside");
                        found = true;
                        return;
            }
        }

        console.log(found)

        if(found === true) {
            return;
        }
      
        let itemFound = 0;
        // console.log("Temp" + JSON.stringify(tempSelectedItems))
        
        // The the dublicate id 
        // for (let i = 0; i < selectedItem.length; i++) {
        //     if(service.id === selectedItem[i].id){
        //         itemFound = i;
        //         return;
        //     }  
        // }

        // Make the selected Item blank
        // setSelectedItem([])

        // tempSelectedItems.forEach((item, index)=> {
        //     if(index !== itemFound){
        //         setSelectedItem((prevValue) => {
        //             return [...prevValue, item]
        //         })
        //     }
        // });

        setSelectedItem((prevValue) => {
            return [...prevValue, service]
        })

        

        setCheckBox((prevValue) => {
            return {
                ...prevValue,
                [service.id]: true,
            }
        })

        // !checkBox[service.id]
        
        // Add price
        setPrice(price + service.price);

        console.log("Selected Item " + JSON.stringify(selectedItem))
    }

  return (
   <>
   {itemCheckOut ?
   <ItemCheckout itemsList={selectedItem} price={price}/>
:


    <View style={tw`w-full h-full`}>
        <View>
            <Text style={tw`text-center mt-8 text-lg text-white`}>Choose service</Text>
        </View>
        <View style={tw`absolute bottom-0 w-full h-15 flex items-center justify-center bg-sky-500`}>
            <Pressable onPress={() => {
                console.log("HHEHEH " + selectedItem);                
                setItemCheckOut(true)

   }}><Text style={tw`text-white text-[4]`}>Checkout items
            </Text></Pressable>
        </View>
        <ScrollView style={tw`mt-5 mb-16`}>
           
           {selectedShop?.services?.map((service, index) => {
            return <View style={styles.modalView} key={index}>
                <View style={tw`flex-row`}>
                    
                    <View style={{flex:1}}>
                        {checkBox &&
                            <CheckBox
                                    disabled={false}
                                    value={checkBox[service.id]}
                                    onValueChange={() => handleItemSelect(service)}
                            />
                        }
                    </View>
                    <View style={{flex:5}}>
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
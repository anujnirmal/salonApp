import React from 'react'
import tw from 'twrnc';
import CheckBox from '@react-native-community/checkbox';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';


const ItemCheckout = ({ itemsList, price }) => {
    const [selectedDate, setSelectedDate] = React.useState(
        new Date().getFullYear() + "-0" + (parseInt(new Date().getMonth()) + 1) + "-" + new Date().getDate() 
    );
    console.log("Items " + itemsList)
    console.log(new Date());   
    console.log(selectedDate) 
    let minDate =  new Date().getFullYear() + "-0" + (parseInt(new Date().getMonth()) + 1) + "-" + new Date().getDate();
    return (
        <View style={tw`w-100 h-50`}>
            <Text style={tw`text-[6] text-center mt-6 text-white`}>Items Selected</Text>
            <View style={tw`absolute bottom-0 w-full h-15 flex items-center justify-center bg-sky-500`}>
                <Pressable onPress={() => {
                    console.log("HHEHEH " + selectedItem);
                    setItemCheckOut(true)

                }}><Text style={tw`text-white text-[4]`}>Confirm, Total: Rs. {price}
                    </Text></Pressable>
            </View>
            <View style={tw`w-full h-full`}>
                <Calendar
                    // Initially visible month. Default = now
                    initialDate={'2023-02-19'}
                    // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                    minDate={minDate}
                    // // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                    // maxDate={'2012-05-30'}
                    // Handler which gets executed on day press. Default = undefined
                    onDayPress={day => {
                        console.log('selected day', day);
                        setSelectedDate(day.dateString);
                    }}
                    // Handler which gets executed on day long press. Default = undefined
                    onDayLongPress={day => {
                        console.log('selected day', day);
                        setSelectedDate(day.dateString);
                    }}
                    // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                    monthFormat={'yyyy MM'}
                    // Handler which gets executed when visible month changes in calendar. Default = undefined
                    onMonthChange={month => {
                        console.log('month changed', month);
                    }}
                    
                    // Hide month navigation arrows. Default = false
                    // hideArrows={true}
                    // Replace default arrows with custom ones (direction can be 'left' or 'right')
                    // renderArrow={direction => <Arrow />}
                    // Do not show days of other months in month page. Default = false
                    // hideExtraDays={true}
                    // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
                    // day from another month that is visible in calendar page. Default = false
                    // disableMonthChange={true}
                    // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
                    firstDay={1}
                    // Hide day names. Default = false
                    // hideDayNames={true}
                    // Show week numbers to the left. Default = false
                    showWeekNumbers={true}
                    // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                    onPressArrowLeft={subtractMonth => subtractMonth()}
                    // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                    onPressArrowRight={addMonth => addMonth()}
                    // Disable left arrow. Default = false
                    // disableArrowLeft={true}
                    // // Disable right arrow. Default = false
                    // disableArrowRight={true}
                    // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
                    // disableAllTouchEventsForDisabledDays={true}
                    // Replace default month and year title with custom one. the function receive a date as parameter
                    renderHeader={date => {
                        /*Return JSX*/
                    }}
                    // Enable the option to swipe between months. Default = false
                    enableSwipeMonths={true}
                    markedDates={{
                        [selectedDate] : {selected: true, marked: true, selectedColor: 'blue'}
                    }}
                />
            </View>
            <ScrollView style={tw`mt-100 mb-16`}>

                {itemsList?.map((item, index) => {
                    return <View style={styles.modalView} key={index}>
                        <View style={tw`flex-row`}>
                            <View style={{ flex: 5 }}>
                                <Text style={tw`text-[6 ]`}>{item.name}</Text>
                                <Text>Price: Rs. {item?.price}</Text>
                            </View>

                        </View>
                    </View>
                })}
                {itemsList?.map((item, index) => {
                    return <View style={styles.modalView} key={index}>
                        <View style={tw`flex-row`}>
                            <View style={{ flex: 5 }}>
                                <Text style={tw`text-[6 ]`}>{item.name}</Text>
                                <Text>Price: Rs. {item?.price}</Text>
                            </View>

                        </View>
                    </View>
                })}
                {itemsList?.map((item, index) => {
                    return <View style={styles.modalView} key={index}>
                        <View style={tw`flex-row`}>
                            <View style={{ flex: 5 }}>
                                <Text style={tw`text-[6 ]`}>{item.name}</Text>
                                <Text>Price: Rs. {item?.price}</Text>
                            </View>

                        </View>
                    </View>
                })}

            </ScrollView>
        </View>
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


export default ItemCheckout
import React, { useState, useEffect,useRef } from 'react';
import {
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { Block, theme, Text, } from "galio-framework";
import {Language } from "../constants";
const { width, } = Dimensions.get("screen");
import Empty from './../components/Empty';
import API from './../services/api';
import Tabs from './../components/Tabs';
import Button from './../components/Button';
import { NavigationEvents } from '@react-navigation/native';
import config from '../config';


function renderEmpty(numItems,loading){
  if(numItems == 0 && loading == false){
     return (
         <Empty text={Language.noAddressesAddNew} />
      )
  }else{
    return null;
  }
}


function SelectableTabs(props){
  const { tabs, tabIndex, changeFunction } = props;
  const defaultTab = tabs && tabs[0] && tabs[0].id;
  
  if (!tabs) return null;

  return (
    <Tabs
      data={tabs || []}
      vertical={props.vertical}
      initialIndex={tabIndex || defaultTab}
      onChange={id => changeFunction(id)} />
  )
}


const SelectAddress = ({route,navigation}) => {
  const { restaurant_id } = route.params;
  const [addresses, setAddresses] = useState([]);
  const [addressesRaw, setAddressesRaw] = useState([]);
  const [addressSelected, setAddressSelected] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [timeSlotsUF, setTimeSlotsUF] = useState([]);
  const [restaurantInfo, setRestaurantInfo] = useState({
    "name": "",
    "address": "",
    "phone": "",
  });
  const [timeSlotsLoaded, setTimeSlotsLoaded] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [timeSlot, setTimeSlot] = useState(null);
  const cardContainer = [styles.card, styles.shadow];
  const [deliveryMethodsList, setDeliveryMethodsList] = useState([]);
  
  
  
  useEffect(() => {
    console.log("Com will update");

    navigation.addListener('focus', () => {
      API.getAddressWithFees(restaurant_id,(addressResponse)=>{
        setAddressesRaw(addressResponse);
        
          addressItems=[];
          var index=0;

          addressResponse.forEach(element => {
            addressItems.push({
              id:index,
              title:(element.address+ " - " + (!element.inRadius?Language.notInRange:element.cost_total+" "+config.currencySign)),
            });
            index++;
          });
          setAddresses(addressItems)
        
      })
    });
    

    API.getRestaurantInfo(restaurant_id,(restaurantResponse)=>{
      console.log("Restaurant data loaded "+restaurant_id);
      tsUF={};
      restaurantResponse.timeSlots.forEach(element => {
        tsUF[element.id]=element.title;
      });

      var deliveryList=[];
      if(restaurantResponse.restorant.can_deliver==1){
        deliveryList.push({ id: 'delivery', title: Language.delivery })
      }

      if(restaurantResponse.restorant.can_pickup==1){
        deliveryList.push({ id: 'pickup', title: Language.pickup })
      }
      setDeliveryMethodsList(deliveryList);

      //Set default to pickup
      if(restaurantResponse.restorant.can_pickup==1&&restaurantResponse.restorant.can_deliver==0){
        setDeliveryMethod('pickup');
      }

      setTimeSlots(restaurantResponse.timeSlots);
      setTimeSlotsLoaded(true);
      setTimeSlotsUF(tsUF);
      setRestaurantInfo(restaurantResponse.restorant);
    })

  },[])


  function renderAddress(){
    if(deliveryMethod=="delivery"){
      return (
        <Block row={true} card flex style={cardContainer}>
              <Block flex space="between" style={styles.cardDescription}>
                <Text bold style={styles.cardTitle}>{Language.selectAddress}</Text>
                <Block left>
                  <SelectableTabs vertical={true} tabs={addresses} changeFunction={setAddressSelected}   />
                </Block>
                <Block center >
                <Button  onPress={() => navigation.navigate('AddAddress')} color="info" >{Language.addNewAddress.toUpperCase()}</Button>
                </Block>
                
              </Block>
             
          </Block>
         
      )
    }else{
      return null;
    }
  }

  function restaurantClosed(){
    if(timeSlotsLoaded&&timeSlots.length==0){
      return (<Text bold color={"red"}>{Language.restaurantClosed}</Text>)
    }else{
      return null
    }
  }

  function deliveryOrPickup(){
    if(timeSlotsLoaded){
      return (<Block row={true} card flex style={cardContainer} s={deliveryMethod}>
        <Block flex space="between" style={styles.cardDescription}>
          <Text bold style={styles.cardTitle}>{Language.deliveryOrPickup}</Text>
          <Block left>
            <SelectableTabs tabs={deliveryMethodsList} changeFunction={setDeliveryMethod}   />
          </Block>
          
          </Block>
    </Block>)
    }else{
      return null
    }
  }


  function proceedToCheckout(){
    active=deliveryMethod=="delivery"?timeSlot!=null&&addressSelected!=null&&addressesRaw[addressSelected].inRadius:timeSlot!=null;
  return (<Block style={{opacity:active?1:0.5}}>
    <Button style={{width:"100%"}} onPress={()=>{
              navigation.navigate("Payment",
              {
                address:addressesRaw[addressSelected],
                timeSlot:timeSlot,
                timeSlotUF:tsUF[timeSlot],
                deliveryMethod:deliveryMethod,
                restaurant_id:restaurant_id
              });
            }}
             disabled={!active} color="default">{Language.proceedToCheckout.toUpperCase()}</Button>
    </Block>)
  }

  return (
    <Block flex center style={styles.home}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}>
        <Block>

          {/** DELIVERY OR PICKUP */}
          {deliveryOrPickup()}

           {/**  Time slots */}
           <Block row={true} card flex style={cardContainer}>
              <Block flex space="between" style={styles.cardDescription}>
                <Text bold style={styles.cardTitle}>{deliveryMethod=="delivery"?Language.deliveryTime:Language.pickupTime}</Text>
                {restaurantClosed()}
                <Block left>
                  <SelectableTabs tabs={timeSlots} changeFunction={setTimeSlot}   />
                 
                </Block>
              </Block>
          </Block>

          {/**  Addresses */}
          {renderAddress()}

           {/**  Restorant information */}
           <Block row={true} card flex style={cardContainer}>
              <Block flex space="between" style={styles.cardDescription}>
                <Text bold style={styles.cardTitle}>{restaurantInfo.name}</Text>
                <Text muted size={14} style={styles.cardTitle}>{restaurantInfo.address}</Text>
                <Text size={14} style={styles.cardTitle}>{restaurantInfo.phone}</Text>
              </Block>
          </Block>


        {/**  Checkout button  */}
        {proceedToCheckout()}


          

        </Block>
      </ScrollView>
    </Block>
    
  )
}
export default SelectAddress;


const styles = StyleSheet.create({
  cartCheckout: {
    backgroundColor:"white"
    },
    listStyle:{
        padding:theme.SIZES.BASE,
    },
  home: {
    width: width,    
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
  actionButtons:{

    //width: 100,
    backgroundColor: '#DCDCDC',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom:9.5,
    borderRadius: 3,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
  
  },
  card: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
    marginBottom: 16
  },
  cardTitle: {
    flex: 1,
    flexWrap: 'wrap',
    paddingBottom: 6
  },
  cardDescription: {
    padding: theme.SIZES.BASE / 2
  },
  imageContainer: {
    borderRadius: 3,
    elevation: 1,
    overflow: 'hidden',
    resizeMode: "cover"
  },
  image: {
    // borderRadius: 3,
  },
  horizontalImage: {
    height: 122,
    width: 'auto',
  },
  horizontalStyles: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  verticalStyles: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0
  },
  fullImage: {
    height: 200
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});



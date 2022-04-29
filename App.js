/* eslint-disable quotes */
/* eslint-disable no-shadow */
/* eslint-disable semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import { 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity,
  FlatList,
  Button
} from 'react-native'
import React, {useState} from 'react'
import { BleManager, characteristic } from 'react-native-ble-plx'
import base64 from 'react-native-base64';

const manager = new BleManager();


const App = () => {
  
  const [displayText, setDisplayText] = useState(null)
  const [devices, setDevices] = useState([])
  const [connectedDevice, setConnectedDevice] = useState({})

  //console.log(devices)

  const startScan = () => {
    manager.startDeviceScan(null, {
      allowDuplicates: false,
      },
      async (error, device) => {
        setDisplayText('Scanning...');
        if (error) {
          manager.stopDeviceScan();
        }
        console.log(device.localName, device.name, device.id);
        if (device.name.includes('HRM') ) {
          setDevices([...devices, device]);
          manager.stopDeviceScan();} }, );
  };

  const connectDevice = device => {
    // manager.stopDeviceScan();
    console.log(device)
  manager.connectToDevice(device.id).then(async device => {
              await device.discoverAllServicesAndCharacteristics()
              
              // console.log(devices)
              manager.stopDeviceScan();
              setDisplayText(`Device connected\n with ${device.name}`);
              setConnectedDevice(device);
              setDevices(device);
              // console.log(device)
              device.services().then(async service => {
                // console.log(service)
              })

  })}

  const getData = (device) => { 
    console.log('Starting read...')
    // console.log(device.id)
          const response = manager.monitorCharacteristicForDevice(
                device.id,
                '0000180d-0000-1000-8000-00805f9b34fb', 
                '00002a37-0000-1000-8000-00805f9b34fb', 
                (error, characteristic) => {
                  if (error) {
                    if (error.errorCode !== 2){
                      console.log('Error: ' + error.message + '. My error message')
                    }
                    return console.log('I was here')
                  }
                  if (true) {
                    console.log('Getting value')
                    console.log(characteristic.value)
                  }                  
                  console.log(response, 'response')
                }
              )
          console.log('Hello Sir', 'response')
  }




const disconnectDevice = () => {
  connectedDevice.cancelConnection();
};


  
  return (
    <View style={styles.mainContainer}>
      {devices.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={startScan}
            style={styles.circleView}>
            <Text style={styles.boldTextStyle}>{displayText}</Text>
          </TouchableOpacity>
          <View style={{marginTop:10}}>
          {/* <Button
            title="Get Glucose Data"
              onPress={getData(devices)}/> */}
            </View>
        </View>
      ) : Object.keys(connectedDevice).length !== 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{marginBottom: 12, textAlign: 'center'}}>
            Tap button to disconnect device.
          </Text>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={disconnectDevice}
            style={styles.circleView}>
            <Text style={styles.boldTextStyle}>{displayText}</Text>
          </TouchableOpacity>
          <View style={{flex: 1, marginBottom: 50}}>
            <Button
            title="Get Glucose Data"
              onPress={() => getData(devices)}
              style={{}} />
          </View>
        </View>
      ) : (
        <FlatList
          style={{flex: 1}}
          data={devices}
          keyExtractor={item => item.id.toString()}
          renderItem={items => (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => connectDevice(items.item)}
              style={{
                width: '100%',
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderRadius: 10,
              }}>
              <Text style={{color: 'black', fontSize: 18}}>
                {items.item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
        
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  circleView: {
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: 250,
    borderRadius: 150,
    borderWidth: 1,
  },
  boldTextStyle: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});



export default App

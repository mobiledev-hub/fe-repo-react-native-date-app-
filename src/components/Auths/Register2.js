import React, { Component } from "react";
import {
  Text,
  Content
} from "native-base"
import {
  ImageBackground,
  Image,
  Platform,
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  PermissionsAndroid,
  Linking
} from "react-native";
import DeviceInfo from 'react-native-device-info';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import Geolocation from 'react-native-geolocation-service';
import nativeFirebase from 'react-native-firebase';
import logo from '../../assets/images/logo.png';
import slogo from '../../assets/images/second_bg.png';
import { Dropdown } from 'react-native-material-dropdown';
import Global from '../Global';

import { SERVER_URL } from '../../config/constants';

class Register2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickName: '',
      // email: '',
      // password: '',
      // fullname: '',
      birthday: '',
      gender: '',
      description: '',
      languageData: [],
      language: '',
      cityData: [],
      city: '',
      country: '',
      countryData: [],
      register_click_count: 0,
    };
  }

  static navigationOptions = {
    header: null
  };
  componentDidMount() {
    this.setState({
      nickName: this.props.navigation.state.params.nickName,
      // email: this.props.navigation.state.params.email,
      // password: this.props.navigation.state.params.password,
      // fullname: this.props.navigation.state.params.fullname,
      birthday: this.props.navigation.state.params.birthday,
      description: this.props.navigation.state.params.description,
      gender: this.props.navigation.state.params.gender
    });
    this.get_ethnicity()
    this.get_country()
    this.get_language()
  }
  get_ethnicity() {
    fetch(`${SERVER_URL}/api/ethnicity/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => response.json())
      .then((responseJson) => {
        //alert(JSON.stringify(responseJson))
        if (!responseJson.error) {
          var data = responseJson.data;
          var itmes = [];
          for (var i = 0; i < data.length; i++) {
            itmes.push({ value: data[i].ethnicity_name, id: data[i].id })
          }
          this.setState({ city: data[0].ethnicity_name, cityData: itmes })
        }
      })
      .catch((error) => {
        alert(JSON.stringify(error))
        return
      });
  }
  get_country() {
    fetch(`${SERVER_URL}/api/country/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => response.json())
      .then((responseJson) => {
        // alert(JSON.stringify(responseJson))
        if (!responseJson.error) {
          var data = responseJson.data;
          var itmes = [];
          for (var i = 0; i < data.length; i++) {
            itmes.push({ value: data[i].country_name, id: data[i].id })
          }
          this.setState({ country: data[0].country_name, countryData: itmes })
        }
      })
      .catch((error) => {
        alert(JSON.stringify(error))
        return
      });
  }

  get_language() {
    fetch(`${SERVER_URL}/api/language/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => response.json())
      .then((responseJson) => {
        //  alert(JSON.stringify(responseJson))
        if (!responseJson.error) {
          var data = responseJson.data;
          var itmes = [];
          for (var i = 0; i < data.length; i++) {
            itmes.push({ value: data[i].language_name, id: data[i].id })
          }
          this.setState({ language: data[0].language_name, languageData: itmes })
        }
      })
      .catch((error) => {
        alert(JSON.stringify(error))
        return
      });
  }
  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Cool App Some Permissions',
          message:
            'Cool App needs access to your some permissions.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.showAlert('Congrate!', 'Please try to registe your account again!');
      } else {
        this.showAlert('Location Permission Invalid', 'Please allow your phone settng to get location so that you can enjoy app.');
      }
    } catch (error) {
      // Error retrieving data
      console.error(error);
    }
  }
  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }
  async checkLocationPermission() {
    const isPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (isPermission) {
      Geolocation.getCurrentPosition(
        (position) => {
          const usergeo = {
            lat_geo: position.coords.latitude,
            long_geo: position.coords.longitude
          };
          return usergeo;
        },
        (error) => {
          // See error code charts below.
          alert(error.message);
          return null;
        },
        // { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        { enableHighAccuracy: true, timeout: 15000 }
      );
    } else {
      await this.requestLocationPermission();
    }
  }
  getdeviceId = async () => {
    //Getting the Unique Id from here
    var fcmToken = await nativeFirebase.messaging().getToken();
    var id = DeviceInfo.getUniqueID();
    var deviceInfo = { device_id: id, fcm_id: fcmToken };
    return deviceInfo;
  };
  onRegister = () => {
    if (this.state.register_click_count === 0) {
      this.setState({
        register_click_count: 1,
      });
      if (Platform.OS === 'android') {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(isPermission => {
          if (isPermission) {
            Geolocation.getCurrentPosition(
              (position) => {
                this.getdeviceId().then(deviceInfo => {
                  let language_index = 1;
                  this.state.languageData.forEach((item, index) => {
                    if (item.value === this.state.language)
                      language_index = item.id;
                  });
                  let country_index = 1;
                  this.state.countryData.forEach((item, index) => {
                    if (item.value === this.state.country)
                      country_index = item.id;
                  });
                  let city_index = 1;
                  this.state.cityData.forEach((item, index) => {
                    if (item.value === this.state.city)
                      city_index = item.id;
                  })
                  var details = {
                    'username': this.state.nickName,
                    // 'useremail': this.state.email,
                    // 'userpassword': this.state.password,
                    'usergender': this.state.gender,
                    'description': this.state.description,
                    'language': language_index,
                    'country': country_index,
                    'ethnicity': city_index,
                    'birth_date': this.state.birthday,
                    'lat_geo': position.coords.latitude,
                    'long_geo': position.coords.longitude,
                    'device_id': deviceInfo.device_id,
                    'fcm_id': deviceInfo.fcm_id
                  };
                  var formBody = [];
                  for (var property in details) {
                    var encodedKey = encodeURIComponent(property);
                    var encodedValue = encodeURIComponent(details[property]);
                    formBody.push(encodedKey + "=" + encodedValue);
                  }
                  formBody = formBody.join("&");
                  fetch(`${SERVER_URL}/api/user/signup`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formBody,
                  }).then((response) => response.json())
                    .then((responseJson) => {
                      if (!responseJson.error) {
                        // this.onLogin();
                        Global.saveData.token = responseJson.user.token;
                        Global.saveData.u_id = responseJson.user.id
                        Global.saveData.u_name = responseJson.user.name
                        Global.saveData.u_age = responseJson.user.age
                        Global.saveData.u_gender = responseJson.user.gender
                        Global.saveData.u_language = responseJson.user.language
                        Global.saveData.u_city = responseJson.user.ethnicity
                        Global.saveData.u_country = responseJson.user.country
                        Global.saveData.u_description = responseJson.user.description;
                        Global.saveData.coin_count = responseJson.user.coin_count;
                        Global.saveData.newUser = true;
                        this.registerLoadingBtn.showLoading(false);
                        this.props.navigation.navigate("BrowseList");
                      }
                      this.registerLoadingBtn.showLoading(false);
                    })
                    .catch((error) => {
                      alert(error);
                    });
                });
              },
              (error) => {
                if (error.code == 2) {
                  this.getdeviceId().then(deviceInfo => {
                    let language_index = 1;
                    this.state.languageData.forEach((item, index) => {
                      if (item.value === this.state.language)
                        language_index = item.id;
                    });
                    let country_index = 1;
                    this.state.countryData.forEach((item, index) => {
                      if (item.value === this.state.country)
                        country_index = item.id;
                    });
                    let city_index = 1;
                    this.state.cityData.forEach((item, index) => {
                      if (item.value === this.state.city)
                        city_index = item.id;
                    })
                    var details = {
                      'username': this.state.nickName,
                      // 'useremail': this.state.email,
                      // 'userpassword': this.state.password,
                      'usergender': this.state.gender,
                      'description': this.state.description,
                      'language': language_index,
                      'country': country_index,
                      'ethnicity': city_index,
                      'birth_date': this.state.birthday,
                      'lat_geo': 0,
                      'long_geo': 0,
                      'device_id': deviceInfo.device_id,
                      'fcm_id': deviceInfo.fcm_id
                    };
                    var formBody = [];
                    for (var property in details) {
                      var encodedKey = encodeURIComponent(property);
                      var encodedValue = encodeURIComponent(details[property]);
                      formBody.push(encodedKey + "=" + encodedValue);
                    }
                    formBody = formBody.join("&");
                    fetch(`${SERVER_URL}/api/user/signup`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      },
                      body: formBody,
                    }).then((response) => response.json())
                      .then((responseJson) => {
                        if (!responseJson.error) {
                          // this.onLogin();
                          Global.saveData.token = responseJson.user.token;
                          Global.saveData.u_id = responseJson.user.id
                          Global.saveData.u_name = responseJson.user.name
                          Global.saveData.u_age = responseJson.user.age
                          Global.saveData.u_gender = responseJson.user.gender
                          Global.saveData.u_language = responseJson.user.language
                          Global.saveData.u_city = responseJson.user.ethnicity
                          Global.saveData.u_country = responseJson.user.country
                          Global.saveData.u_description = responseJson.user.description;
                          Global.saveData.coin_count = responseJson.user.coin_count;
                          Global.saveData.newUser = true;
                          this.registerLoadingBtn.showLoading(false);
                          this.props.navigation.navigate("BrowseList");
                        }
                        this.registerLoadingBtn.showLoading(false);
                      })
                      .catch((error) => {
                        alert(error);
                      });
                  });
                } else {
                  // See error code charts below.
                  alert(error.message);
                  return null;
                }
              },
              // { enableHighAccuracy: Platform.OS != 'android', timeout: 5000, }
              { enableHighAccuracy: true, timeout: 15000 }
            );
          } else {
            Alert.alert(
              'Alert',
              "You have to allow DazzledDate to access this device's location. Please restart app and allow to access.",
              [
                {text: 'Ok', onPress: () => console.log('Ok pressed.')},
              ],
              {cancelable: false},
            );
          }
        });
      } else if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization();
        Geolocation.getCurrentPosition(
          (position) => {
            this.getdeviceId().then(deviceInfo => {
              let language_index = 1;
              this.state.languageData.forEach((item, index) => {
                if (item.value === this.state.language)
                  language_index = item.id;
              });
              let country_index = 1;
              this.state.countryData.forEach((item, index) => {
                if (item.value === this.state.country)
                  country_index = item.id;
              });
              let city_index = 1;
              this.state.cityData.forEach((item, index) => {
                if (item.value === this.state.city)
                  city_index = item.id;
              })
              var details = {
                'username': this.state.nickName,
                // 'useremail': this.state.email,
                // 'userpassword': this.state.password,
                'usergender': this.state.gender,
                'description': this.state.description,
                'language': language_index,
                'country': country_index,
                'ethnicity': city_index,
                'birth_date': this.state.birthday,
                'lat_geo': position.coords.latitude,
                'long_geo': position.coords.longitude,
                'device_id': deviceInfo.device_id,
                'fcm_id': deviceInfo.fcm_id
              };
              var formBody = [];
              for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
              }
              formBody = formBody.join("&");
              fetch(`${SERVER_URL}/api/user/signup`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formBody,
              }).then((response) => response.json())
                .then((responseJson) => {
                  if (!responseJson.error) {
                    // this.onLogin();
                    Global.saveData.token = responseJson.user.token;
                    Global.saveData.u_id = responseJson.user.id
                    Global.saveData.u_name = responseJson.user.name
                    Global.saveData.u_age = responseJson.user.age
                    Global.saveData.u_gender = responseJson.user.gender
                    Global.saveData.u_language = responseJson.user.language
                    Global.saveData.u_city = responseJson.user.ethnicity
                    Global.saveData.u_country = responseJson.user.country
                    Global.saveData.u_description = responseJson.user.description;
                    Global.saveData.coin_count = responseJson.user.coin_count;
                    Global.saveData.newUser = true;
                    this.registerLoadingBtn.showLoading(false);
                    this.props.navigation.navigate("BrowseList");
                  }
                  this.registerLoadingBtn.showLoading(false);
                })
                .catch((error) => {
                  alert(error);
                });
            });
          },
          (error) => {
            if (error.code == 2) {
              this.getdeviceId().then(deviceInfo => {
                let language_index = 1;
                this.state.languageData.forEach((item, index) => {
                  if (item.value === this.state.language)
                    language_index = item.id;
                });
                let country_index = 1;
                this.state.countryData.forEach((item, index) => {
                  if (item.value === this.state.country)
                    country_index = item.id;
                });
                let city_index = 1;
                this.state.cityData.forEach((item, index) => {
                  if (item.value === this.state.city)
                    city_index = item.id;
                })
                var details = {
                  'username': this.state.nickName,
                  // 'useremail': this.state.email,
                  // 'userpassword': this.state.password,
                  'usergender': this.state.gender,
                  'description': this.state.description,
                  'language': language_index,
                  'country': country_index,
                  'ethnicity': city_index,
                  'birth_date': this.state.birthday,
                  'lat_geo': 0,
                  'long_geo': 0,
                  'device_id': deviceInfo.device_id,
                  'fcm_id': deviceInfo.fcm_id
                };
                var formBody = [];
                for (var property in details) {
                  var encodedKey = encodeURIComponent(property);
                  var encodedValue = encodeURIComponent(details[property]);
                  formBody.push(encodedKey + "=" + encodedValue);
                }
                formBody = formBody.join("&");
                fetch(`${SERVER_URL}/api/user/signup`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  body: formBody,
                }).then((response) => response.json())
                  .then((responseJson) => {
                    if (!responseJson.error) {
                      // this.onLogin();
                      Global.saveData.token = responseJson.user.token;
                      Global.saveData.u_id = responseJson.user.id
                      Global.saveData.u_name = responseJson.user.name
                      Global.saveData.u_age = responseJson.user.age
                      Global.saveData.u_gender = responseJson.user.gender
                      Global.saveData.u_language = responseJson.user.language
                      Global.saveData.u_city = responseJson.user.ethnicity
                      Global.saveData.u_country = responseJson.user.country
                      Global.saveData.u_description = responseJson.user.description;
                      Global.saveData.coin_count = responseJson.user.coin_count;
                      Global.saveData.newUser = true;
                      this.registerLoadingBtn.showLoading(false);
                      this.props.navigation.navigate("BrowseList");
                    }
                    this.registerLoadingBtn.showLoading(false);
                  })
                  .catch((error) => {
                    alert(error);
                  });
              });
            } else {
              // See error code charts below.
              alert(error.message);
              return null;
            }
          },
          // { enableHighAccuracy: Platform.OS != 'android', timeout: 5000, }
          { enableHighAccuracy: true, timeout: 15000 }
        );
      }
    }
    this.registerLoadingBtn.showLoading(false);
  }
  // onLogin() {
  //   nativeFirebase.messaging().getToken().then(fcmToken => {
  //     if (fcmToken) {
  //       var details = {
  //         // 'useremail': this.state.email,
  //         // 'userpassword': this.state.password,
  //         'fcm_id': fcmToken
  //       };
  //       var formBody = [];
  //       for (var property in details) {
  //         var encodedKey = encodeURIComponent(property);
  //         var encodedValue = encodeURIComponent(details[property]);
  //         formBody.push(encodedKey + "=" + encodedValue);
  //       }
  //     }
  //     formBody = formBody.join("&");
  //     fetch(`${SERVER_URL}/api/user/login`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded'
  //       },
  //       body: formBody,
  //     }).then((response) => response.json())
  //       .then((responseJson) => {
  //         if (!responseJson.error) {
  //           Global.saveData.token = responseJson.user.token;
  //           Global.saveData.u_id = responseJson.user.id;
  //           Global.saveData.u_name = responseJson.user.name;
  //           Global.saveData.u_age = responseJson.user.age;
  //           Global.saveData.u_gender = responseJson.user.gender;
  //           Global.saveData.u_email = responseJson.user.email;
  //           Global.saveData.u_language = responseJson.user.language;
  //           Global.saveData.u_city = responseJson.user.ethnicity;
  //           Global.saveData.u_country = responseJson.user.country;
  //           Global.saveData.newUser = true;
  //           this.props.navigation.navigate("Browse");
  //         }
  //       }).catch((error) => {
  //         alert(JSON.stringify(error));
  //         return
  //       });
  //   });
  // }

  render() {
    return (
      <View style={styles.contentContainer}>
        <StatusBar backgroundColor='#fff' barStyle='dark-content' />
        <ImageBackground source={slogo} style={{ width: DEVICE_WIDTH, height: 150, marginTop: Platform.select({ 'android': 0, 'ios': 30 }), alignItems: 'center', justifyContent: 'center' }}>
          <Image source={logo} style={{ width: 205, height: 83, tintColor: '#DE5859' }} />
        </ImageBackground>
        <Content>
          <View style={{ width: DEVICE_WIDTH * 0.8, marginLeft: DEVICE_WIDTH * 0.1, marginTop: 50 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#808080', fontSize: 12 }}>{"LANGUAGE"}</Text>
            </View>
            <View>
              <Dropdown
                containerStyle={{ width: "100%", marginTop: -15 }}
                label=' '
                style={{ color: 'black' }}
                inputContainerStyle={{ borderBottomColor: '#808080', }}
                baseColor="#DE5859"//indicator color
                textColor="#000"
                data={this.state.languageData}
                onChangeText={(language) => this.setState({ language })}
                value={this.state.language}
                dropdownPosition={-4}
              />
            </View>
          </View>
          <View style={{ width: DEVICE_WIDTH * 0.8, marginLeft: DEVICE_WIDTH * 0.1, marginTop: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#808080', fontSize: 12 }}>{"Ethnicity"}</Text>
            </View>
            <View>
              <Dropdown
                containerStyle={{ width: "100%", marginTop: -15 }}
                label=' '
                style={{ color: 'black' }}
                inputContainerStyle={{ borderBottomColor: '#808080', }}
                baseColor="#DE5859"//indicator color
                textColor="#000"
                data={this.state.cityData}
                onChangeText={(city) => this.setState({ city })}
                value={this.state.city}
                dropdownPosition={-4}
              />
            </View>
          </View>

          <View style={{ width: DEVICE_WIDTH * 0.8, marginLeft: DEVICE_WIDTH * 0.1, marginTop: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#808080', fontSize: 12 }}>{"COUNTRY"}</Text>
            </View>
            <View>
              <Dropdown
                containerStyle={{ width: "100%", marginTop: -15 }}
                label=' '
                style={{ color: 'black' }}
                inputContainerStyle={{ borderBottomColor: '#808080', }}
                baseColor="#DE5859"//indicator color
                textColor="#000"
                data={this.state.countryData}
                onChangeText={(country) => this.setState({ country })}
                value={this.state.country}
                dropdownPosition={-4}
              />
            </View>
          </View>
          <View style={{ width: DEVICE_WIDTH * 0.8, marginLeft: DEVICE_WIDTH * 0.1, alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
            <Text style={{ color: '#808080', fontSize: 12, textAlign: 'center' }}>{"BY SIGNING UP, YOU AFREE TO"}</Text>
            <Text style={{marginTop: 10}}>
              <Text style={{ color: '#808080', fontSize: 12, textAlign: 'center' }}>{" OUR "}</Text>
              <Text style={{ color: '#808080', fontSize: 12, textAlign: 'center', textDecorationLine: 'underline' }} onPress={ ()=>{ Linking.openURL('https://dazzleddate.com/terms_and_conditions.html')}}>{" TERMS OF SERVICE "}</Text>
              <Text style={{ color: '#808080', fontSize: 12, textAlign: 'center' }}>{" AND "}</Text>
              <Text style={{ color: '#808080', fontSize: 12, textAlign: 'center', textDecorationLine: 'underline' }} onPress={ ()=>{ Linking.openURL('https://dazzleddate.com/privacy_policy.html')}}>{" PRIVACY POLICY "}</Text>
            </Text>
          </View>
          <View style={{ width: DEVICE_WIDTH, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
            {/* <TouchableOpacity style={{ width: DEVICE_WIDTH * 0.8, height: 40, borderRadius: 20, backgroundColor: '#DE5859', alignItems: 'center', justifyContent: 'center' }}
              onPress={() => this.onRegister()}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{"REGISTER"}</Text>             
            </TouchableOpacity> */}
            <AnimateLoadingButton
              ref={c => (this.registerLoadingBtn = c)}
              width={DEVICE_WIDTH * 0.8}
              height={40}
              title="REGISTER"
              titleFontSize={16}
              titleColor="#fff"
              backgroundColor="#DE5859"
              borderRadius={20}
              onPress={this.onRegister.bind(this)}
            />
          </View>
          <View style={{ height: 100 }} />
        </Content>
      </View>
    );
  }
}
const DEVICE_WIDTH = Dimensions.get('window').width;
// const DEVICE_HEIGHT = Dimensions.get('window').height;
const styles = StyleSheet.create({
  contentContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  instructions: {
    textAlign: 'center',
    color: '#3333ff',
    marginBottom: 5,
  },
});
export default Register2;

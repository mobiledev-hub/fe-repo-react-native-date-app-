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
  TextInput
  // Alert
} from "react-native";
// import Picker from 'react-native-wheel-picker';
import logo from '../../assets/images/logo.png';
import slogo from '../../assets/images/second_bg.png';
import radioIcon from '../../assets/images/radio.png';
import unradioIcon from '../../assets/images/unradio.png';

// var PickerItem = Picker.Item;

class Register1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickName: '',
      // email: '',
      // password: '',
      birthday: new Date(),
      isMale: true,
      description: '',
      // selected_dItem: 6,
      // selected_yItem: 30,
      // selected_mItem: 6,
      // mitemList: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Spe', 'Oct', 'Nov', 'Dec'],
      // yitemList: ['2019'],
      // ditemList: ['1'],
    };
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    this.setState({
      nickName: this.props.navigation.state.params.nickName,
      birthday: this.props.navigation.state.params.birthday
      // email: this.props.navigation.state.params.email,
      // password: this.props.navigation.state.params.password
    });
  }
  // componentWillMount() {
  //   var y_item = []
  //   var d_item = []
  //   for (var i = 1959; i < 2059; i++) {
  //     y_item.push("" + i);
  //   }
  //   for (var i = 1; i < 32; i++) {
  //     d_item.push("" + i)
  //   }
  //   this.setState({ yitemList: y_item, ditemList: d_item })
  // }

  // ondPickerSelect(index) {
  //   this.setState({
  //     selected_dItem: index,
  //   })
  // }
  // onmPickerSelect(index) {
  //   this.setState({
  //     selected_mItem: index,
  //   })
  // }
  // onyPickerSelect(index) {
  //   this.setState({
  //     selected_yItem: index,
  //   })
  // }
  goNext() {
    // var y_item = this.state.yitemList;
    // var m_item = this.state.mitemList;
    // var d_item = this.state.ditemList;
    // var mon = "";
    // var date = "";
    // if ((this.state.selected_mItem + 1) < 10) {
    //   mon = "0" + (this.state.selected_mItem + 1);
    // }
    // else {
    //   mon = "" + (this.state.selected_mItem + 1);
    // }
    // if ((this.state.selected_dItem + 1) < 10) {
    //   date = "0" + d_item[this.state.selected_dItem]
    // }
    // else {
    //   date = "" + d_item[this.state.selected_dItem]
    // }
    // var birthday = y_item[this.state.selected_yItem] + "-" + mon + "-" + date;
    var gender = 1;
    if (!this.state.isMale) {
      gender = 2
    }
    // var nowDate = new Date();
    // var nowYear = nowDate.getFullYear();
    // var deltaYear = parseInt(nowYear) - parseInt(y_item[this.state.selected_yItem]);
    // if (deltaYear < 18) {
    //   Alert.alert(
    //     '',
    //     'Sorry, you must be over 18 years old to register',
    //     [
    //       { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
    //       { text: 'Yes', onPress: () => console.log("Ok Pressed")},
    //     ],
    //     { cancelable: true });
    // } else {
    //   // this.props.navigation.navigate("Register2", { nickName: this.state.nickName, email: this.state.email, password: this.state.password, birthday: birthday, gender: gender })
    // }
    this.props.navigation.navigate("Register2",
     { nickName: this.state.nickName, birthday: this.state.birthday, gender: gender, description: this.state.description }
    );
  }
  render() {
    return (
      <View style={styles.contentContainer}>
        <StatusBar backgroundColor='#fff' barStyle='dark-content' />
        <ImageBackground source={slogo} style={{ width: DEVICE_WIDTH, height: 150, marginTop: Platform.select({ 'android': 0, 'ios': 30 }), alignItems: 'center', justifyContent: 'center' }}>
          <Image source={logo} style={{ width: 205, height: 83, tintColor: '#DE5859' }} />
        </ImageBackground>
        <Content>
          <View style={{ width: DEVICE_WIDTH * 0.8, marginLeft: DEVICE_WIDTH * 0.1, marginTop: 50, }}>
            <Text style={{ color: '#808080', fontSize: 12, marginLeft: 10 }}>{"INTRODUCTION"}</Text>
          </View>
          <View style={{ width: DEVICE_WIDTH * 0.8, marginLeft: DEVICE_WIDTH * 0.1,  marginTop: Platform.select({ 'android': 15, 'ios': 15 })}}>
            <TextInput
              style={{ borderColor: 'gray', borderWidth: 1, minHeight: DEVICE_HEIGHT * 0.3 }}
              onChangeText={description => { this.setState({ description }) }}
              value={this.state.description}
              maxLength={255}
              multiline
              textAlignVertical="top"
            />
          </View>
          {/* <View style={{ width: DEVICE_WIDTH * 0.8, marginLeft: DEVICE_WIDTH * 0.1, marginTop: 50, }}>
            <Text style={{ color: '#808080', fontSize: 12, marginLeft: 10 }}>{"BIRTHDAY"}</Text>
          </View>
          <View style={{ width: DEVICE_WIDTH * 0.8, marginLeft: DEVICE_WIDTH * 0.1, height: 60, marginTop: Platform.select({ 'android': 15, 'ios': 0 }), flexDirection: 'row', justifyContent: 'space-between' }}>
            <Picker style={{ width: 60, height: 60, backgroundColor: '#fff', tintColor: '#00f' }}
              selectedValue={this.state.selected_mItem}
              itemStyle={{ color: "#000", fontSize: 16 }}
              onValueChange={(index) => this.onmPickerSelect(index)}>
              {this.state.mitemList.map((value, i) => (
                <PickerItem label={value} value={i} key={"money" + value} />
              ))}
            </Picker>
            <Picker style={{ width: 60, height: 60, backgroundColor: '#fff', tintColor: '#00f' }}
              selectedValue={this.state.selected_dItem}
              itemStyle={{ color: "#000", fontSize: 16, }}
              onValueChange={(index) => this.ondPickerSelect(index)}>
              {this.state.ditemList.map((value, i) => (
                <PickerItem label={value} value={i} key={"money" + value} />
              ))}
            </Picker>
            <Picker style={{ width: 60, height: 60, backgroundColor: '#fff', tintColor: '#00f' }}
              selectedValue={this.state.selected_yItem}
              itemStyle={{ color: "#000", fontSize: 16 }}
              onValueChange={(index) => this.onyPickerSelect(index)}>
              {this.state.yitemList.map((value, i) => (
                <PickerItem label={value} value={i} key={"money" + value} />
              ))}
            </Picker>
          </View> */}
          <View style={{ width: DEVICE_WIDTH * 0.8, marginLeft: DEVICE_WIDTH * 0.1, marginTop: 50, }}>
            <Text style={{ color: '#808080', fontSize: 12, marginLeft: 10 }}>{"GENDER"}</Text>
          </View>
          <View style={{ width: DEVICE_WIDTH * 0.8, marginLeft: DEVICE_WIDTH * 0.1, height: 30, marginTop: Platform.select({ 'android': 15, 'ios': 15 }), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ isMale: true })}>
              {!this.state.isMale && <Image source={unradioIcon} style={{ tintColor: '#DE5859', width: 15, height: 15 }} />}
              {this.state.isMale && <Image source={radioIcon} style={{ tintColor: '#DE5859', width: 15, height: 15 }} />}
              <Text style={{ color: '#DE5859', marginLeft: 5, fontWeight: 'bold' }}>{"Male"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ isMale: false })}>
              {!this.state.isMale && <Image source={radioIcon} style={{ tintColor: '#DE5859', width: 15, height: 15 }} />}
              {this.state.isMale && <Image source={unradioIcon} style={{ tintColor: '#DE5859', width: 15, height: 15 }} />}
              <Text style={{ color: '#DE5859', marginLeft: 5, fontWeight: 'bold' }}>{"Female"}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: DEVICE_WIDTH, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
            <TouchableOpacity style={{ width: DEVICE_WIDTH * 0.8, height: 40, borderRadius: 20, backgroundColor: '#DE5859', alignItems: 'center', justifyContent: 'center' }}
              onPress={() => this.goNext()}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{"NEXT"}</Text>
            </TouchableOpacity>
          </View>
        </Content>
      </View>
    );
  }
}
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
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
export default Register1;

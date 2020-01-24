import React, { Component } from "react";
import {
  Footer,
  Button,
  FooterTab,
  Text
} from "native-base";
import {
  BackHandler,
  Image,
  ScrollView,
  Platform,
  Dimensions,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar
} from "react-native";
import { connect } from 'react-redux';
import { Badge } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import shorthash from 'shorthash';
// import OnlyGImage from '../../assets/images/OnlyGImage.png';
import b_browse from '../../assets/images/browse.png';
import b_incoming from '../../assets/images/incoming.png';
import b_match from '../../assets/images/match.png';
import b_chat from '../../assets/images/chat.png';
import b_myvideo from '../../assets/images/myvideo.png';
import b_name from '../../assets/images/name.png';
import b_age from '../../assets/images/age.png';
import hiddenMan from '../../assets/images/hidden_man.png';
import diamond from '../../assets/images/red_diamond_trans.png';
import heart from '../../assets/images/heart.png';
import Global from '../Global';

import { SERVER_URL, GCS_BUCKET } from '../../config/constants';

class Income extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: [],
      alertMsg: 'Loading ...',
      coinCount: Global.saveData.coin_count,
      visible: false,
    };
  }

  static navigationOptions = {
    header: null
  };
  componentDidMount() {
    Global.saveData.nowPage = 'Income';
    BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    this.props.navigation.addListener('didFocus', (playload) => {
      this.getHeartUsers()
    });
    // this.getHeartUsers();
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
  }
  backPressed = () => {
    this.props.navigation.replace("BrowseList");
    return true;
  }
  getHeartUsers = () => {
    fetch(`${SERVER_URL}/api/match/getReceivedHearts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': Global.saveData.token
      }
    }).then((response) => response.json())
      .then((responseJson) => {
        if (!responseJson.error) {
          this.getTumbnails(responseJson.data);
        } else if (responseJson.detail) {
          this.setState({
            alertMsg: 'Network Connection Confused.'
          });
        } else {
          this.setState({
            alertMsg: 'There are no incoming hearts.'
          });
        }
      })
      .catch((error) => {
        return
      }
      );
  }
  getTumbnails = async (data) => {
    var list_items = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].cdn_filtered_id) {        
        list_items.push({
          index: i,
          otherId: data[i].other_user_id,
          imageUrl: GCS_BUCKET + data[i].cdn_filtered_id + '-screenshot',
          videoUrl: null,
          name: data[i].name,
          age: data[i].age,
          gender: data[i].gender,
          description: data[i].description,
          distance: data[i].distance
        });
      } else {
        list_items.push({
          index: i,
          otherId: data[i].other_user_id,
          imageUrl: null,
          videoUrl: null,
          name: data[i].name,
          age: data[i].age,
          gender: data[i].gender,
          description: data[i].description,
          distance: data[i].distance,
        });
      }
    }
    this.setState({ datas: list_items })
  }

  // getTumbnails = async (data) => {
  //   var list_items = [];
  //   for (var i = 0; i < data.length; i++) {
  //     if (data[i].cdn_filtered_id) {
  //       var url = `${SERVER_URL}/api/storage/videoLink?fileId=${data[i].cdn_filtered_id}-screenshot`;
  //       var vurl = `${SERVER_URL}/api/storage/videoLink?fileId=${data[i].cdn_filtered_id}`;
  //       await fetch(url, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': Global.saveData.token
  //         }
  //       }).then((response) => response.json())
  //         .then((responseJson) => {
  //           list_items.push({
  //             index: i,
  //             otherId: data[i].other_user_id,
  //             imageUrl: responseJson.url,
  //             videoUrl: vurl,
  //             name: data[i].name,
  //             age: data[i].age,
  //             gender: data[i].gender,
  //             description: data[i].description,
  //             distance: data[i].distance
  //           });
  //         })
  //         .catch((error) => {
  //           return
  //         });
  //     } else {
  //       list_items.push({
  //         index: i,
  //         otherId: data[i].other_user_id,
  //         imageUrl: null,
  //         videoUrl: null,
  //         name: data[i].name,
  //         age: data[i].age,
  //         gender: data[i].gender,
  //         description: data[i].description,
  //         distance: data[i].distance,
  //       });
  //     }
  //   }
  //   this.setState({ datas: list_items })
  // }

  showUserVideo(data) {
    // fetch(url, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': Global.saveData.token
    //   }
    // }).then((response) => response.json())
    //   .then((responseJson) => {
    //     Global.saveData.isMatchVideo = false
    //     this.props.navigation.navigate(
    //       "IncomeDetail",
    //       {
    //         url: responseJson.url,
    //         mid: -1,
    //         otherId: otherId,
    //         imageUrl: imgurl,
    //         name: name,
    //         age: age,
    //         distance: distance
    //       }
    //     )
    //   })
    //   .catch((error) => {
    //     alert("There is error, please try again!");
    //     return
    //   });
    Global.saveData.isMatchVideo = false
    // this.props.navigation.navigate(
    //   "IncomeDetail",
    //   {
    //     url: null,
    //     mid: -1,
    //     otherId: data.otherId,
    //     imageUrl: data.imageUrl,
    //     name: data.name,
    //     age: data.age,
    //     gender: data.gender,
    //     distance: data.distance,
    //     description: data.description
    //   }
    // )

    
    if (data.otherId != -1) {

      fetch(`${SERVER_URL}/api/match/getOtherUserData/${data.otherId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': Global.saveData.token
        }
      }).then((response) => response.json())
        .then((responseJson) => {
          if (!responseJson.error) {

            let newData = responseJson.data;
            this.props.navigation.navigate(
              "IncomeDetail",
              {
                url: null,
                mid: -1,
                otherId: data.otherId,
                imageUrl: data.imageUrl,
                name: data.name,
                age: data.age,
                gender: data.gender,
                distance: newData.distance,
                description: newData.description,
                country_name: newData.country_name,
                ethnicity_name: newData.ethnicity_name,
                language_name: newData.language_name,
                last_loggedin_date: newData.last_loggedin_date,
              }
            )
          }
        }).catch((error) => {
          alert(JSON.stringify(error));
          return
        });
    }
  }
  //////////////////////////////////////////////////
  gotoGpay() {
    this.props.navigation.replace("screenGpay01");
  }
  //////////////////////////////////////////////////
  gotoShop = () => {
    this.setState({
      visible: false
    })
    this.props.navigation.navigate('screenGpay01');
  }

  gotoMainMenu = (menu) => {
      this.updateLastLoggedInDate();
      this.props.navigation.replace(menu);
  }

  updateLastLoggedInDate = () => {
      fetch(`${SERVER_URL}/api/match/updateLastLoggedInDate`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': Global.saveData.token
          },
      }).then((response) => response.json())
          .then((responseJson) => {
              if (!responseJson.error) {
                  return
              }
          })
          .catch((error) => {
              return
          });
  }
  render() {
    return (
      <View style={styles.contentContainer}>
        <StatusBar translucent={true} backgroundColor='transparent' barStyle='dark-content' />
        <View style={{ marginTop: 40, alignItems: 'center', flexDirection: 'row' }}>
          <TouchableOpacity style={{ width: 80, height: 40 }}
            onPress={() => this.gotoShop()}>
            <View style={{ flexDirection: 'row' }}>
              <Image source={diamond} style={{ width: 25, height: 25, marginLeft: 15, marginTop: 10 }} />
              <Text style={{ marginLeft: 10, color: '#000', fontSize: 12, fontWeight: 'bold', marginTop: 15 }}>{this.state.coinCount}</Text>
            </View>
          </TouchableOpacity>
          <Text style={{ justifyContent: 'center', marginLeft: DEVICE_WIDTH * 0.08 }}>{"INCOMING HEARTS"}</Text>
        </View>
        {(this.state.datas.length === 0 ?
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, marginTop: 70}}>{this.state.alertMsg}</Text>
            <Image source={heart} style={{width: 150, height: 150, marginTop: 100}}></Image>
          </View> : <ScrollView style={{ marginTop: 15 }} removeClippedSubviews={true}>
            <FlatList
              numColumns={2}
              style={{ flex: 0 }}
              data={this.state.datas}
              removeClippedSubviews={true}
              initialNumToRender={this.state.datas.length}
              renderItem={({ item: rowData }) => {
                return (
                  <TouchableOpacity style={{ width: DEVICE_WIDTH / 2 - 10, marginTop: 10, marginLeft: 5, marginRight: 5, }} onPress={() => this.showUserVideo(rowData)}>
                    <Image source={rowData.imageUrl !== null ? { uri: rowData.imageUrl } : hiddenMan} resizeMethod="resize" style={{ width: DEVICE_WIDTH / 2 - 20, height: (DEVICE_WIDTH / 2 - 20), marginTop: 3, marginLeft: 5, backgroundColor: '#5A5A5A' }} />
                    {/* <FastImage 
                      source={rowData.imageUrl !== null ? { uri: rowData.imageUrl, headers: { Authorization: shorthash.unique(rowData.imageUrl) }, priority: FastImage.priority.high, } : hiddenMan} 
                      resizeMethod={FastImage.resizeMode.contain} 
                      style={{ width: DEVICE_WIDTH / 2 - 20, height: (DEVICE_WIDTH / 2 - 20), marginTop: 3, marginLeft: 5, backgroundColor: '#5A5A5A' }} /> */}
                    <View style={{ flexDirection: 'row', marginTop: 10, width: (DEVICE_WIDTH / 2 - 10) * 0.6, justifyContent: 'space-between' }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 5 }}>
                        {/* <Image source={b_age} style={{ width: 10, height: 10, tintColor: '#B64F54' }} /> */}
                        <Image source={b_name} style={{ width: 10, height: 10, marginTop: 4, tintColor: '#B64F54' }} />
                        <Text style={{ fontSize: 12, marginLeft: 5, fontWeight: 'bold', color: '#B64F54' }}>{rowData.age + ""}</Text>
                        <Text style={{ fontSize: 12, marginLeft: 5, fontWeight: 'bold', color: '#B64F54' }}>{rowData.gender === 1 ? 'M' : 'F'}</Text>
                        <Text style={{ fontSize: 12, marginLeft: 5, fontWeight: 'bold', color: '#B64F54' }} ellipsizeMode="tail" numberOfLines={1}>{rowData.name}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item, index) => index}
            />
            <View style={{ height: 50 }} />
          </ScrollView>)}
        <Footer style={{ backgroundColor: '#222F3F', borderTopColor: '#222F3F', height: Platform.select({ 'android': 50, 'ios': 50 }) }}>
          <FooterTab>
            <Button badge style={{ backgroundColor: '#222F3F', borderRadius: 0 }} transparent onPress={() => this.gotoMainMenu("BrowseList")}>
              <Image source={b_browse} style={{ width: 25, height: 25, }} />
              <Text style={{ color: '#fff', fontSize: 6, fontWeight: 'bold', marginTop: 3 }}>{"BROWSE"}</Text>
            </Button>
            <Button badge style={{ backgroundColor: '#222F3F', borderRadius: 0 }} transparent onPress={() => { }}>
              <Image source={b_incoming} style={{ width: 25, height: 25, tintColor: '#B64F54' }} />
              <Text style={{ color: '#B64F54', fontSize: 6, fontWeight: 'bold', marginTop: 3 }}>{"INCOMING"}</Text>
            </Button>
            <Button badge style={{ backgroundColor: '#222F3F', borderRadius: 0 }} transparent onPress={() => this.gotoMainMenu("Match")}>
              <Image source={b_match} style={{ width: 25, height: 25 }} />
              <Text style={{ color: '#fff', fontSize: 6, fontWeight: 'bold', marginTop: 3 }}>{"MATCH"}</Text>
            </Button>
            <Button badge style={{ backgroundColor: '#222F3F', borderRadius: 0 }} transparent transparent onPress={() => this.gotoMainMenu("Chat")}>
              {this.props.unreadFlag && (<View style={styles.badgeIcon}><Text style={{ color: '#FFF', textAlign: 'center', fontSize: 10, }}>{'N'}</Text></View>)}
              <Image source={b_chat} style={{ width: 25, height: 25 }} />
              <Text style={{ color: '#fff', fontSize: 6, fontWeight: 'bold', marginTop: 3 }}>{"CHAT"}</Text>
            </Button>
            <Button badge style={{ backgroundColor: '#222F3F', borderRadius: 0 }} transparent onPress={() => this.gotoMainMenu("MyVideo")}>
              <Image source={b_myvideo} style={{ width: 25, height: 25 }} />
              <Text style={{ color: '#fff', fontSize: 6, fontWeight: 'bold', marginTop: 3 }}>{"PROFILE"}</Text>
            </Button>
            {/* <Button style={{ backgroundColor: '#222F3F', borderRadius: 0 }} transparent onPress={() => this.gotoGpay()}>
              <Image source={OnlyGImage} style={{ width: 25, height: 25 }} />
              <Text style={{ color: '#fff', fontSize: 6, fontWeight: 'bold', marginTop: 3 }}>{"GPAY"}</Text>
            </Button> */}
          </FooterTab>
        </Footer>
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
    flexDirection: 'column'
  },
  instructions: {
    textAlign: 'center',
    color: '#3333ff',
    marginBottom: 5,
  },
  badgeIcon: {
    position: 'absolute',
    zIndex: 1000,
    top: -5,
    right: 15,
    width: 20,
    height: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B64F54'
  }
});

const mapStateToProps = (state) => {
  const { unreadFlag } = state.reducer
  return { unreadFlag }
};

export default connect(mapStateToProps)(Income);
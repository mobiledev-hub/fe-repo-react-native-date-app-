import { createStackNavigator } from 'react-navigation';
//FirstScreen
import FirstScreen from './components/FirstScreen';
//Auths
import Login from './components/Auths/Login';
import Signup from './components/Auths/Signup';
import Register1 from './components/Auths/Register1';
import Register2 from './components/Auths/Register2';
import EmailConfirm from './components/Auths/EmailConfirm';
//Main
import Record from './components/Main/Record';
import BrowseList from './components/Main/BrowseList';
import Browse from './components/Main/Browse';
import Filter from './components/Main/Filter';
import Income from './components/Main/Income';
import IncomeDetail from './components/Main/IncomeDetail';
import Match from './components/Main/Match';
import Chat from './components/Main/Chat';
// import ChatDetail from './components/Main/ChatDetail';
import MyVideo from './components/Main/MyVideo';
import MyVideoDetail from './components/Main/MyVideoDetail';
import Profile from './components/Main/Profile';
import ProfileDetail from './components/Main/ProfileDetail';
import ProfileSetting from './components/Main/ProfileSetting';
import TermsPolicy from './components/Main/TermsPolicy';
import Report from './components/Main/Report';
// import AppView from '../AppView';

import ChatScreen from './components/Main/ChatScreen';

// Google Pay 
import screenGpay01 from './components/GPay/screenGpay01';

export default Router = createStackNavigator({
    // AppView: {screen: AppView},
    FirstScreen: { screen: FirstScreen },
    //Main
    Income: { screen: Income },
    IncomeDetail: { screen: IncomeDetail },
    Match: { screen: Match },
    BrowseList: { screen: BrowseList },
    Browse: { screen: Browse },
    Record: { screen: Record },
    Filter: { screen: Filter },
    Chat: { screen: Chat },
    // ChatDetail: { screen: ChatDetail },
    ChatDetail: { screen: ChatScreen },
    MyVideo: { screen: MyVideo },
    MyVideoDetail: { screen: MyVideoDetail },
    Report: { screen: Report },
    Profile: { screen: Profile },
    ProfileDetail: { screen: ProfileDetail },
    ProfileSetting: { screen: ProfileSetting },
    TermsPolicy: { screen: TermsPolicy },
    //Auths
    Login: { screen: Login },
    Signup: { screen: Signup },
    Register1: { screen: Register1 },
    Register2: { screen: Register2 },
    EmailConfirm: { screen: EmailConfirm },
    //Gpay
    screenGpay01: { screen: screenGpay01 },
}, {
    initialRouteName: 'FirstScreen',
    transitionConfig: () => ({
        transitionSpec: {
            duration: 0,
        },
    }),
    navigationOptions: {
        header: null
    }
}
);
import React, { Component } from 'react';
import {
    Button, Platform, StyleSheet, TouchableOpacity, ActivityIndicator,
    Text, View, Dimensions, SafeAreaView, ScrollView, TextInput, Image, FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import Card from '../components/Card';
import CardSection from '../components/CardSection';
import {
    Thumbnail
  } from "native-base";

const statusBarHeight = Platform.OS === 'ios' ? 0 : 0;
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
    container: {
        padding: 0,
        paddingTop: statusBarHeight,
       backgroundColor:'white',
        flex: 1,
    },
    viewMain:{
        flexDirection:'row'
    },
    header: {
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 15,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerText: {
        color: '#1FBEB8',
        fontSize: 16,
    },
    headerBackIcon: {
        color: '#130C38',
        fontSize: 20,
    },
    imageUser:{
        width: 40,
        height:40,
        borderRadius: 20,
        marginLeft: 10,
        marginRight: 10,
    },
    txtName:{
        fontSize:16,
        fontWeight: "bold",
        marginLeft:4,
    },
    txtDesignation:{
        color:'gray',
        fontSize:14,
    },
    txtMemberCount:{
     fontSize: 18,
     color:'#20B8BE',
     marginRight:20,
    },
    imgSearchIcon:{
        top:1,
        right: 3,
      
       position: 'absolute',
       width:40,
       height:40,
    },
    listStyle:{
        marginTop:'10%',
       
    },
    viewSearchMemCount:{
        flexDirection:'row',
        marginLeft:10,
        marginRight:10,
    },
    avatar: {
        width: 60,
        height: 60,
      },
});

class UsersList extends Component{
    
constructor(props){
    super(props);
    this.state={
     dataUser : [],
    };
}
componentDidMount(){
    let dict = this.props.navigation.state.params.taskGroupData;

     if(dict._team){
        this.setState({dataUser:dict._team.emails})  ;
    }
    console.log('will mount user task group ', dict._team.emails);
}
handleBackAction() {
    this.props.navigation.navigate({ routeName: 'Chat' })
}
moveToUserDetail(){
    this.props.navigation.navigate('UserDetailView');
}
renderItem = (item,index) =>{
    console.log('item is ',item);
    var name = '', designation = '',imgUser;
    if(item.item){
     let dict = item.item.userDetails;

     if(dict.profile.firstName){
        name = dict.profile.firstName
     }
     if(dict.profile.lastName){
        name = name+' '+dict.profile.lastName;
     }
    
   imgUser =  <Thumbnail
     style={styles.imageUser}
     source={{uri: dict.profile.pictureURL || `https://ui-avatars.com/api/?name=${dict.profile.firstName}+${dict.profile.lastName}`}}/>
         
}
    
 return(
    <CardSection>
        <TouchableOpacity onPress={()=>this.props.navigation.navigate('UserDetailView', {detailDict:item.item})}>
            <View style={styles.viewMain}>
            {imgUser}
                   <View>
                    <Text style={styles.txtName}> {name} </Text>
                    <Text style={styles.txtDesignation}>  {designation} </Text>
                </View>
            </View>
        </TouchableOpacity>
    </CardSection>
 )
}
    render(){
        let countMbr = 0;
        countMbr = this.state.dataUser.length;

        return(
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => this.handleBackAction()}
                            style={styles.headerBackView}>

                            <View>
                                <Icon
                                    name='chevron-left'
                                    style={styles.headerBackIcon}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.viewSearchMemCount}>
                       <Text style={styles.txtMemberCount}>{countMbr} Members</Text>
                       <Image style={styles.imgSearchIcon} source={require('../../assets/images/Search.png')}/>
                    </View>
                   
                    <View style={styles.listContainer}>
                                <FlatList
                                style={styles.listStyle}
                                    data = { this.state.dataUser }
                                    scrollEnabled={true}
                                    marginBottom={50}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem = {this.renderItem}
                                    />
                        </View>
            </SafeAreaView>
            
           
        );
    }
}


export default UsersList;
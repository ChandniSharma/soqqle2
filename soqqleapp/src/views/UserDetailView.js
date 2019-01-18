import React, { Component } from 'react';
import {
    Button, Platform, StyleSheet, TouchableOpacity, ActivityIndicator,
    Text, View, Dimensions, SafeAreaView, ScrollView, TextInput, Image,ImageBackground, FlatList
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
    viewTop:{
      backgroundColor:'#F8F8F8',
      borderBottomColor:'#D3D3D3',
      borderBottomWidth:1,
    },
    viewNamePhoto:{
        flexDirection:'row'
    },
    imageUser:{
        width: 50,
        height:50,
        borderRadius: 25,
        marginLeft: 10,
        marginRight: 10,
    },
    txtName:{
        fontSize:20,
        fontWeight: "bold",
        marginLeft:4,
    },
    txtDesignation:{
        color:'gray',
        fontSize:14,
    },
    txtDescription:{
        fontSize:12,
        color:'#000000',
        marginLeft:10,
    },
   viewBottomBtn:{
        flexDirection:'row',
       
        
       width:'100%',
        height: 40,
        marginTop:10,
        justifyContent: 'center',
        alignItems:'center'
    },
    btnSelected:{
        flex:3,
        height:25,
        borderRadius:10,
        backgroundColor:'#9600A1',
        alignItems:'center',
        justifyContent: 'center',
        marginLeft:'3.0%',
        marginRight: '3.0%',
        
    },
    btnCenterNotSelect:{
        flex:3,
        height:25,
        borderRadius:10,
        borderColor: '#9600A1',
        backgroundColor:'white',
        justifyContent: 'center',
        alignItems:'center',
        marginLeft:'3.0%',
        marginRight: '3.0%',
        borderWidth: 1,
    },
    btnNotSelected:{
        flex:3,
        height:25,
        borderRadius:10,
        borderColor: '#9600A1',
        backgroundColor:'white',
        alignItems:'center',
        justifyContent: 'center',
        marginLeft:'3.0%',
        marginRight: '3.0%',
        borderWidth: 1,
    },
    txtSelected:{
       color:'white'
    },
    txtNotSelected:{
        color:'#9600A1'
    },
    headerBackIcon: {
        color: '#130C38',
        fontSize: 20,
        marginLeft:10
    },
        viewContainImage:{
            width:'90%',
            margin:10,
            borderRadius:10,
            height:250,
            shadowColor: 'rgba(0,0,0,0.5)',
            shadowOffset: {
                width: 0,
                height: 1
            },
            shadowOpacity:0.5,
            //backgroundColor:'white',
            alignSelf:'center'

        },
       imgStyle:{
        //    borderTopLeftRadius:10,
        //    borderTopLeftRadius:10,
           borderRadius:10,
           height:150,
           alignSelf: 'center',
       },
       txtMin:{
        position:'absolute',
        right:2,
        top: 2,
        fontSize:12,
        color:'white',
       },
       
       textGrayLine:{
        fontSize:12,
        color: 'gray'
       },
       txtIluminates:{
        fontSize:12,
        color: '#20B8BE',
        marginRight:2,
        marginLeft:2
       },
});

export default class UserDetailView extends Component{
    constructor(props){
        super(props);
        this.state={
         dataUser : {},
        };
    }
    componentDidMount(){
        let dict = this.props.navigation.state.params.detailDict;
        this.setState({dataUser:dict});
        console.log( 'dict ----', dict);
    }
    handleBackAction() {
        this.props.navigation.navigate({ routeName: 'UsersList' })
    }
    render(){
        var name = '', designation = '',imgUser, bio = '';
        let dict = this.state.dataUser.userDetails;
        if(dict){
            if(dict.profile.firstName){
                name = dict.profile.firstName
             }
             if(dict.profile.lastName){
                name = name+' '+dict.profile.lastName;
             }
             imgUser =  <Thumbnail
             style={styles.imageUser}
             source={{uri: dict.profile.pictureURL || `https://ui-avatars.com/api/?name=${dict.profile.firstName}+${dict.profile.lastName}`}}/>
    
            if(dict.profile.title){
              designation = dict.profile.title;
            }
            if(dict.profile.bio){
              bio = dict.profile.bio
            }
        }
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
                    <CardSection>
                        <View style={styles.viewNamePhoto}>
                            {imgUser}
                            <View>
                                <Text style={styles.txtName}> {name} </Text>
                                <Text style={styles.txtDesignation}>  {designation} </Text>
                            </View>
                        </View>
                 </CardSection>
                 <CardSection>
                     <Text style={styles.txtDescription}>{bio}</Text>
                 </CardSection>
                
                 <View style={styles.viewBottomBtn}>
                <TouchableOpacity style={styles.btnSelected} >
                    <Text style={styles.txtSelected}>
                        Soggle
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnNotSelected} >
                    <Text style={styles.txtNotSelected}>
                        Projects
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnNotSelected} >
                    <Text style={styles.txtNotSelected}>
                        Blockchain
                    </Text>
                </TouchableOpacity>
                </View>
                </SafeAreaView>
        )
    }
    onClickSoggle(){
  
    }
    onClickProjects(){

    }
    onClickBlockchain(){

    }
}
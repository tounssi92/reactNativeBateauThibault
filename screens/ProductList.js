import React, { Component } from 'react'
import {  View, StyleSheet, Text, ImageBackground, ToastAndroid } from 'react-native'
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import List from '../components/List';
import { PricingCard } from 'react-native-elements';
import {connect} from 'react-redux';
import {addProduct, removeProduct} from "../store/actions/cartActions";
import   {bindActionCreators} from "redux"
import getRessources from "../services/apirest";
import {Header} from "react-native-elements"
import CartComponent from '../components/CartComponent';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from "../services/images";



export class  ProductList extends Component {

    constructor(props){
        super(props);
        this.state ={products : []};
    }


    componentDidMount(){
        getRessources('products')
        .then((value) => {
            this.setState({products : this.props.route.params.idCategorie == 3?
                value.data.filter(val => {
                    return val.sale==true
                }):
                value.data.filter(val => {
                    return val.category==this.props.route.params.idCategorie
                })
            })
        })
        .catch(err => {
            ToastAndroid.show("Votre requête est actuellement indisponible, veuillez réessayer ultérieurement", ToastAndroid.SHORT);
        })
    }

    addToCart(product){
        this.props.addProduct({quantity : 1,product : product});

    }

    removeFromCart(product){
        this.props.removeProduct(product);
    }

    toggleCart(element) {

        const arr = this.props.cartProducts.filter(value => value.product.id == element.id);
        if(arr && arr.length > 0){
            this.removeFromCart(arr[0]);
        } else {
            this.addToCart(element);
        }
    }

    goToHome(){
        this.props.navigation.navigate("Home");
    }

    isInCart(id){
        const boo = this.props.cartProducts.some(value => value.product.id == id);
        return boo ? <MaterialIcons name="remove-shopping-cart" size={28} color="orange" /> : <MaterialIcons name="shopping-cart" size={28} color="white" />;
    }

    render(){
        return (
            <SafeAreaView>

                <Header
                    containerStyle = {{backgroundColor: "black",height : 70, paddingBottom:25}}
                    rightComponent={<CartComponent products={this.props.cartProducts} navigation={this.props.navigation}/>}
                    leftComponent={<Entypo name="home" size={32} color="white" onPress={() => this.goToHome()} />}
                    centerComponent={<Text style={{fontSize: 32, color: 'white'}}>Products</Text>}
                />
                <ImageBackground source={images["background"]} style={styles.image}>


                    {
                        this.state.products && (
                            <List navigation={this.props.navigation} list={this.state.products.map( (product,i) => {
                                return (
                                    <View key={product.name+" "+i} style={styles.product}>
                                        <PricingCard
                                        containerStyle={{width:350,display:"flex",justifyContent:"center", borderRadius:10}}
                                        color="#4f9deb"
                                        title={product.name}
                                        price={product.price + "€"}
                                        info={[ product.comments,"Unité : "+product.unit ,product.availability ? "Disponible" : "Indisponible" ]}
                                        infoStyle={{color:"black"}}
                                        button={{ title: '', icon: this.isInCart(product.id), onButtonPress: () => this.toggleCart(product) }}  />
                                    </View>
                                )
                            })}/>
                        )
                    }
                </ImageBackground>
            </SafeAreaView>

        )
    }
}

const mapStateToProps = (state) => {
    return {cartProducts:state.cart.products};
}

const dispatch = (dispatch) => {
    return bindActionCreators({addProduct: addProduct, removeProduct: removeProduct},dispatch)
}

export default connect(mapStateToProps,dispatch)(ProductList);

const styles = StyleSheet.create({
    product :{
        padding: 3,
        marginLeft : 14
    },
    image: {
        resizeMode: "cover",
        height: "100%",
        justifyContent: "center"
      }
})

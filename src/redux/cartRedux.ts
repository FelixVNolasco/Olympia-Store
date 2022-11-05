import {createSlice} from '@reduxjs/toolkit'
import Swal from 'sweetalert2';

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        id: "",
        products: [],
        quantity: 0,
        total: 0
    },
    reducers: {
        addProduct: (state, action) => {
            const alreadyExistsProduct = () => {            
               if (state.products.find((product) => product._id === action.payload._id )) {
                console.log("El producto ya existe en el carrito de compras");
                return true;            
               } else {
                console.log("El producto todavía no existe");
                return false;
               }
            }
            const productExistence = alreadyExistsProduct();
            if(!productExistence) {
                if (action.payload.size !== "") {
                    state.quantity += 1;
                    state.products.push(action.payload)
                    state.total += action.payload.price * action.payload.quantity
                    Swal.fire({
                        icon: "success",
                        title: "Exito",
                        text: "Se ha agregado correctamente el/los producto(s)",
                    });
                } else {
                    Swal.fire({
                        icon: "warning",
                        title: "Advertencia",
                        text: "Debes escoger un número",
                    });
                }
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "Advertencia",
                    text: "Este producto ya existe en tu carrito de compras",
                });
            }
        },
        removeProduct: (state, action) => {
            //TODO: REMOVE ONLY SPECIFIC ELEMENT, NO FILTER THEM ALL
            (state.quantity === 0) ? state.quantity = 0 : state.quantity--;
            const nextProducts = state.products.filter(product => product._id !== action.payload._id);
            state.products = nextProducts;
            state.total -= action.payload.price * action.payload.quantity;
        },
        plusProduct: (state, action) => {
            const productIndex = state.products.findIndex(product => product._id === action.payload._id);
            if (state.products[productIndex].quantity >= 1) {
                state.products[productIndex].quantity += 1;
                state.total += state.products[productIndex].price * 1;
            }
        },
        restProduct: (state, action) => {
            const productIndex = state.products.findIndex(product => product._id === action.payload._id);
            if (state.products[productIndex].quantity > 1) {
                state.products[productIndex].quantity -= 1;
                state.total -= state.products[productIndex].price * 1;
            } else if (state.products[productIndex].quantity === 1) {
                (state.quantity === 0) ? state.quantity = 0 : state.quantity--;
                const nextProducts = state.products.filter(product => product._id !== action.payload._id);
                state.products = nextProducts;
                state.total -= action.payload.price * action.payload.quantity;
            }
        },
        cleanCart: (state, action) => {
            state.products = action.payload.products;
            state.quantity = action.payload.quantity;
            state.total = action.payload.total;
        }
    }
})

export const {addProduct, removeProduct, plusProduct, restProduct, cleanCart} = cartSlice.actions;
export default cartSlice.reducer;

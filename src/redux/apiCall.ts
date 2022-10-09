import Swal from 'sweetalert2';
import { SingleProductResponse } from '../interfaces/SingleProduct';
import { publicRequest, userRequest } from '../requestMethods';
import { logout } from './actions/auth';
import { removeLoading, setLoading } from "./uiRedux";
import { startFetching } from './userRedux';

export const getAllProducts = async (dispatch, category: any) => {
    dispatch(setLoading());
    try {
        const products: any = await publicRequest.get(category ? `/products?category=${category}` : '/products');
        const { data } = products;
        dispatch(removeLoading());
        return data;
    } catch (error) {
        dispatch(removeLoading());
        console.log(error);
    }
}

export const getUserPurchases = async (dispatch, id: string) => {
    dispatch(setLoading());
    try {
        const purchasesData = await userRequest.get(`/orders/find/${id}`, { params: { id: id } });
        const { data } = purchasesData;
        dispatch(removeLoading());
        return data;
    } catch (error) {
        dispatch(removeLoading());
        console.log(error);
    }
}


export const cancelPurchase = async (dispatch, id: string, _id: string, refreshPage) => {
    dispatch(setLoading());
    try {
        const response = await userRequest.delete(`/orders/${id}`, { params: { id: _id } });
        const { data } = response;
        dispatch(removeLoading());
        if (data === "Order has been deleted...") {
            Swal.fire({
                icon: "success",
                title: "Exito",
                text: "Tu compra ha sido cancelada correctamente",
                confirmButtonColor: "3085d6",
                confirmButtonText: "Ok",
                didClose: () => refreshPage()
            });
        }
    } catch (error) {
        dispatch(removeLoading());
        console.log(error);
    }
}

export const getSingleProduct = async (dispatch, productId: string) => {
    try {
        dispatch(startFetching());
        const product = await publicRequest.get(`/products/find/${productId}`) as SingleProductResponse;
        const { data } = product;
        return data;
    } catch (error) {
        dispatch(removeLoading());
        console.log(error);
    }
}

// export const getInfoUpdateUser = async(dispatch, id) => {
//     try {
//         dispatch(setLoading());        
//     } catch (error) {
//         dispatch(removeLoading());
//         Swal.fire({
//             icon: "error",
//             title: "Error",
//             text: "No ha sido posible obtener la información",
//         });
//     }
// }

export const updateUser = async (dispatch, values) => {
    try {
        dispatch(setLoading());
        await userRequest.put(`/users/${values.id}`, values);
        Swal.fire({
            icon: "success",
            title: "Exito",
            text: "Tu cuenta ha sido actualizada correctamente",
        });
        dispatch(removeLoading());
    } catch (error) {
        dispatch(removeLoading());
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No ha sido posible actualizar la cuenta",
        });
    }
}

export const deleteUser = async (dispatch, userId: string) => {
    try {
        dispatch(setLoading());
        await userRequest.delete(`/users/${userId}`);
        Swal.fire({
            icon: "success",
            title: "Exito",
            text: "Tu cuenta ha sido eliminada correctamente",
        });
        dispatch(logout());
        dispatch(removeLoading());
    } catch (error) {
        dispatch(removeLoading());
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No ha sido posible eliminar la cuenta",
        });
    }
}
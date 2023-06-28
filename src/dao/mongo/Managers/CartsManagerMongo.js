import cartModel from "../models/carts.js";
import mongoose from "mongoose";

export default class CartsManagerMongo {

   
     createCart = ()=>{
        return  cartModel.create({"products":[]})
    } 

    getCartsByID = (params)=>{
        return cartModel.findOne({'_id':params}).lean();
    }

    agregarProductCart = async (idCart,producto) =>{
        const cartBuscado =  await this.getCartsByID(idCart);
        if (!cartBuscado){
            return "no existe el carrito"
        }
        else
            {     
                const ProductoEncontrado = await cartModel.findOne({
                    _id: idCart,
                    products: { $elemMatch: { product: new mongoose.Types.ObjectId(producto.product)} }
                  });
                if (!ProductoEncontrado) {
                    await cartModel.updateOne(
                        {_id:idCart},                    
                        {$push:{products:{product:new mongoose.Types.ObjectId(producto.product),quantity:producto.quantity}}}                
                        )
                    return "se agrego el producto nuevo"
                }
                else{                  
                    
                    await cartModel.updateOne(
                      { _id:idCart, "products.product": new mongoose.Types.ObjectId(producto.product) },
                      { $inc: { "products.$.quantity": producto.quantity } }
                    );
                    return "se modifico el quantity"
                    
                }
                  
                

        }
    }

    eliminarProductCart = async (idCart,producto)=>{
        const cartBuscado =  await this.getCartsByID(idCart);
        if (!cartBuscado){
            return "no existe el carrito"
        }
        else{
            const ProductoEncontrado = await cartModel.findOne({
                _id: idCart,
                products: { $elemMatch: { product: new mongoose.Types.ObjectId(producto.product)} }
              });
              if (!ProductoEncontrado) {
                return "no existe el producto a eliminar en el carrito"
              }
              else{
                await cartModel.findOneAndUpdate(
                    { _id: idCart }, // Condición de búsqueda
                    { $pull: { products: { product: new mongoose.Types.ObjectId(producto.product) } } }, // Operador de actualización
                    { new: true } // Opciones
                  );
              }

        }
    }

    ModificarTodosProductCart = async (idCart,arregloProductos) =>{
        await cartModel.findOneAndUpdate(
            { _id: idCart }, // Condición de búsqueda
            { $set: { products: arregloProductos } }, // Operador de actualización con el nuevo arreglo
            { new: true } // Opciones
          );

    }

    ModificarQuantityProduct = async (idCart,producto) =>{
        const ProductoEncontrado = await cartModel.findOne({
            _id: idCart,
            products: { $elemMatch: { product: new mongoose.Types.ObjectId(producto.product)} }
          });
        if (!ProductoEncontrado) {
            return "no se encontro el producto a modificar"
         }
        else {
            await cartModel.findOneAndUpdate(
                { _id: idCart }, // Condición de búsqueda
                { $set: { "products.$[elem].quantity": producto.quantity } }, // Operador de actualización
                { 
                  new: true, // Opciones
                  arrayFilters: [{ "elem.product": new mongoose.Types.ObjectId(producto.product) }] // Filtro para actualizar solo el elemento correspondiente
                }
              );
        }
            
    }

    EliminarTodosProductCart = async (idCart) =>{
        await cartModel.findOneAndUpdate(
            { _id: idCart }, // Condición de búsqueda
            { $set: { products: [] } }, // Operador de actualización con el nuevo arreglo
            { new: true } // Opciones
          );

    }
}
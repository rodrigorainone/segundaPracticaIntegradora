import { Router } from "express";

import ProductManagerMongo from "../dao/mongo/Managers/ProductsManagerMongo.js";
import CartsManagerMongo from "../dao/mongo/Managers/CartsManagerMongo.js";

const prod = new ProductManagerMongo();
const cart = new CartsManagerMongo();
const router = Router();


router.post('/', async (req,res)=>{
    await cart.createCart();
    res.send({status:"success",message:"Cart added"})
} )
router.get('/:cid',async (req,res)=>{
    const aux = await cart.getCartsByID(req.params.cid).populate('products.product');
    if (!aux){
       return res.send("el producto no existe");
    }
    return res.send(aux);
})


router.post('/:cid/product/:pid', async (req,res)=>{
   const ProductId = await prod.getProductsByID(req.params.pid);
    if (ProductId!=='Not found'){
        const mensaje = await cart.agregarProductCart((req.params.cid),({"product":req.params.pid,"quantity":req.body.quantity || 1}))             
        return res.send({status:"success",message:mensaje})  
    }
    return res.send({status:"success",message:"Product no exist"})       

})

router.delete('/:cid/products/:pid',async (req,res)=>{
    const ProductId = await prod.getProductsByID(req.params.pid);
    if (ProductId!=='Not found'){
        const mensaje = await cart.eliminarProductCart((req.params.cid),({"product":req.params.pid}))             
        return res.send({status:"success",message:mensaje})  
    }
    return res.send({status:"success",message:"Product no exist"}) 
})

router.put('/:cid', async (req,res) =>{
   const CartId = await cart.getCartsByID(req.params.cid);
   if (!CartId){
    return res.send({status:"success",message:"no existe el carrito con los productos a modificar"})  
   }
   else{
        const datos = req.body;
        await cart.ModificarTodosProductCart(req.params.cid,datos);
        return res.send({status:"success",message:"los productos fueron modificados"})  
   }
})

router.put('/:cid/products/:pid',async (req,res)=>{
    const CartId = await cart.getCartsByID(req.params.cid);
    if (!CartId){
        return res.send({status:"no success",message:"el carrito no existe"})
    }
    else{   
        const ProductId = await prod.getProductsByID(req.params.pid);
         if (ProductId!=='Not found'){
            const mensaje = await cart.ModificarQuantityProduct((req.params.cid),({"product":req.params.pid,"quantity":req.body.quantity}))             
            return res.send({status:"success",message:mensaje})  
        }
        return res.send({status:"success",message:"Product no exist"}) 
    }
})

router.delete('/:cid', async (req,res) =>{
    const CartId = await cart.getCartsByID(req.params.cid);
    if (!CartId){
     return res.send({status:"success",message:"no existe el carrito con los productos a eliminar"})  
    }
    else{         
         await cart.EliminarTodosProductCart(req.params.cid);
         return res.send({status:"success",message:"los productos fueron eliminados"})  
    }
 })

export default router;
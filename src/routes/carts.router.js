import { Router } from "express";
import CartsManager from "../dao/fileSystem/Managers/CartsManager.js";
import ProductManager from "../dao/fileSystem/Managers/ProductManager.js";


const car = new CartsManager();
const productos = new ProductManager();
const router = Router();

router.post('/', async (req,res)=>{
    await car.createCart();
    res.send({status:"success",message:"Cart added"})
} )

router.get('/:cid', async (req,res)=>{
    await car.getCartById(req.params.cid)
    res.send(await car.getCartById(parseInt( req.params.cid)))
} )

router.post('/:cid/product/:pid', async (req,res)=>{
    const ProductId = await productos.getProductById(parseInt(req.params.pid));
    if (ProductId!=='Not found'){
        const mensaje = await car.agregarProductCart((parseInt(req.params.cid)),({"product":parseInt(req.params.pid),"quantity":req.body.quantity || 1}))             
        return res.send({status:"success",message:mensaje})  
    }
    return res.send({status:"success",message:"Product no exist"})   
    

})

export default router;
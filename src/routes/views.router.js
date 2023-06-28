import { Router } from "express";
import ProductManager from "../dao/fileSystem/Managers/ProductManager.js";

const router = Router();
const productos = new ProductManager();

router.get('/', async (req,res)=>{
    const product = await productos.getProducts();    
    res.render('home',{product,
    css:'home'})
})



router.get('/realtimeproducts', async (req,res)=>{       
    res.render('realTimeProducts',{
      css:'realtimeproducts'  
    });
})


export default router;
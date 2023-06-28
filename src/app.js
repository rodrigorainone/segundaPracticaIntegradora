import express from "express";
import session from 'express-session';
import handlebars from 'express-handlebars'
import {Server} from 'socket.io'
import productRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js"
import viewsRouterMongo from "./routes/viewsMongo.router.js"
import ProductManager from "./dao/fileSystem/Managers/ProductManager.js";
import productMongoRouter from "./routes/productsMongo.router.js"
import cartsMongoRouter from "./routes/cartsMongo.router.js"
import MongoStore from 'connect-mongo';
import mongoose from "mongoose";
import sessionsRouter from "./routes/session.router.js"
import ProductManagerMongo from "./dao/mongo/Managers/ProductsManagerMongo.js";
import registerChatHandler from "./listeners/chatHandler.js";
import passport from "passport";
import  initializePassport  from './config/passport.config.js';

import __dirname from './utils.js';


// const productos = new ProductManager();  /* lo comento pq son los de fileSystem*/
const productos = new ProductManagerMongo();

const app = express();
const connection = mongoose.connect("mongodb+srv://rodricjs22:Corega123@clustertuky.h1n5ekj.mongodb.net/ecommerce?retryWrites=true&w=majority")
const server = app.listen(8081,()=>console.log("listening puerto 8081"))

app.use(express.static(`${__dirname}/public`))
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine('handlebars',handlebars.engine())
app.set ('views',`${__dirname}/views`)
app.set ('view engine','handlebars')


app.use(session({
    // store: new fileStorage({path:`${__dirname}/sessions`, ttl: 15, retries:0 }),//time to live
    store: new MongoStore({
        mongoUrl:"mongodb+srv://rodricjs22:Corega123@clustertuky.h1n5ekj.mongodb.net/ecommerce?retryWrites=true&w=majority",
        ttl: 3600,
    }),
    secret:"CoderS3cretFelis",
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize());
initializePassport();

//app.use('/',viewsRouter)                                  los comento pq son los de file system
//app.use('/realtimeproducts',viewsRouter)
app.use('/',viewsRouterMongo)
//app.use('/api/products',productRouter);           lo comento pq es del file system
app.use('/api/products',productMongoRouter)
//app.use('/api/carts', cartsRouter)          lo comento pq es del filse system
app.use('/api/carts', cartsMongoRouter)
app.use('/api/sessions',sessionsRouter);

const io = new Server(server);

/* io.on ('connection',async socket=>{                              lo comento pq es el de file System
    console.log("Nuevo socket conectado")
    const prod = await productos.getProducts()
    socket.emit('productos',prod);
    
    socket.on('delete',async data=>{
        const mensaje = await productos.deleteProduct(data);
        socket.emit('dataEvent',mensaje)
        const prod = await productos.getProducts()
        socket.emit('productos',prod);
    })

    socket.on('addProduct',async data=>{
        const mensaje = await productos.addProduct(data)
        socket.emit('dataEvent',mensaje)
        const prod = await productos.getProducts()
        socket.emit('productos',prod);        
    })

}) */ 


io.on ('connection',async socket=>{                     /*estos son los de mongo */ 
    registerChatHandler(io,socket);                     
    console.log("Nuevo socket conectado")
    const prod = await productos.getProducts()
    socket.emit('productos',prod);
    
    socket.on('delete',async data=>{        
        await productos.deleteProduct(data);
        const mensaje = "se elimino";
        socket.emit('dataEvent',mensaje)
        const prod = await productos.getProducts()
        socket.emit('productos',prod);
    })

    socket.on('addProduct',async data=>{
        const mensaje = await productos.createProduct(data)       
        socket.emit('dataEvent',mensaje)
        const prod = await productos.getProducts()
        socket.emit('productos',prod);        
    })


   
})
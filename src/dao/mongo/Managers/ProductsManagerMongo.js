import productModel from "../models/product.js";
import mongoose from "mongoose";


export default class ProductManagerMongo {
    
    getProducts = (cantidad) => {
       return productModel.find().limit(cantidad).lean();
    }   

    getProductsPaginate = (page,limitQ,sortAux,categoryAux,disponibilidadAux) =>{
        let query = {};

        let priceOrd={}
        console.log(sortAux)
        if (sortAux !== undefined){
            priceOrd = {price: sortAux}
        }             
                
        if (categoryAux && disponibilidadAux) {
            query = { "category": categoryAux ,"status": disponibilidadAux };
        }
        else{
            if (categoryAux){
                query = { "category": categoryAux };
            }
            else
                if(disponibilidadAux){
                    query = {"status": disponibilidadAux}  
                }
        }

        return productModel.paginate(query,{page , limit:limitQ , lean:true , sort:  priceOrd })
    }

    getProductsBy = (params)=>{
        return productModel.findOne(params);
    }
    getProductsByID =  (id)=>{
        const idValido = new mongoose.Types.ObjectId(id);
        return productModel.findOne({'_id':idValido});
        
    }        
    

    createProduct = (product) => {
        
        return productModel.create(product);
    }

    updateProduct = (id,product)=>{
        const idValido = new mongoose.Types.ObjectId(id);
        return productModel.findByIdAndUpdate({'_id':idValido},{$set:product})
    }

    deleteProduct = (id)=>{
        const idValido = new mongoose.Types.ObjectId(id);
        return productModel.findOneAndDelete({_id:idValido});
    }

 }

  












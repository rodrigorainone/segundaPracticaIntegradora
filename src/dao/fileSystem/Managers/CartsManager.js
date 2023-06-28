import fs from 'fs'
import __dirname from '../../../utils.js';

class CartsManager {
    constructor (){
        this.path=`${__dirname}/files/archivoCarrito.json`;
        this.carts=[]
    }

    getCarts = async () =>{
        if (fs.existsSync(this.path)){
            const content = await fs.promises.readFile(this.path,'utf-8');            
            return JSON.parse(content);
         }
         return []     
    }

    createCart = async () =>{
        this.carts = await this.getCarts();

        const cart = {
            products : []
        }

        if(this.carts.length===0){
            cart.id = 1;
        }else{
            cart.id = this.carts[this.carts.length-1].id+1;
        }
        this.carts.push(cart)
        await fs.promises.writeFile(this.path,JSON.stringify(this.carts,null,'\t'))

    }

    getCartById = async (id) =>{
        this.carts = await this.getCarts();
        const cartPodId = this.carts.find(element => element.id === id)
        if (cartPodId===undefined){
            return 'Not found'
        }
        else
            {
                return cartPodId.products
            } 
    }

    agregarProductCart = async (id,producto)=>{        
        const cartIDprod = await this.getCartById(id);  // se fija si existe el carrito y obtiene los productos        
        if (cartIDprod!=='Not found'){            
            this.carts = await this.getCarts();
            const indexAgregar = this.carts.findIndex((element) => element.id  === id); // obtiene el index del carrito a modificar
            const productoCarritoIndex = cartIDprod.findIndex((prod) => prod.product === producto.product) // se fija si el producto ya existe en ese carrito
            if (productoCarritoIndex===-1){   // si no existe lo agrega al final 
                cartIDprod.push(producto)
                this.carts[indexAgregar].products = cartIDprod;  
                await fs.promises.writeFile(this.path,JSON.stringify(this.carts,null,'\t')) 
                return "producto agregado"
            }
            else{              
                cartIDprod[productoCarritoIndex].quantity += producto.quantity; // y le suma el quantity
                this.carts[indexAgregar].products = cartIDprod;
                await fs.promises.writeFile(this.path,JSON.stringify(this.carts,null,'\t')) 
                return "producto agregado"
            }         
        }
        else {
            return "no se encuentra el carrito"
        }

    }

}

export default CartsManager;
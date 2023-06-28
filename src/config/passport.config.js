import passport from "passport";
import local from "passport-local";
import userModel from "../dao/mongo/models/user.js";
import CartsManagerMongo from "../dao/mongo/Managers/CartsManagerMongo.js";
import UserManagerMongo from "../dao/mongo/Managers/UserManagerMongo.js";
import { createHash ,validatePassword} from "../utils.js";
import GithubStrategy from 'passport-github2'


const LocalStrategy = local.Strategy;
const cart = new CartsManagerMongo();
const user = new UserManagerMongo();

const initializePassport = () =>{
    passport.use('register',new LocalStrategy({passReqToCallback: true, usernameField:'email'},async (req,email,password,done)=>{
        try{
            const {first_name,last_name} = req.body;
            // corroba si el usuario ya existe
            const exists = await user.getUser({email})
            if (exists) return done(null,false,{message:"el usuario ya existe"});
            // si el usuario no existe , encriptamos la password
            const hasshedPassword = await createHash(password);
            //creamos el carrito
            const nuevoCart = await cart.createCart();
            // num 3 construimos el usuario

            const userAux = {
                first_name,
                last_name,
                email,
                cart:nuevoCart._id,
                password:hasshedPassword
        }
            const result = await user.createUser(userAux);
            // si todo salio bien
            done(null,result);
        }catch(error){
            done(error)
        }
    }))

    passport.use('login',new LocalStrategy({usernameField:'email'},async(email,password,done) => {
          
        let userAux2
    if (email==='adminCoder@coder.com' &&   password==='adminCod3r123' ){
        userAux2 = {
            id: 0,
            name: `Admin`,
            email: "...",
            role:'admin'
         }
        return done(null,userAux2)
    }
    const userAux = await user.getUser({email})
   
    if (!userAux) return done(null,false,{message:"credenciales incorrectas"});
    
    const isValidPassword = await validatePassword(password,userAux.password);

    if (!isValidPassword) return done(null,false,{message:"contraseña invalida"})
    // crea la session 
    userAux2 = {
        id:userAux._id,
        name: `${userAux.first_name} ${userAux.last_name}`,
        email: userAux.email,   
        role:userAux.role     
     }   
     done(null,userAux2);
    }))


    passport.use('github',new GithubStrategy({
        clientID:"Iv1.d2a3c6818c60574f",
        clientSecret:"86327e4ae6adf4caed4ac3d5739eb82c3849afe3",
        callbackURL:"http://localhost:8081/api/sessions/githubcallback"
    },async(accessToken,refreshToken,profile,done)=>{
        try {
            console.log(profile)
            
            const {name,login} = profile._json;
            let emailGitHub= `${login}@github.com`
            console.log(emailGitHub);
            const userAux = await user.getUser({email:emailGitHub});
            console.log(userAux)
            if(!userAux){
                const newUser = {
                    first_name:name,
                    email:emailGitHub,
                    password:''
                }
                const result = await user.createUser(newUser);
                return done(null,result);
            }
            done(null,userAux);
        } catch (error) {
            done(error);
        }
    } )) 

    passport.serializeUser(function(user,done){
        return done(null,user.id)
    })
    passport.deserializeUser(async function (id, done) {
        if(id===0){
            return done(null,{
                role:"admin",
                name:"ADMIN"
            })
        }
        const user = await userModel.findOne({ _id: id });
        return done(null, user);
      });


     
}

export default initializePassport;
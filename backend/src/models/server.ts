import express, {Application} from 'express'
import cors from 'cors'
import {User} from './user'
import routesUser from '../routes/user'
import routesSolicitud from '../routes/solicitud'

class Server {

    private app: Application
    private port: string
    

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3001';
        this.midlewares();  
        this.router();
        this.DBconnetc();
        this.listen();
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log("La aplicación se esta corriendo exitosamente en el puerto => "+ this.port)           
        })
    }

    router(){
        
        this.app.use(routesUser);
        this.app.use(routesSolicitud);
    }

    

    midlewares(){
        //Parseo BOdy
        this.app.use(express.json())
        this.app.use(cors())
    }

    async DBconnetc(){
        try {

            await User.sync(); 
            //await Servidor.sync(); 
            console.log("Conexion de DB exitoso");

        } catch (error) {
            console.log("Conexion de DB errorena => "+error);
            
        }
    }

    
}


export default Server
export class RespuestaServidor {
    msg:string;
    constructor(code:number) {
        switch (code) {
            case 500:
                this.msg = "Error interno del servidor, por favor intente de nuevo";
                break;

            case 404:
                this.msg =  "Recurso no encontrado";
                break;

            case 200://metodos get
                this.msg =  "Ok";
                break;
        
            case 201://metodos post
                this.msg =  "Elemento creado de forma correcta";    
                break;
            
            case 403:
                this.msg =  "Usted no tiene privilegios para acceder a este recurso";
                break;
            
            case 401:
                this.msg =  "Error de inicio de sesión";
                break;
            
            case 503:
                this.msg =  "Servicio no disponible, inténtelo más tarde";
                break;
            
            default:
                this.msg =  "No se puede conectar con el servidor"
                break;
        }
    }
    
    
}

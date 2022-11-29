export interface Usuarios {
    id?:string;
    nombres?:string;
    identificacion?:string;
    email?:string;
    estado?:boolean;
    sexo?:boolean;
    roles?:{id:string,nombre:string}[];
    cafeteria_id?:number;
    tipo?:number;
    direccion?:string;
    fecha?:Date;
    tipoIdentificacion?:string;
}

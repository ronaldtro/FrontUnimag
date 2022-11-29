export interface Disciplina{
    id?:number,
    nombre?:string,
    modalidad_id?:number,
    estado?:boolean,
    encargado : {tipoIdentificacion? : number,
        identificacion?:string,
        direccion?:string,
        nombre?:string,
        sexo?:boolean,
        fecha_nacimiento?:Date }
}
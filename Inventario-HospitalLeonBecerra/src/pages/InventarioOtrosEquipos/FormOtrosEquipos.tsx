/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, {Component } from 'react';
import { IonContent, IonToolbar, IonSelect, IonSelectOption, IonGrid, IonRow, IonCol, IonTitle, IonPage, IonAlert, IonItem, IonLabel, IonInput, IonText, IonTextarea, IonButtons, IonBackButton,/*, IonFooter, IonPage, IonTitle, IonToolbar*//*IonList, IonLabel, IonInput,IonToggle, IonRadio, IonCheckbox, IonItemOptions,IonItemSliding, IonItemOption*/IonList, IonButton, IonLoading} from '@ionic/react';
import { Redirect, /*RouteProps*/ } from 'react-router';
//import { RouteComponentProps } from 'react-router-dom';
import { withIonLifeCycle } from '@ionic/react';
//import {  InputNumber } from 'antd';


import AxiosOtrosEquipos from '../../services/AxiosOtrosEquipos';
import Autenticacion from '../InicioSesion/Autenticacion';

interface IState {
  nombre_tipo_otro_equipo:any,
  tipos_equipos:any,
  ip_anterior:any,
  id_ip_anterior:any,
  confirmacion_eliminar:any,
  seleccion:any,
  eliminar:any;
  eliminando:any;
  data:any;
  data_equipo_by_id:any;
  confirmacion:any; 
  guardar:any;
  redirectTo:any;
  incompleto:any; 
  redireccionar:any;
  cargando:any;
  campos_incompletos:any;
  error_servidor:any;
  marcas:any;
  childVisible:any;
  escaner:any;
  estado_anterior:any;
  existe_repetido:any;
  lista_direcciones_ip:any;
  lista_empleados:any;
  value:any,
  compentes: any
}

const tipos_memorias = [{id: 'DDR'},{id: 'DDR2'},{id: 'DDR3'},{id: 'DDR3/DDR4'},{id: 'DDR4'}];
const tipos_disco_duro = [{id: 'SSD'},{id: 'HDD'}];
let estados_equipos = [{id: 'Operativa'},{id: 'En revisión'},{id: 'Reparado'},{id: 'De baja'},{id: 'Disponible'}];

class FormOtrosEquipos extends Component<{} , IState> {
  private id:any;
  constructor(props: any) {
    super(props);
    this.state = {
        data:{},
        nombre_tipo_otro_equipo:"",
        confirmacion_eliminar:false,
        data_equipo_by_id:[],
        confirmacion: false,
        redirectTo: false,
        guardar:false,
        tipos_equipos:[],
        incompleto:false,
        redireccionar: false,
        eliminando: false,
        cargando:false,
        campos_incompletos:"",
        error_servidor:false,
        marcas:[],
        childVisible:false,
        escaner:false,
        existe_repetido: false,
        lista_direcciones_ip:[],
        lista_empleados: [],
        value:"",
        ip_anterior:"",
        id_ip_anterior:"",
        estado_anterior:"",
        seleccion: false,
        eliminar:false,
        compentes:[]
    }

  }

  ionViewWillEnter() {
    estados_equipos = [{id: 'Operativa'},{id: 'En revisión'},{id: 'Reparado'},{id: 'De baja'},{id: 'Disponible'}];
    this.mostrar_tipos_equipos();
    this.mostrar_marcas();
    this.mostrar_componentes();
    this.mostrar_direcciones_ip_libres();
    this.mostrar_empleados();
    this.fn();  
    if (this.id !== undefined){
      this.obtenerOtrosEquiposById();
      this.obtenerInfoExtra();
    }
  }

  private urlParameters: Array<any> = [];
  obtenerOtrosEquiposById = () =>{
    this.setState({
      cargando: true
    });
    AxiosOtrosEquipos.mostrar_dato_otro_equipo_by_id(this.id).then((res:any) => {
      this.setState({
        estado_anterior: (() => {
          switch (res.data[0].estado_operativo) {
            case 'D':   return 'Disponible';
            case 'ER': return  'En revisión';
            case 'O':  return  'Operativa';
            case 'R':  return  'Reparado';
            case 'B':  return  'De baja';
          }
        })()
      })

      let data_id = res.data[0];
      data_id.estado_operativo = this.state.estado_anterior;
      this.setState({
        data_equipo_by_id: data_id,
        data:{'printer': res.data[0]},
        cargando:false,
        value: res.data[0].numero_serie,
        ip_anterior: res.data[0].ip,
        id_ip_anterior: res.data[0].id_ip,
      });

    }).catch((err:any) => {
      this.setState({
        //cargando:false,
        error_servidor:true,
      });
    });
  }

  obtenerInfoExtra = () => {
    AxiosOtrosEquipos.info_extra(this.id).then((res:any) => {
      let json:any = this.state.data_equipo_by_id;
      for (let i in res.data){
        let data = res.data[i];
        if ((this.state.data_equipo_by_id.tipo_equipo === "memoria_ram") || (this.state.data_equipo_by_id.tipo_equipo === "disco_duro") ){
          if (data.campo === "tipo"){
            json.tipo_mem = data.dato
          }
          if (data.campo === "capacidad"){
            let capacidad_un:any = data.dato.split(" ");
            console.log(capacidad_un);
            json.capacidad = capacidad_un[0];
            json.un = capacidad_un[1];
          }
        }
        if (this.state.data_equipo_by_id.tipo_equipo === "procesador"){
          if (data.campo === "nucleos"){
            json.nucleo = data.dato
          }
          if (data.campo === "frecuencia"){
            json.frecuencia = data.dato
          }
        }
        
      }

      this.setState({
        data_equipo_by_id:json
      });
       
      console.log("extra data: ",res.data);
      console.log('Add: ',this.state.data_equipo_by_id);
    }).catch((err:any) => {
      this.setState({
        cargando:false,
        error_servidor:true,
      });
      console.log('Error 1');
    });
  }

  fn =()=>{
    if (document.URL.indexOf("edit") > 0) {
      let splitURL = document.URL.split("/");
      this.id= splitURL[splitURL.length-1];
      
    }
  }

  onChange = (e:any) => {
    this.setState({
      value : e.target.value
    })
  }

  onChangeInput = (e:any) =>{
    const { name, value } = e.target;
    let val = name.split(".");
    if (val[1] === 'ip' && value === this.state.ip_anterior){
      this.setState({
        seleccion:true
      })
    }else if (val[1] === 'ip' && value !== this.state.ip_anterior){
      this.setState({
        seleccion:false
      })
    }
    this.setState({
      data_equipo_by_id:{
            ...this.state.data_equipo_by_id,
                ...this.state.data_equipo_by_id[val[0]],
                [val[1]]: value
        }
    });
 
  }

  mostrar_direcciones_ip_libres() {
    AxiosOtrosEquipos.mostrar_direcciones_ip_libres().then((res: any) => {
        this.setState({
          lista_direcciones_ip : res.data
        });
        console.log('Lista: ',this.state.lista_direcciones_ip);
    }).catch((err: any) => {
        console.log(err);
    });
}

mostrar_componentes(){
  console.log('Tres');

  AxiosOtrosEquipos.mostrar_codigos().then((res:any) => {
    this.setState({
      compentes:res.data,
    }); 
    console.log("this.state.marcas: ",this.state.marcas);
  }).catch((err:any) => {
    this.setState({
      cargando:false,
      error_servidor:true,
    });
    console.log('Error 1');
  });
}

mostrar_marcas() {
  console.log('Dos');
  AxiosOtrosEquipos.mostrar_marcas().then((res:any) => {
    this.setState({
      marcas:res.data,
    }); 
    console.log("this.state.marcas: ",this.state.marcas);
  }).catch((err:any) => {
    this.setState({
      cargando:false,
      error_servidor:true,
    });
    console.log('Error 1');
  });
}

mostrar_tipos_equipos() {
  console.log('One');
  AxiosOtrosEquipos.mostrar_tipo_equipo().then((res:any) => {
    this.setState({
      tipos_equipos:res.data,
    }); 
    console.log("this.state.marcas: ",this.state.marcas);
  }).catch((err:any) => {
    this.setState({
      cargando:false,
      error_servidor:true,
    });
    console.log('Error 1');
  });
}

mostrar_empleados() {
  console.log('Cinco');

  AxiosOtrosEquipos.mostrar_empleados().then((res: any) => {
      this.setState({
        lista_empleados : res.data
      });
      //console.log("DATA:", res.data);
  }).catch((err: any) => {
      console.log(err);
  });
}

verificar2=()=>{
  this.setState({guardar:true})
}

  verificar=()=>{
    let json = this.state.data_equipo_by_id;
    console.log(json);
    //Si no tiene normal

    let lista_nombres_campos_comunes:any=["Tipo de equipo","Código","Número de serie","Modelo","Marca","Estado Operativo"];    
    let lista_nombres_campos_storage:any=["Tipo de equipo","Código","Número de serie","Modelo","Marca","Estado Operativo","Capacidad Almacenamiento","Tipo almacenamiento","Tipo de " ];
    let lista_nombres_campos_procesador:any=["Tipo de equipo","Código","Número de serie","Modelo","Marca","Estado Operativo","Núcleos","Frecuencia" ];
    let lista_nombres_campos_others:any=["Tipo de equipo","Nombre del tipo de equipo","Código","Número de serie","Modelo","Marca","Estado Operativo"];
    let lista_campos_completos_comunes:any=["tipo_equipo","codigo","numero_serie","modelo","id_marca","estado_operativo"];    
    let lista_campos_completos_storage:any=["tipo_equipo","codigo","numero_serie","modelo","id_marca","estado_operativo","capacidad","un","tipo_mem" ];
    let lista_campos_completos_procesador:any=["tipo_equipo","codigo","numero_serie","modelo","id_marca","estado_operativo","nucleos","frecuencia" ];
    let lista_campos_completos_others:any=["tipo_equipo","tipo",  "codigo","numero_serie","modelo","id_marca","estado_operativo"];

    if(json!==undefined){
      let lista_campos_ingresados: any=Object.keys(json);
      let lista_valores_imgresados: any=Object.values(json);
      let texto:string="";
      let valor_indice:number;
      let campo:string="";
      let campo_nombre_completo:string="";
      let valor_vacio: string="";
      if(this.state.data_equipo_by_id.tipo_equipo!=="disco_duro" && this.state.data_equipo_by_id.tipo_equipo!=="memoria_ram" && this.state.data_equipo_by_id.tipo_equipo!=="Otro"){
          // 8!==8 cantidad: 8         9-1!==8 cantidad: 9
          if ((json.hasOwnProperty('tipo_equipo')!==true || (json.tipo+'').trim()==='') ||
              (json.hasOwnProperty('codigo')!==true || (json.codigo+'').trim()==='' || json.codigo=== undefined) || 
              (json.hasOwnProperty('numero_serie')!==true || (json.numero_serie+'').trim()==='' ||  json.numero_serie=== undefined) || 
              (json.hasOwnProperty('modelo')!==true || (json.modelo+'').trim()==='' || json.modelo=== undefined) || 
              (json.hasOwnProperty('id_marca')!==true || (json.id_marca+'').trim()==='') || 
              (json.hasOwnProperty('estado_operativo')!==true || (json.estado_operativo+'').trim()==='')){
            console.log('Condición96');
            console.log('type: ',this.state.data_equipo_by_id.tipo_equipo);

            for(let i in lista_campos_completos_comunes){
              campo = lista_campos_completos_comunes[i]; //marca
              campo_nombre_completo = lista_nombres_campos_comunes[i];
              valor_indice = lista_campos_ingresados.indexOf(campo); // 2 veo si ese campo está en la lista,
              valor_vacio = (lista_valores_imgresados[valor_indice]+'').trim();  
              if (valor_indice<0 || valor_vacio==='' || lista_valores_imgresados[valor_indice]===undefined){ //Si el valor índice es menor que cero
                                   // no está ingresado ese campo
                  texto = texto+" "+campo_nombre_completo+",";
              }
            }
            if(texto.slice(-1)===','){
              texto=texto.slice(0,-1);
            }
            this.setState({
              campos_incompletos:texto,
              incompleto:true
            })
          }else{
          this.setState({guardar:true})
          //this.enviar();


        }
      }else if(this.state.data_equipo_by_id.tipo_equipo==="disco_duro" || this.state.data_equipo_by_id.tipo_equipo==="memoria_ram"){
        if ((json.hasOwnProperty('tipo_equipo')!==true || (json.tipo+'').trim()==='') ||
            (json.hasOwnProperty('codigo')!==true || (json.codigo+'').trim()==='' || json.codigo=== undefined) || 
            (json.hasOwnProperty('numero_serie')!==true || (json.numero_serie+'').trim()==='' ||  json.numero_serie=== undefined) || 
            (json.hasOwnProperty('modelo')!==true || (json.modelo+'').trim()==='' || json.modelo=== undefined) || 
            (json.hasOwnProperty('id_marca')!==true || (json.id_marca+'').trim()==='') || 
            (json.hasOwnProperty('estado_operativo')!==true || (json.estado_operativo+'').trim()==='') ||
            (json.hasOwnProperty('capacidad')!==true || (json.capacidad+'').trim()==='' || json.capacidad=== undefined) ||
            (json.hasOwnProperty('un')!==true || (json.un+'').trim()==='' || json.un=== undefined) ||
            (json.hasOwnProperty('tipo_mem')!==true || (json.tipo_mem+'').trim()==='' || json.tipo_mem=== undefined)){
            console.log('Condición96');
            console.log('tipo store: ',this.state.data_equipo_by_id.tipo_equipo);
            for(let i in lista_campos_completos_storage){
              campo = lista_campos_completos_storage[i]; //marca
              
              if (campo==='tipo_mem'){
                if (this.state.data_equipo_by_id.tipo_equipo==="disco_duro"){
                   campo_nombre_completo = 'Tipo de disco duro';
                }else{
                  campo_nombre_completo = 'Tipo de memoria ram';
                }
              }else{
                campo_nombre_completo = lista_nombres_campos_storage[i];
              }

              valor_indice = lista_campos_ingresados.indexOf(campo); // 2 veo si ese campo está en la lista,
              valor_vacio = (lista_valores_imgresados[valor_indice]+'').trim();
              if (valor_indice<0 || valor_vacio==='' || lista_valores_imgresados[valor_indice]===undefined){ //Si el valor índice es menor que cero
                                   // no está ingresado ese campo
                  
                  texto = texto+" "+campo_nombre_completo+",";
              }
            }
            if(texto.slice(-1)===','){
              texto=texto.slice(0,-1);
            }
            this.setState({
              campos_incompletos:texto,
              incompleto:true
            })
          }else{
          this.setState({guardar:true})
          //this.enviar();
        }
      
      }else if(this.state.data_equipo_by_id.tipo_equipo==="Otro"){
        console.log("This option");
        if ((json.hasOwnProperty('tipo_equipo')!==true || (json.tipo+'').trim()==='') ||
            (json.hasOwnProperty('tipo')!==true || (json.tipo+'').trim()==='' || json.tipo=== undefined) ||
            (json.hasOwnProperty('codigo')!==true || (json.codigo+'').trim()==='' || json.codigo=== undefined) || 
            (json.hasOwnProperty('numero_serie')!==true || (json.numero_serie+'').trim()==='' ||  json.numero_serie=== undefined) || 
            (json.hasOwnProperty('modelo')!==true || (json.modelo+'').trim()==='' || json.modelo=== undefined) || 
            (json.hasOwnProperty('id_marca')!==true || (json.id_marca+'').trim()==='') || 
            (json.hasOwnProperty('estado_operativo')!==true || (json.estado_operativo+'').trim()==='')){
            console.log('Condición96');
            console.log('type: ',this.state.data_equipo_by_id.tipo_equipo);
            for(let i in lista_campos_completos_others){
              campo = lista_campos_completos_others[i]; //marca
              campo_nombre_completo = lista_nombres_campos_others[i];
              valor_indice = lista_campos_ingresados.indexOf(campo); // 2 veo si ese campo está en la lista,
              valor_vacio = (lista_valores_imgresados[valor_indice]+'').trim();

              if (valor_indice<0 || valor_vacio==='' || lista_valores_imgresados[valor_indice] === undefined){ //Si el valor índice es menor que cero
                                   // no está ingresado ese campo
                  texto = texto+" "+campo_nombre_completo+",";
              }
            }
            if(texto.slice(-1)===','){
              texto=texto.slice(0,-1);
            }
            this.setState({
              campos_incompletos:texto,
              incompleto:true
            }) 
          }else{
          this.setState({guardar:true})
          //this.enviar();
        }
      }else if(this.state.data_equipo_by_id.tipo_equipo==="procesador"){
        if ((json.hasOwnProperty('tipo_equipo')!==true || (json.tipo+'').trim()==='') ||
            (json.hasOwnProperty('codigo')!==true || (json.codigo+'').trim()==='' || json.codigo=== undefined) || 
            (json.hasOwnProperty('numero_serie')!==true || (json.numero_serie+'').trim()==='' ||  json.numero_serie=== undefined) || 
            (json.hasOwnProperty('modelo')!==true || (json.modelo+'').trim()==='' || json.modelo=== undefined) || 
            (json.hasOwnProperty('id_marca')!==true || (json.id_marca+'').trim()==='') || 
            (json.hasOwnProperty('estado_operativo')!==true || (json.estado_operativo+'').trim()==='') ||
            (json.hasOwnProperty('nucleo')!==true || (json.nucleo+'').trim()==='' || json.nucleo=== undefined) ||
            (json.hasOwnProperty('frecuencia')!==true || (json.frecuencia+'').trim()==='' || json.frecuencia=== undefined)){
            console.log('Condición96');
            console.log('type: ',this.state.data_equipo_by_id.tipo_equipo);
            for(let i in lista_campos_completos_procesador){
              campo = lista_campos_completos_procesador[i]; //marca
              campo_nombre_completo = lista_nombres_campos_procesador[i];
              valor_indice = lista_campos_ingresados.indexOf(campo); // 2 veo si ese campo está en la lista,
              valor_vacio = (lista_valores_imgresados[valor_indice]+'').trim();
              if (valor_indice<0 || valor_vacio==='' || lista_valores_imgresados[valor_indice] === undefined){ //Si el valor índice es menor que cero
                                   // no está ingresado ese campo
                  texto = texto+" "+campo_nombre_completo+",";
              }
            }
            if(texto.slice(-1)===','){
              texto=texto.slice(0,-1);
            }
            this.setState({
              campos_incompletos:texto,
              incompleto:true
            }) 
          }else{
          this.setState({guardar:true})
          //this.enviar();
        }
      }

    }
  }


  accion = () =>{
    this.setState({eliminar:true});
  }

  eliminar = () =>{
    this.setState({
      eliminar:false,
      eliminando:true
    });
    AxiosOtrosEquipos.eliminar_otros_equipos(this.state.data_equipo_by_id.id_equipo).then((res:any) => {
      //console.log("RESPUESTA:",res.data);
      this.setState({
        eliminando:false,
        confirmacion_eliminar:true,
      });
    }).catch((err:any) => {
      this.setState({
        //cargando:false,
        error_servidor:true,
      });
    });
  }

  clone( obj:any ) {
    if ( obj === null || typeof obj  !== 'object' ) {
        return obj;
    }
    var temp = obj.constructor();
    for ( var key in obj ) {
        temp[ key ] = this.clone( obj[ key ] );
    }
    return temp;
}

  enviar=()=> {
    this.setState({
      guardar:false,
      cargando:true
    });
    let json = this.state.data_equipo_by_id;
    console.log("JSON ACTUALIZADO:",json);
    let json_datos_editados = this.clone(json);
    console.log('Before: ',json_datos_editados);
    console.log('After: ',json_datos_editados);
    if (json.estado_operativo === 'Disponible'){
      json_datos_editados.estado_operativo = 'D';
    }else if (json.estado_operativo === 'De baja'){
      json_datos_editados.estado_operativo = 'B';
    }else if (json.estado_operativo === 'Reparado'){
      json_datos_editados.estado_operativo = 'R';
    }else if (json.estado_operativo === 'En revisión'){
      json_datos_editados.estado_operativo = 'ER';
    }else if (json.estado_operativo === 'Operativa'){
      json_datos_editados.estado_operativo = 'O';
    }

    if(this.id===undefined){
      console.log('Creando equipo');
      this.setState({
        confirmacion:false
      }); 

    json_datos_editados.encargado_registro = Autenticacion.getEncargadoRegistro();


    AxiosOtrosEquipos.crear_otro_equipo(json_datos_editados).then(res => {
      console.log('res.data: ',res);
      if (res.status === 200){
        if (this.state.cargando===true){
          this.setState({
            confirmacion:false
          });          
        }
        this.setState({
          cargando:false,
          confirmacion:true,
        });
      }
    }).catch(err => {
      if (err.response){
        console.log("err: ",err.response.status);
        console.log("err: ",err.response);
        console.log("err: ",err.response.data.log.length); //47

        if (err.response.data.log.length===47){
          this.setState({
            cargando:false,
            existe_repetido:true,
          });  
        }else{
          this.setState({
            cargando:false,
            error_servidor:true,
          });
        }        
      }else{
        this.setState({
          cargando:false,
          error_servidor:true,
        });        
      }

      console.log('Error 2');
    });

  }else if(this.id!==undefined){
    console.log('Editando equipo');
    json_datos_editados.key = json.id_equipo;
    console.log('Actualizar: ',json_datos_editados);
    this.setState({
      cargando:true,
      confirmacion:false,
    });
    AxiosOtrosEquipos.editar_equipo(json_datos_editados).then(res => {  
        this.setState({
          cargando:false,
          confirmacion:true,
        });
    }).catch(err => {
      this.setState({
        cargando:false,
        error_servidor:true,
      });
      console.log('Error 2');
    });
  }
  }  

  render(){

    if (localStorage.userdata === undefined){
      return (<Redirect to="/iniciarsesion" />)
    }

    if (this.state.confirmacion===false && this.state.redireccionar===true) {
      return (<Redirect to="/consultaOtrosEquiposHome" />);      
    }
    return (      
      <IonPage>     
      <IonToolbar color="danger">
        <IonButtons slot="start">
            <IonBackButton defaultHref="/home"></IonBackButton>
        </IonButtons>
        <IonTitle >  {this.id!==undefined?'Editar otro equipo':'Registrar otros equipo'} </IonTitle>
        <IonButtons slot="end">
        {/*<IonButton hidden = {this.id===undefined?true:false} onClick = {this.accion} ><IonIcon icon={trash}></IonIcon></IonButton>*/}
        </IonButtons>
      </IonToolbar>
      <IonContent fullscreen>
      <IonAlert
        isOpen={this.state.eliminar}
        header={'Confirmación'}
        message={'¿Está seguro de eliminar este registro?'}
        buttons={[{text: 'Cancel',role: 'cancel',cssClass: 'danger',handler: (blah:any) => {this.setState({eliminar:false});}},{cssClass: 'success',text: 'Aceptar',handler: () => {console.log('Aceptar');this.eliminar();}}]}
      />

      <IonAlert
            isOpen={this.state.existe_repetido}
            header={'Información repetida'}
            message={'El código ya existe en la base de datos'}
            buttons={[              
              {
                cssClass: 'success',
                text: 'Aceptar',
                handler: () => {
                  console.log('Aceptar');
                  this.setState({ existe_repetido: false});
                }
              },
            ]}
          />

          <IonAlert
            isOpen={this.state.confirmacion}
            header={'Guardado con éxito'}
            message={'El registro ha sido guardado satisfactoriamente'}
            buttons={[              
              {
                cssClass: 'success',
                text: 'Aceptar',
                handler: () => {
                  console.log('Aceptar');
                  this.setState({ confirmacion: false, redireccionar:true });
                }
              },
            ]}
          />

      <IonAlert
        isOpen={this.state.confirmacion_eliminar}
        header={'Registro eliminado'}
        message={'El registro ha sido eliminado satisfactoriamente'}
        buttons={[              
          {
            cssClass: 'success',
            text: 'Aceptar',
            handler: () => {
              console.log('Aceptar');
              this.setState({ confirmacion_eliminar: false,redireccionar:true});
            }
          },
        ]}
      />

      <IonAlert
        isOpen={this.state.guardar}
        header={'Confirmación'}
        message={this.id!==undefined?'¿Desea guardar los nuevos cambios?':'¿Está seguro de agregar este nuevo registro?'}
        buttons={[         
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'danger',
            handler: (blah:any) => {
              this.setState({
                guardar:false
              });
            }
          },
          {
            cssClass: 'success',
            text: 'Aceptar',
            handler: () => {
              console.log('Aceptar');
              this.enviar();              
            }
          }        
        ]}
      />
      <IonAlert
        isOpen={this.state.error_servidor}
        subHeader={'Error en el servidor'}
        message={'Intente de nuevo o más trade'}
        buttons={[
          {
            cssClass: 'success',
            text: 'OK',
            handler: () => {
              console.log('ERROR 46');
              this.setState({
                error_servidor:false          
              });
            }
          }
        ]}
      />
      <IonLoading
          isOpen={this.state.cargando}
          message={this.id!==undefined?'Cargando datos. Espere por favor...':'Registrando Información. Espere por favor...'}
      />
      <IonAlert
        isOpen={this.state.incompleto}
        subHeader={'Faltan ingresar este/os campo/s:'}
        message={this.state.campos_incompletos}
        buttons={[          
          {
            text: 'Ok',
            handler: () => {
              console.log('Aceptar');
              this.setState({
                campos_incompletos:"",
                incompleto:false                
              });
            }
          },
        ]}
      />

        <form>        
        <IonGrid>
          <IonRow class="ion-text-center">
            <IonCol>
              <img src="./assets/img/variosequipos5.png" alt=""/>
            </IonCol>
            <IonCol>               
              <IonList>
               

                <IonItem>
                <IonLabel position="stacked">Tipo de equipo <IonText color="danger">*</IonText></IonLabel>
                  <IonSelect disabled = {this.id!==undefined?true:false} name="equipo.tipo_equipo"
                            value = {this.state.data_equipo_by_id.tipo_equipo} 
                            onIonChange={(e:any)=>{this.onChangeInput(e);/*this.onClick()*/}}>
                    
                   

                    {this.state.tipos_equipos.map((object:any, i:any) => {
                      
                      return (
                        <IonSelectOption key={object.tipo_equipo} value={object.tipo_equipo}>
                          {
                            object.tipo_equipo === "case"?
                            'Case':null
                          }
                          {
                            object.tipo_equipo === "CPU"?
                            'CPU':null
                          }
                          {
                            object.tipo_equipo === "Mouse"?
                            'Mouse':null
                          }
                          {
                            object.tipo_equipo === "Monitor"?
                            'Monitor':null
                          }
                          {
                            object.tipo_equipo === "Teclado"?
                            'Teclado':null
                          }
                          {
                            object.tipo_equipo === "disco_duro"?
                            'Disco duro':null
                          }
                          {
                            object.tipo_equipo === "fuente_poder"?
                            'Fuente de poder':null
                          }
                          {
                            object.tipo_equipo === "memoria_ram"?
                            'Memoria RAM':null
                          }
                          {
                            object.tipo_equipo === "parlantes"?
                            'Parlantes':null
                          }
                          {
                            object.tipo_equipo === "procesador"?
                            'Procesador':null
                          }
                          {
                            object.tipo_equipo === "regulador"?
                            'Regulador':null
                          }
                          {
                            object.tipo_equipo === "tarjeta_madre"?
                            'Tarjeta madre': null
                          }
                          {
                            object.tipo_equipo === "tarjeta_red"?
                            'Tarjet de red': null
                          }
                          {
                            object.tipo_equipo === "ups"?
                            'UPS': null
                          }
                          
                        </IonSelectOption>
                      );
                    })}
                     <IonSelectOption value={"Otro"}>
                      Otro
                          </IonSelectOption>
                  </IonSelect>
                </IonItem>            
              </IonList>
            </IonCol>
          </IonRow>  
          <IonRow>
            <IonCol>

            {this.state.data_equipo_by_id.tipo_equipo === "Otro" ?
                            <IonItem>
                            <IonLabel position="stacked">Nombre del tipo de equipo<IonText color="danger">*</IonText></IonLabel>
                            <IonInput required disabled = {this.id!==undefined?true:false} value = {this.state.data_equipo_by_id.tipo} onIonChange={this.onChangeInput} name="equipo.tipo" type="text" ></IonInput>
                        </IonItem>
                            : null
            }

              <IonItem>
                <IonLabel position="stacked">Código <IonText color="danger">*</IonText></IonLabel>
                <IonInput required disabled = {this.id!==undefined?true:false} value = {this.state.data_equipo_by_id.codigo} onIonChange={this.onChangeInput} name="equipo.codigo" type="text" ></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Número de serie <IonText color="danger">*</IonText></IonLabel>
                <IonInput required disabled = {this.id!==undefined?true:false} type="text" name="equipo.numero_serie" value = {this.state.data_equipo_by_id.numero_serie} onIonChange={this.onChangeInput} ></IonInput>
              </IonItem> 
              <IonList lines="full" class="ion-no-margin ion-no-padding">
    
              <IonItem>
                <IonLabel position="stacked">Modelo <IonText color="danger">*</IonText></IonLabel>
                <IonInput required onIonChange={this.onChangeInput} value = {this.state.data_equipo_by_id.modelo} name="equipo.modelo" type="text" ></IonInput>
              </IonItem>

              <IonItem>
                  <IonLabel position="stacked">Marca <IonText color="danger">*</IonText></IonLabel>
                  <IonSelect name="printer.id_marca" value = {this.state.data_equipo_by_id.id_marca} onIonChange={this.onChangeInput} >

                  {this.state.marcas.map((object:any, i:any) => {
                      return (
                        <IonSelectOption key={object.id_marca} value={object.id_marca}>
                          {object.marca} 
                        </IonSelectOption>
                      );
                    })}
                    </IonSelect>


                </IonItem>

  
                <IonItem>
                  <IonLabel position="stacked">Estado <IonText color="danger">*</IonText></IonLabel>
                    <IonSelect name="printer.estado_operativo" value = {this.state.data_equipo_by_id.estado_operativo} onIonChange={this.onChangeInput} >                    
                    
                    {estados_equipos.map((object, i) => {
                      return (
                        <IonSelectOption key={object.id} value={object.id}>
                          {object.id}
                        </IonSelectOption>
                      );
                    })}
                  </IonSelect>
                  </IonItem>


              

              

            {this.state.data_equipo_by_id.tipo_equipo === "disco_duro" || this.state.data_equipo_by_id.tipo_equipo === "memoria_ram"?
              <div>
              <IonItem>
                <IonLabel position="stacked">Capacidad de Almacenamiento<IonText color="danger">*</IonText></IonLabel>
                <IonInput required disabled={false} type="number" value={this.state.data_equipo_by_id.capacidad} name="equipo.capacidad" onIonChange={this.onChangeInput}></IonInput>
              </IonItem>
              <IonItem>
              <IonLabel position="stacked">Tipo de Almacenamiento<IonText color="danger">*</IonText></IonLabel>
              <IonSelect disabled={false} value={this.state.data_equipo_by_id.un} className="" name='equipo.un' onIonChange={this.onChangeInput}>
                  <IonSelectOption value={"MB"}>MB (MegaByte)</IonSelectOption>
                  {this.state.data_equipo_by_id.tipo_equipo === "disco_duro"?
                    <IonSelectOption value={"TB"}>TB (TeraByte)</IonSelectOption>:
                    null
                  }
                  <IonSelectOption value={"GB"}>GB (GigaByte)</IonSelectOption>

              </IonSelect>
          </IonItem>
            </div>:null
            }
            {this.state.data_equipo_by_id.tipo_equipo === "memoria_ram"?
              <IonItem>
                <IonLabel position="stacked">Tipo de memoria <IonText color="danger">*</IonText></IonLabel>
                  <IonSelect name="equipo.tipo_mem" value = {this.state.data_equipo_by_id.tipo_mem} onIonChange={this.onChangeInput} >                    
                  
                  {tipos_memorias.map((object, i) => {
                    return (
                      <IonSelectOption key={object.id} value={object.id}>
                        {object.id}
                      </IonSelectOption>
                    );
                  })}
                </IonSelect>
              </IonItem>:null
            }
            {
              this.state.data_equipo_by_id.tipo_equipo === "disco_duro"?
              <IonItem>
                  <IonLabel position="stacked">Tipo disco duro <IonText color="danger">*</IonText></IonLabel>
                    <IonSelect name="equipo.tipo_mem" value = {this.state.data_equipo_by_id.tipo_mem} onIonChange={this.onChangeInput} >                    
                    
                    {tipos_disco_duro.map((object, i) => {
                      return (
                        <IonSelectOption key={object.id} value={object.id}>
                          {object.id}
                        </IonSelectOption>
                      );
                    })}
                  </IonSelect>
              </IonItem>:null
            }

            {
              this.state.data_equipo_by_id.tipo_equipo === "procesador"?
              <IonRow>
              <IonCol>
                <IonItem>
                    <IonLabel position="stacked">Núcleos<IonText color="danger">*</IonText></IonLabel>
                    <IonInput required disabled={false} type="number" value={this.state.data_equipo_by_id.nucleo} name='equipo.nucleo' onIonChange={this.onChangeInput}></IonInput>
                </IonItem>
              </IonCol>
              <IonCol>
                <IonItem>
                    <IonLabel position="stacked">Frecuencia<IonText color="danger">*</IonText></IonLabel>
                    <IonInput required disabled={false} type="number" value={this.state.data_equipo_by_id.frecuencia} name='equipo.frecuencia' onIonChange={this.onChangeInput}></IonInput>
                </IonItem>  
              </IonCol>
            </IonRow>:null
            }
                  {
                  this.id===undefined?
                  <IonItem>
                    <IonLabel position="stacked">Dirección IP</IonLabel>
                    <IonSelect name="printer.ip" onIonChange={this.onChangeInput}>
                        <IonSelectOption value={null}>
                            Ninguno
                                </IonSelectOption>
                        {this.state.lista_direcciones_ip.map((object: any, i: any) => {
                            return (
                                <IonSelectOption key={object.id_ip} value={object.id_ip}>
                                    {object.direccion_ip}
                                </IonSelectOption>
                            );
                        })}
                    </IonSelect>
                </IonItem>:
                <IonItem>
                <IonLabel position="stacked">Dirección IP</IonLabel>
                <IonSelect name="printer.ip" value = {this.state.data_equipo_by_id.ip} onIonChange={this.onChangeInput}>
                      {
                        this.state.ip_anterior === null?
                        <IonSelectOption value ={null}>
                          Ninguno
                        </IonSelectOption>:
                        <div>
                          <IonSelectOption value={null}>
                            Ninguno
                          </IonSelectOption>
                          <IonSelectOption value={this.state.ip_anterior}>
                         {this.state.ip_anterior}
                        </IonSelectOption>
                        </div>
                      }
                      
                    {this.state.lista_direcciones_ip.map((object: any, i: any) => {
                        return (
                            <IonSelectOption key={object.id_ip} value={object.direccion_ip}>
                                {object.direccion_ip}
                            </IonSelectOption>
                        );
                    })}
                </IonSelect>
            </IonItem>
      
                }


                <IonItem>
                  <IonLabel position="stacked">Asignar a componente principal <IonText color="danger"></IonText></IonLabel>
                  <IonSelect name="printer.componente_principal" value = {this.state.data_equipo_by_id.componente_principal} onIonChange={this.onChangeInput} >
                  <IonSelectOption value={null}>Ninguno</IonSelectOption>

                  {this.state.compentes.map((object:any, i:any) => {
                      return (
                        <IonSelectOption key={object.id} value={object.id}>
                          {object.dato} 
                        </IonSelectOption>
                      );
                    })}
                    </IonSelect>


                </IonItem>



                <IonItem>
                    <IonLabel position="stacked">Asignar equipo a empleado</IonLabel>
                    <IonSelect name="printer.asignado" value = {this.state.data_equipo_by_id.asignado} onIonChange={this.onChangeInput}>
                    <IonSelectOption value={null}>Ninguno</IonSelectOption>
                        {this.state.lista_empleados.map((object: any, i: any) => {
                            return (
                                <IonSelectOption key={object.id} value={object.id}>
                                    {object.nombre + " " + object.apellido}
                                </IonSelectOption>
                            );
                        })}
                    </IonSelect>
                </IonItem>

                 <IonItem>
                  <IonLabel position="stacked">Descripción</IonLabel>
                  <IonTextarea value = {this.state.data_equipo_by_id.descripcion} onIonChange={this.onChangeInput} name="printer.descripcion"></IonTextarea>
                </IonItem>

                
                <div>
                 
                
                
                {
                  this.state.escaner? <IonItem>
                  <IonLabel position="stacked">Rodillo<IonText color="danger">*</IonText></IonLabel>
                  <IonInput required onIonChange={this.onChangeInput} value = {this.state.data_equipo_by_id.rodillo} name="printer.rodillo" type="text" ></IonInput>
                  </IonItem>: null
                }
                

                </div>
                <IonLoading
                  isOpen={this.state.eliminando}
                  message={'Eliminando registro. Espere por favor...'}
                />
            </IonList>
            </IonCol>
          </IonRow>   
          <IonRow class="ion-text-center">
            <IonCol>
                      <IonButton onClick={this.verificar} color="success" class="ion-no-margin">{this.id!==undefined?'Guardar cambios':'Guardar'}</IonButton>
            </IonCol>
            <IonCol>
              <IonButton onClick={(e:any)=>{this.setState({guardar: true, redireccionar:true})}} color="danger" class="ion-no-margin">Cancelar</IonButton>          
            </IonCol>
          </IonRow>  
        </IonGrid>
        </form>
      </IonContent>
      </IonPage>
    );
  }        
}

export default withIonLifeCycle(FormOtrosEquipos);
import {
  IonItem,  IonLabel, IonButton, IonIcon,IonAvatar, IonList, IonAlert, IonLoading, IonModal, IonToolbar, IonContent, IonButtons, IonTitle, IonRippleEffect, IonNote
 } from '@ionic/react';
 import { trash, create, close, key, paper, speedometer, appstore, list, albums, calendar, person, bulb, archive, informationCircle } from 'ionicons/icons';
 //import { Link, Redirect } from 'react-router-dom';


 import React from 'react';
 
 interface IOtrosEquipos {
  id_equipo:string,
  fecha_registro:string,
  estado_operativo: string;
  codigo: string;
  tipo_equipo: string,
  modelo: string,
  descripcion: string,
  numero_serie:string;
  id_marca: string,
  encargado_registro:string,
  componente_principal:string,
  ip: string,
  asignado: string,
  marca: string;
  empleado: string,
  apellido: string,
  encargado: string,
  principal: string,
  direccion_ip:string,
  onRemove: any
 }

 interface estados {
  ventanaDetalle: boolean,
  guardar: boolean,
  cargando: boolean,
  confirmacion: boolean
}

 class ListaOtrosEquipos extends React.Component<IOtrosEquipos, estados, {history:any}>  {

  constructor(props: any) {
    super(props);
    this.state = {
      ventanaDetalle: false,
      guardar:false,
      cargando:false,
      confirmacion:false
    }
  }

  verificar =() =>{
    this.setState({guardar:true})
  }

  
   _remove(){
    if(this.props.onRemove)
        this.props.onRemove();
  }
 
 render(){
   return ( 
            <IonList>
            <IonItem className = "ion-activatable">
              <IonLabel key={this.props.id_equipo} onClick={() => this.setState({ ventanaDetalle: true })}>
                
              <IonRippleEffect></IonRippleEffect>
                <h2><b>{this.props.codigo}</b></h2>
                {
                  this.props.estado_operativo==='D'?
                    <h3>Estado: Disponible</h3>
                  :null
                }
                {
                  this.props.estado_operativo==='B'?
                    <h3>Estado: De baja</h3>
                  :null
                }
                {
                  this.props.estado_operativo==='R'?
                    <h3>Estado: Reparado</h3>
                  :null
                }
                {
                  this.props.estado_operativo==='ER'?
                    <h3>Estado: En revisión</h3>
                  :null
                }
                {
                  this.props.estado_operativo==='O'?
                    <h3>Estado: Operativa</h3>
                  :null
                }
                <p>Marca: {this.props.marca}</p>
              </IonLabel>


              <IonAvatar slot="start"> 
                        {
                        this.props.estado_operativo === 'D'  ? <img src="./assets/img/otros/D.png"  alt="D" /> : 
                        this.props.estado_operativo === 'R'  ? <img src="./assets/img/otros/R.png"  alt="R" /> : 
                        this.props.estado_operativo === 'ER' ? <img src="./assets/img/otros/ER.png" alt="ER" /> :
                        this.props.estado_operativo === 'O'  ? <img src="./assets/img/otros/O.png"  alt="O" /> :
                                                     <img src="./assets/img/otros/B.png"  alt="B" />
                        }
                    </IonAvatar> 
              <IonButton size="default" fill="clear" routerLink={"/formotrosequipos/edit/"+this.props.id_equipo} color="secondary" ><IonIcon color="medium" icon={create}></IonIcon></IonButton>
              {
                this.props.estado_operativo === "B" ? <IonButton disabled size="default" color="primary" fill="clear" onClick={this._remove.bind(this)}><IonIcon color="medium" icon={trash}></IonIcon></IonButton>:
                <IonButton size="default" color="primary" fill="clear" onClick={this._remove.bind(this)}><IonIcon color="medium" icon={trash}></IonIcon></IonButton>
              }                                           
            </IonItem>
<IonModal
          isOpen={this.state.ventanaDetalle}
          onDidDismiss={e => this.setState({ ventanaDetalle: false })}>
          <IonToolbar color="primary">
            <IonTitle>Detalle equipo</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() =>this.setState({ ventanaDetalle: false })}><IonIcon icon={close}></IonIcon></IonButton>
            </IonButtons>
          </IonToolbar>
          <IonContent>

            <IonList>
              <IonItem>
                <IonIcon slot="start" icon={key}></IonIcon>
                <IonLabel>Código</IonLabel>
                <IonNote slot="end">{this.props.codigo}</IonNote>
              </IonItem>
              <IonItem>
                <IonIcon slot="start" icon={paper}></IonIcon>
                <IonLabel>Número de serie</IonLabel>
                <IonNote slot="end">{this.props.numero_serie}</IonNote>
              </IonItem>

              <IonItem>
                <IonIcon slot="start" icon={speedometer}></IonIcon>
                <IonLabel>Estado</IonLabel>
                <IonNote slot="end">
                  {
                  (() => {
                    switch (this.props.estado_operativo) {
                      case 'D':   return 'Disponible';
                      case 'ER': return  'En revisión';
                      case 'O':  return  'Operativa';
                      case 'R':  return  'Reparado';
                      case 'B':  return  'De baja';
                    }
                  })()
                  }
                </IonNote>
              </IonItem>
                
              <IonItem>
                <IonIcon slot="start" icon={appstore}></IonIcon>
                <IonLabel>Tipo</IonLabel>
                <IonNote slot="end">
                  {
                    this.props.tipo_equipo === "case"?
                    'Case':null
                  }
                  {
                    this.props.tipo_equipo === "CPU"?
                    'CPU':null
                  }
                  {
                    this.props.tipo_equipo === "Mouse"?
                    'Mouse':null
                  }
                  {
                    this.props.tipo_equipo === "Monitor"?
                    'Monitor':null
                  }
                  {
                    this.props.tipo_equipo === "Teclado"?
                    'Teclado':null
                  }
                  {
                    this.props.tipo_equipo === "disco_duro"?
                    'Disco duro':null
                  }
                  {
                    this.props.tipo_equipo === "fuente_poder"?
                    'Fuente de poder':null
                  }
                  {
                    this.props.tipo_equipo === "memoria_ram"?
                    'Memoria RAM':null
                  }
                  {
                    this.props.tipo_equipo === "parlantes"?
                    'Parlantes':null
                  }
                  {
                    this.props.tipo_equipo === "procesador"?
                    'Procesador':null
                  }
                  {
                    this.props.tipo_equipo === "regulador"?
                    'Regulador':null
                  }
                  {
                    this.props.tipo_equipo === "tarjeta_madre"?
                    'Tarjeta madre': null
                  }
                  {
                    this.props.tipo_equipo === "tarjeta_red"?
                    'Tarjet de red': null
                  }
                  {
                    this.props.tipo_equipo === "ups"?
                    'UPS': null
                  }</IonNote>
              </IonItem>

              <IonItem>
                <IonIcon slot="start" icon={list}></IonIcon>
                <IonLabel>Modelo</IonLabel>
                <IonNote slot="end">{this.props.modelo}</IonNote>
              </IonItem>

              <IonItem>
                <IonIcon slot="start" icon={albums}></IonIcon>
                <IonLabel>Marca</IonLabel>
                <IonNote slot="end">{this.props.marca}</IonNote>
              </IonItem>

              <IonItem>
                <IonIcon slot="start" icon={calendar}></IonIcon>
                <IonLabel>Fecha registro</IonLabel>
                <IonNote slot="end">{this.props.fecha_registro}</IonNote>
              </IonItem>

              
              <div>
            {
                this.props.empleado!==null? 
                <div>
                  <IonItem>
                    <IonIcon slot="start" icon={person}></IonIcon>
                    <IonLabel>Asignado</IonLabel>
                    <IonNote slot="end">{this.props.empleado + ' ' + this.props.apellido}</IonNote>
                  </IonItem>
                </div>
                : 
                <div>
                  <IonItem>
                    <IonIcon slot="start" icon={person}></IonIcon>
                    <IonLabel>Asignado</IonLabel>
                    <IonNote slot="end">N/A</IonNote>
                  </IonItem>
                </div>
               }
            </div>

            <div>
            {
                (this.props.direccion_ip!==null && this.props.direccion_ip!=='' && this.props.direccion_ip!==' ')? 

              <IonItem>
                <IonIcon slot="start" icon={bulb}></IonIcon>
                <IonLabel>Dirección IP</IonLabel>
                <IonNote slot="end">{this.props.direccion_ip}</IonNote>
              </IonItem>
  

                : 


              <IonItem>
                <IonIcon slot="start" icon={bulb}></IonIcon>
                <IonLabel>Dirección IP</IonLabel>
                <IonNote slot="end">N/A</IonNote>
              </IonItem>
  
               }
            </div>

            <div>
            {
                (this.props.principal!==null && this.props.principal!=='' && this.props.principal!==' ')? 


              <IonItem>
                <IonIcon slot="start" icon={archive}></IonIcon>
                <IonLabel>Principal</IonLabel>
                <IonNote slot="end">{this.props.principal}</IonNote>
              </IonItem>
  
            
                :
                
              <IonItem>
                <IonIcon slot="start" icon={archive}></IonIcon>
                <IonLabel>Principal</IonLabel>
                <IonNote slot="end">N/A</IonNote>
              </IonItem>
  
               }
            </div>

            <div>
            {

                

                this.props.descripcion!==null && this.props.descripcion!=='' && this.props.descripcion!==' '? 
                <IonItem>
                  <IonIcon slot="start" icon={informationCircle}></IonIcon>
                  <IonLabel>Descripción</IonLabel>
                  <IonNote slot="end">{this.props.descripcion}</IonNote>
                </IonItem>
                  : 

                <IonItem>
                  <IonIcon slot="start" icon={informationCircle}></IonIcon>
                  <IonLabel>Descripción</IonLabel>
                  <IonNote slot="end">N/A</IonNote>
                </IonItem>
    

               }
            </div>
            


              
            </IonList>
            
            </IonContent>
        </IonModal>


      <IonAlert
        isOpen={this.state.guardar}
        header={'Confirmación'}
        message={'¿Está seguro de eliminar este registro?'}
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
              //this._remove.bind(this);              
            }
          }        
        ]}
      />

      <IonLoading
          isOpen={this.state.cargando}
          message={'Eliminando registro. Espere por favor...'}
      />

      <IonAlert
            isOpen={this.state.confirmacion}
            header={'Registro eliminado'}
            message={'El registro ha sido eliminado satisfactoriamente'}
            buttons={[              
              {
                cssClass: 'success',
                text: 'Aceptar',
                handler: () => {
                  console.log('Aceptar');
                  this.setState({ confirmacion: false});
                }
              },
            ]}
          />
            </IonList>
   );
 }
 }

 export default ListaOtrosEquipos;
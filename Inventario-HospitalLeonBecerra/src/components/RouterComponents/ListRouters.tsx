import React from 'react';
import { IonItem,  IonLabel, IonRippleEffect, IonAvatar, IonContent, IonList, IonIcon, IonButton, IonModal, IonToolbar, IonTitle, IonButtons, IonListHeader, IonNote } from '@ionic/react';
import { trash, create, key, locate, pricetag, medical, business, person, speedometer, informationCircle, barcode, reorder, globe, logIn, card, keypad, calendar } from 'ionicons/icons';

class ListRouters extends React.Component<any, any>  {
    constructor(props: any) {
        super(props);
        this.state = {
            ventanaDetalle: false,
            esDadoDeBaja: false,
            eliminar: Function.prototype.bind,
        }
    }

    estado() {
        this.props.estado === "B" ? this.setState({ esDadoDeBaja: true }) : this.setState({ esDadoDeBaja: false }) 
        return this.state.esDadoDeBaja;
    }

    _eliminar(){
        if(this.props.eliminar)
            this.props.eliminar();
    }
      
    render(){  
        return (
            <IonList>
                <IonItem className = "ion-activatable" >
                    <IonLabel key={this.props.id_router} onClick={() => this.setState({ ventanaDetalle: true })}>
                        <h2><b> {this.props.id_router}</b></h2>
                        <h3 color="secondary">Estado: 
                            { 
                                this.props.estado === 'D' ? " Disponible" : 
                                this.props.estado === 'B' ? " De baja" : 
                                this.props.estado === 'R' ? " Reparado" : 
                                this.props.estado === 'ER' ? " En revisión" :
                                this.props.estado === 'O' ? " Operativo" : null 
                            }
                        </h3>
                        <p>Marca: {this.props.marca}</p>
                        <IonRippleEffect></IonRippleEffect> 
                    </IonLabel>
                    
                    <IonAvatar slot="start"> 
                        {
                        this.props.estado === 'D'  ? <img src="./assets/img/router/D.png"  alt="D" /> : 
                        this.props.estado === 'R'  ? <img src="./assets/img/router/R.png"  alt="R" /> : 
                        this.props.estado === 'ER' ? <img src="./assets/img/router/ER.png" alt="ER" /> :
                        this.props.estado === 'O'  ? <img src="./assets/img/router/O.png"  alt="O" /> :
                                                     <img src="./assets/img/router/B.png"  alt="B" />
                        }
                    </IonAvatar> 
                    
                    <>
                        <IonButton size="default" disabled={this.props.estado === "B"} fill="clear" onClick={() => console.log("Acción editar")} routerLink={"/formulariorouter/edit/"+this.props.id_equipo} color="secondary" >
                            <IonIcon color="medium" icon={create}></IonIcon>
                        </IonButton>
                        <IonButton size="default" disabled={this.props.estado === "B"} fill="clear" onClick={this._eliminar.bind(this)} color="primary" >
                            <IonIcon color="medium" icon={trash}></IonIcon>
                        </IonButton>
                    </>
                   
                </IonItem>
        
                <IonContent>      
                    <IonModal
                        isOpen={this.state.ventanaDetalle}
                        onDidDismiss={e => this.setState({ ventanaDetalle: false })}> 
                        <IonToolbar color="primary">
                            <IonTitle>Detalle de router</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => this.setState({ ventanaDetalle: false })}>
                                    <IonIcon name="close" slot="icon-only"></IonIcon>
                                </IonButton>
                            </IonButtons>
                        </IonToolbar>
                        <IonContent>
                            <IonList>
                                <IonListHeader>Información general</IonListHeader>
                                <IonItem>
                                    <IonIcon slot="start" icon={key}> </IonIcon>
                                    Código <IonNote color="dark" slot="end">{this.props.id_router}</IonNote>
                                </IonItem>
                                <IonItem>
                                    <IonIcon slot="start" icon={locate}> </IonIcon>
                                    Punto <IonNote slot="end">{this.props.punto} </IonNote>
                                </IonItem>
                                <IonItem>
                                    <IonIcon slot="start" icon={business}> </IonIcon>
                                    Departamento <IonNote  color="dark" slot="end">{this.props.departamento}</IonNote>
                                </IonItem>
                                <IonItem>
                                    <IonIcon slot="start" icon={person}> </IonIcon>
                                    Empleado a cargo <IonNote color="dark" slot="end">{this.props.empleado}</IonNote>
                                </IonItem>
                                <IonItem>
                                    <IonIcon slot="start" icon={pricetag}> </IonIcon>
                                    Marca <IonNote color="dark" slot="end">{this.props.marca}</IonNote>
                                </IonItem>
                                <IonItem>
                                    <IonIcon slot="start" icon={informationCircle} > </IonIcon>
                                    Modelo <IonNote color="dark" slot="end">{this.props.modelo}</IonNote>
                                </IonItem>
                                <IonItem>
                                    <IonIcon slot="start" icon={barcode} > </IonIcon>
                                    Número de serie <IonNote color="dark" slot="end">{this.props.numero_serie}</IonNote>
                                </IonItem>
                                <IonItem>
                                    <IonIcon slot="start" icon={speedometer}> </IonIcon>
                                    Estado 
                                    <IonNote color="dark" slot="end">
                                        { this.props.estado === 'D' ? "Disponible" : null }
                                        { this.props.estado === 'B' ? "De baja" : null }
                                        { this.props.estado === 'R' ? "Reparado" : null }
                                        { this.props.estado === 'ER' ? "En revisión" : null }
                                        { this.props.estado === 'O' ? "Operativo" : null }
                                    </IonNote>
                                </IonItem>
                                <IonItem>
                                    <IonIcon slot="start" icon={calendar} > </IonIcon>
                                    Fecha de registro <IonNote color="dark" slot="end">{this.props.fecha_registro}</IonNote>
                                </IonItem>
                                <IonItem>
                                    <IonIcon slot="start" icon={reorder}> </IonIcon>
                                    Descripción <IonNote color="dark" slot="end">{this.props.descripcion}</IonNote>
                                </IonItem>                
                                
                                <IonListHeader>Datos de dirección IP</IonListHeader>
                                <IonItem>
                                    <IonIcon slot="start" icon={globe}> </IonIcon>
                                    Direción IP <IonNote slot="end">{this.props.ip}</IonNote>
                                </IonItem>
                                <IonItem>
                                    <IonIcon slot="start" icon={logIn}> </IonIcon>
                                    Puerta enlace <IonNote slot="end">{this.props.puerta_enlace}</IonNote>
                                </IonItem>
                            
                                <IonListHeader>Datos de configuración</IonListHeader>
                                <IonItem>
                                    <IonIcon slot="start" icon={card}> </IonIcon>
                                    Nombre <IonNote slot="end">{this.props.nombre}</IonNote>
                                </IonItem>
                                <IonItem>
                                    <IonIcon slot="start" icon={medical}> </IonIcon>
                                    Pass <IonNote slot="end">{this.props.pass}</IonNote>
                                </IonItem>
                                <IonItem>
                                    <IonIcon slot="start" icon={person}> </IonIcon>
                                    Usuario <IonNote slot="end">{this.props.usuario}</IonNote>
                                </IonItem>
                                <IonItem>
                                    <IonIcon slot="start" icon={keypad}> </IonIcon>
                                    Clave <IonNote slot="end"> {this.props.clave}</IonNote>       
                                </IonItem>
                            </IonList> 
                        </IonContent>
                    </IonModal>
                </IonContent>
            </IonList> 
        );
    }
}

export default ListRouters;
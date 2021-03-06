import axios from 'axios';
import VariableGlobal from './VariableGlobal'
export default class AxiosIp {
  static instanceAxios = axios.create({
    baseURL: VariableGlobal.baseURL,
  });

  static listado_ips = () => {
    return AxiosIp.instanceAxios.get(`/listar_ips`);
  }

  static listado_ips_prueba = () => {
    return AxiosIp.instanceAxios.get(`/listar_ips_prueba`);
  }

  static crear_ip = (ip: any) => {
    console.log(ip);
    return AxiosIp.instanceAxios.post(`/crear_ip`, ip);
  }

  static filtrar_ip = (direccion_ip: any) => {
      return AxiosIp.instanceAxios.get(`/filtrar_ip/${direccion_ip}`);
  }
  
  static filtro_ip = (marca:any, fecha_registro: any) => {
    return AxiosIp.instanceAxios.get(`/filtrar_routers/${marca}/${fecha_registro}`);
  }

  static buscar_ip_por_codigo(id_ip: any) {
    return AxiosIp.instanceAxios.get(`/buscar_ip_por_codigo/${id_ip}`);
  }
  
  static editar_ip = (ip: any) => {
    console.log(ip);
    return AxiosIp.instanceAxios.put(`/editar_ip`, ip);
  }

  static eliminar_ip = (id_ip: any) => {
    console.log(id_ip);
    return AxiosIp.instanceAxios.delete(`/eliminar_ip/${id_ip}`);
  }

}

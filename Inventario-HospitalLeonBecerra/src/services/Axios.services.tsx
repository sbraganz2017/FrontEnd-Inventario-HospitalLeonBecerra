import axios from 'axios';
import VariableGlobal from './VariableGlobal'
export default class AxiosCorreo {
  static instanceAxios = axios.create({
    baseURL: VariableGlobal.baseURL,
  });


  static empleado_por_dpto = (departamento: any) => {
    return AxiosCorreo.instanceAxios.get(`/empleados_dpto/{departamento}`);
  }

  static filtrar_correos = (filtros: any) => {
    return AxiosCorreo.instanceAxios.post(`filtrar_correos`,filtros);
  }

  static crear_correo = (correo: any) => {
    return AxiosCorreo.instanceAxios.post(`/correos`, correo);
  }

  static editar_correo = (correo: any) => {
    return AxiosCorreo.instanceAxios.put(`/editar_correo`, correo);
  }

  static eliminar_correo = (id_correo: any) => {
    return AxiosCorreo.instanceAxios.put(`/eliminar_correo/${id_correo}`);
  }

  static mostrar_departamentos = () => {
    return AxiosCorreo.instanceAxios.get(`/departamentos`);
  }

  static buscar_empleado = (empleado: any) => {
    return AxiosCorreo.instanceAxios.get(`/buscar_empleado/${empleado}`);
  }

   static correo_id = (correo_id: any) => {
    return AxiosCorreo.instanceAxios.get(`/correo_id/${correo_id}`);
  }



}

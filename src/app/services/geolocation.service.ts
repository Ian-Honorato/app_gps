import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor() { }

  async pegarLocalizacaoAtual(){
    try{
      const coordenadas = await Geolocation.getCurrentPosition();
      return{
        latitude: coordenadas.coords.latitude,
        longitude: coordenadas.coords.longitude
      };
     } catch (error){
      console.error('Erro ao pegar a localização',error);
      return null;
     }
  }
}

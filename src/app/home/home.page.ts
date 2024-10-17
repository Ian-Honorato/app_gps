import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { GeolocationService } from '../services/geolocation.service';
import { ToastController } from '@ionic/angular';

declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  @ViewChild('mapElement') mapElement: ElementRef | undefined;

  map: any;
  location: { latitude: number; longitude: number; } | null = null;

  constructor(private geolocationService: GeolocationService, private toastController: ToastController) {}

  ngAfterViewInit() {
    this.initializeMap();
  }

  async pegarLocalizacao() {
    this.location = await this.geolocationService.pegarLocalizacaoAtual();
    
    if (this.location) {
      this.updateMap(this.location.latitude, this.location.longitude);
      this.adicionarMarcador(this.location.latitude, this.location.longitude);
      this.checarLocalizacao();
    } else {
      alert("Não foi possível capturar as coordenadas");
    }
  }

  initializeMap() {
    if (this.mapElement) {
      const propriedadesMapa = {
        center: new google.maps.LatLng(-21.6980516, -49.7428593), // Coordenadas iniciais
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.mapElement.nativeElement, propriedadesMapa);
    }
  }

  updateMap(latitude: number, longitude: number) {
    const localizacaoAtual = new google.maps.LatLng(latitude, longitude);
    this.map.setCenter(localizacaoAtual);
  }

  adicionarMarcador(latitude: number, longitude: number) {
    new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: this.map,
      title: 'Localização Atual'
    });
  }

  checarLocalizacao() {
    if (this.location) {
      const fatecLat = -21.6980516;
      const fatecLon = -49.7428593;
      const distancia = this.calcularDistancia(this.location.latitude, this.location.longitude, fatecLat, fatecLon);

      if (distancia <= 500) { 
        this.Notificacao1('top');
      } else {
        this.Notificacao2('top');
      }
    }
  }

  async Notificacao1(position: 'top') {
    const notificacao = await this.toastController.create({
      message: 'Aqui é a FATEC de LINS',
      duration: 1500,
      position: position,
    });
    await notificacao.present();
  }

  async Notificacao2(position: 'top') {
    const notificacao = await this.toastController.create({
      message: 'Aqui não é a FATEC de LINS',
      duration: 1500,
      position: position,
    });
    await notificacao.present();
  }

  calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const raioTerra: number = 6371000; // Raio médio da Terra em metros
    const dLat: number = this.toRadians(lat2 - lat1);
    const dLon: number = this.toRadians(lon2 - lon1);
    const radLat1: number = this.toRadians(lat1);
    const radLat2: number = this.toRadians(lat2);

    const a: number =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(radLat1) *
      Math.cos(radLat2);

    const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia: number = raioTerra * c;
    return distancia;
  }

  toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}

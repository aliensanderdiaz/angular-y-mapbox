import { Component, ElementRef, Input, ViewChild, AfterViewInit } from '@angular/core';

import { Map, Marker } from 'mapbox-gl';

@Component({
  selector: 'map-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.css']
})
export class MiniMapComponent implements AfterViewInit {
  @Input() lngLat?: [number, number]
  @ViewChild('map') public divMap?: ElementRef

  ngAfterViewInit(): void {
    if (!this.divMap?.nativeElement) throw 'Map div not found'
    if (!this.lngLat) throw "LngLat can't be null"

    const map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat, // starting position [lng, lat]
      zoom: 15, // starting zoom
      interactive: false
    });

    const marker = new Marker()
     .setLngLat( this.lngLat )
     .addTo( map )
  }

}

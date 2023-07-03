import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

import { LngLat, Map, Marker } from 'mapbox-gl';

interface MarketAndColor {
  color: string,
  marker: Marker
}

interface PlainMarker {
  color: string
  lngLat: number[]
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent implements AfterViewInit {

  @ViewChild('map')  divMap?: ElementRef

  public markers: MarketAndColor[] = []

  public map?: Map
  public currentLngLat: LngLat = new LngLat(-75.28, 2.93)

  public zoom: number = 12

  constructor() {}

  ngAfterViewInit(): void {

    if (!this.divMap) throw 'Elemento no encontrado'

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.zoom
    });

    this.readFromLocalStorage()

    // const markerHtml = document.createElement('div')
    // markerHtml.innerHTML = 'Punto de Encuentro'

    // const marker = new Marker({
    //   color: 'red',
    //   element: markerHtml
    // })
    //   .setLngLat( this.currentLngLat )
    //   .addTo( this.map! )
  }

  createMarker() {
    if (!this.map) return

    const lngLat = this.map.getCenter()

    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    this.addMarker( lngLat , color)
  }

  addMarker( lngLat: LngLat, color: string) {
    if (!this.map) return

    const marker = new Marker({
      color,
      draggable: true
    })
     .setLngLat( lngLat )
     .addTo( this.map )

    this.markers.push({marker, color})
    this.saveToLocalStorage()

    marker.on('dragend', () => this.saveToLocalStorage() )
  }

  deleteMarker(index: number) {
    console.log({ index })
    this.markers[ index ].marker.remove()
    this.markers.splice(index, 1)
  }

  flyTo(marker: Marker) {
    if (!this.map) return

    this.map.flyTo({center: marker.getLngLat(), zoom: 14})
  }

  saveToLocalStorage() {
    const plainMarkers: PlainMarker[] = this.markers.map(({ color, marker}) => {
      return {
        color,
        lngLat: marker.getLngLat().toArray()
      }
    })

    localStorage.setItem('plainMarkers', JSON.stringify( plainMarkers ))
  }

  readFromLocalStorage() {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]'

    const plainMarkers: PlainMarker[] = JSON.parse( plainMarkersString )

    plainMarkers.forEach(({ color, lngLat }) => {

      const [ lng, lat ] = lngLat
      const marketLngLat = new LngLat(lng, lat)

      this.addMarker(marketLngLat, color)
    })


    // this.markers = plainMarkers.map(({ color, lngLat }) => {

    //   const [ lng, lat ] = lngLat
    //   const marketLngLat = new LngLat(lng, lat)

    //   const marker = new Marker({
    //     color,
    //     draggable: true
    //   })
    //    .setLngLat(  marketLngLat )
    //    .addTo( this.map! );

    //   return {
    //     color,
    //     marker
    //   }
    // })
  }



}

import { Loader } from "@googlemaps/js-api-loader"

import { User } from "./User";
import { Company } from "./Company";
import dotenv from 'dotenv'
dotenv.config()

export interface Mappable {
  name: string;
  location: {
    lat: number;
    lng: number;
  }
  catchPhrase?: boolean
  infoWindowContent(): string;
}

export class Map {

  private bounds: google.maps.LatLngBounds
  private infowindow: google.maps.InfoWindow
  private googleMap: google.maps.Map

  private GOOGLE_API_KEY: string = process.env.GOOGLE_API_KEY ?? 'no key'


  constructor(divId: string, private user: User, private company: Company) {

    const loader = new Loader({
      apiKey: this.GOOGLE_API_KEY,
      version: "weekly",
    });

    loader.importLibrary('maps').then(async () => {

      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      this.googleMap = new Map(document.getElementById(divId) as HTMLElement, {
        center: { lat: this.user.location.lat, lng: this.user.location.lng },
        zoom: 1,
        mapId: '4504f8b37365c3d0',
      });

      this.googleMap.addListener('click', (event: any) => {
        console.log(event, event.latLng.lat());

        this.placeMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() })

      })

      this.perpareMarkers([this.user, this.company])



    });


  }


  async placeMarker(location: { lat: number; lng: number }) {

    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map: this.googleMap,
      position: {
        lat: location.lat,
        lng: location.lng
      },
      title: 'Added Marker',
    })
  }
  async perpareMarkers(arrayMappable: Mappable[]) {
    arrayMappable.forEach((mappable: Mappable) => {
      this.addMarker(mappable)
    });
  }
  async addMarker(mappable: Mappable): Promise<void> {

    this.bounds = new google.maps.LatLngBounds()
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map: this.googleMap,
      position: {
        lat: mappable.location.lat,
        lng: mappable.location.lng
      },
      title: mappable.catchPhrase ? 'Company' : 'Home',
    })

    marker.addListener("click", () => {

      if (this.infowindow) { this.infowindow.close(); }

      const infowindow = new google.maps.InfoWindow({
        content: mappable.infoWindowContent(),
        ariaLabel: "Uluru",
      });

      infowindow.open({
        anchor: marker,
        map: this.googleMap,
      });
      this.infowindow = infowindow;
    });

    this.bounds.extend({
      lat: mappable.location.lat,
      lng: mappable.location.lng
    })

  }


}
import { faker } from "@faker-js/faker";
export class Utils {
  public name: string
  public location: {
    lat: number
    lng: number
  }

  constructor(public catchPhrase: boolean = false) {

    this.name = this.catchPhrase ? faker.company.name() : faker.person.firstName()

    this.location = {
      lat: faker.location.latitude(),
      lng: faker.location.longitude()
    }


  }

  infoWindowContent(): string {

    let catchPhrase: string = ''
    let info: string = ''

    if (this.catchPhrase) {
      catchPhrase = `<h3>Catchphrase : ${faker.company.catchPhrase()}</h3>`
      info = `
        <h1>Company Info</h1>
        <h2>Company Name: ${this.name}</h2>
      `;
    } else {
      info = `
        <h1>User Info</h1>
        <h2>User Name: ${this.name}</h2>
      `;
    }

    return `
      <div>
        ${info}
        ${catchPhrase}
        <div>
          <b>Lat: </b>${this.location.lat} <br />
          <b>Lng: </b>${this.location.lng}
        </div>
    `
  }
} 
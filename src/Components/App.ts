import { User } from "./User";

import { Company } from "./Company";

import { Map } from "./Map";
/* import Dexie, { Table } from 'dexie'; */



export class App {
  private user: User
  private company: Company
  private map: Map

  constructor() {

    if ('indexedDB' in window) {
      console.log('IndexedDB is supported!');
      let openRequest = indexedDB.open("store", 1);

      openRequest.onupgradeneeded = function (event: Event) {
        const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
        // triggers if the client had no database
        // ...perform initialization...
        console.log('klijent nema db');
        let objectStore = db.createObjectStore('app', { keyPath: 'id', autoIncrement: true, });
        objectStore.createIndex('name', 'name', { unique: false })

      };

      openRequest.onerror = function () {
        console.error("Error", openRequest.error);
      };

      openRequest.onsuccess = function (event: Event) {
        const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
        // Start a new transaction


        // Get the object store

        const transaction: IDBTransaction = db.transaction(['app'], 'readwrite');
        const objectStore: IDBObjectStore = transaction.objectStore('app');
        var data = {
          user: '',
          company: '',
          map: ''
        };
        const addRequest: IDBRequest = objectStore.add(data);

        addRequest.onsuccess = function (event: Event) {
          const data: any = (event.target as IDBRequest).result;
          if (data) {
            console.log('Retrieved data:', data);
          } else {
            console.log('No data found with the specified key.');
          }
        };

        // This event is triggered if an error occurs while retrieving the data
        addRequest.onerror = function (event: Event) {
          console.error('Error retrieving data:', (event.target as IDBRequest).error);
        };

        // Close the transaction
        transaction.oncomplete = function (event: Event) {
          console.log('Transaction completed.');
        };

      };
    } else {
      console.log('IndexedDB is NOT supported.');
    }

    this.user = new User()
    this.company = new Company()

    document.getElementById('choseLocation')?.addEventListener('click', () => {
      document.getElementsByTagName('dialog')[0]?.showModal()

      this.map = new Map('dialogMap', this.user, this.company)

    })


    this.map = new Map('map', this.user, this.company)



  }

}
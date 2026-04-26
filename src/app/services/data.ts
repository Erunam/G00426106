import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';


@Injectable({
  providedIn: 'root',
})

/**
 * Provides the functionality to operate the local storage
 */
export class MyData {

  constructor( private storage:Storage){
    this.init();
  }

  /**
   * Initialise the storage
   */
  async init(){
    const storage = await this.storage.create();
  }

  /**
   * Write the data into local storage
   * @param key 
   * @param value 
   */
  async set(key: string, value: any){
    await this.storage.set(key, value);
  }

  /**
   * Retrieve the stored data from the local storage
   * @param key 
   * @returns 
   */
  async get(key: string){
    return await this.storage.get(key);
  }

  /**
   * Remove the data from the local storage
   * @param key 
   */
  async remove(key: string){
    await this.storage.remove(key);
  }
}

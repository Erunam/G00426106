import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class Data {
  
  constructor(private storage: Storage){
    this.init();
  }

  async init(){
    const storage = await this.storage.create();
  }
}

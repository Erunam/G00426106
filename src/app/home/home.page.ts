import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { MyHttp } from '../services/myhttp';
import { HttpOptions } from '@capacitor/core';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage {
  constructor(private myhttp:MyHttp, private storage: Storage) {}
  
  options: HttpOptions =
  {
    url: ""
  }
  
  baseUrl: string = "";
  posterSizes: any;

  async setBaseUrl()
  {
    let result = await this.myhttp.getBaseUrl(this.options);
    this.baseUrl = result.image.baseurl;
    this.posterSizes = result.image.poster_sizes;

    this.storage.set("baseUrl", this.baseUrl);
    this.storage.set("posterSizes", JSON.stringify(this.posterSizes))
  }
}

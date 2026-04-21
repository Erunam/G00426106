import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { MyHttp } from '../services/myhttp';
import { HttpOptions } from '@capacitor/core';
import { Storage } from '@ionic/storage-angular';
import { MyData } from '../services/data';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage {
  constructor(private mydata: MyData, private mhttp: MyHttp) {}
  
  options: HttpOptions =
  {
    url: ""
  }
  
  baseUrl: string = "";
  posterSizes: any;

  ngOnInit()
  {


  }

  async setBaseUrl()
  {
    this.mydata.set('test', 'test');
    console.log("test");
    /*
    let result = await this.myhttp.getBaseUrl(this.options);
    this.baseUrl = result.image.baseurl;
    this.posterSizes = result.image.poster_sizes;
  
    this.storage.set("baseUrl", "test1"); //this.baseUrl
    this.storage.set("posterSizes", "test2"); //JSON.stringify(this.posterSizes))
    */
  }
}

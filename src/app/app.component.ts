import { Component } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { MyData } from './services/data';
import { MovieDB } from './services/movie-db';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet,],
})
export class AppComponent {
  constructor(private mydata: MyData) {}

  async ngOnDestroy(){
    await this.mydata.remove("keyword");
  }
}

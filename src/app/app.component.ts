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
    console.log("Destroy App ...");
    await this.mydata.remove("keyword");
  }
/*
  async checkFirstRun(){
//    console.log("getting firstRun flag..");
    console.log("first run attempts..");
    let firstRun = await this.mydata.get("firstRun");
    console.log("first run read" + firstRun);
    console.log(firstRun);
    if ((firstRun == null) || (firstRun == "")){
      console.log("initialise..")
      await this.initialise();
      await this.mydata.set("firstRun", true);
    }
  }
  async initialise(){
    console.log("first run pending ...");
    await this.mydata.set("apiKey", "e132512c4c29d4cde63e3ee5621ba016");
    await this.movie.setBaseUrl();
    console.log("first run done");
  }
*/  
}

import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { MovieDB } from '../services/movie-db';
import { MyData } from '../services/data';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage {

  constructor(private mydata: MyData, private movie: MovieDB)
  {
    this.mydata.set("apiKey", "e132512c4c29d4cde63e3ee5621ba016");
  }

  movieId = 936075;
  castId = 91671;
  creditsId = 31;

  ngOnInit()
  {

  }

  async initialise()
  {
    // remember to move this to ngOnInit
    console.log("init pending ...");
    //this.movie.setApiKey(this.apiKey)
    this.movie.setBaseUrl();
    console.log("init done");
  }

  // testing myhtttp service

  async getMovieCredit(id: number)
  {
   
    let result = await this.movie.getMovieCredit(id);
    console.log("Credit data: ");
    console.log(result);
  }

  async getMemberData(id: number)
  {
   
    let result = await this.movie.getMemberData(id);
    console.log("Member data: ");
    console.log(result);
  }

  async getMovieData(id: number)
  {
    let result = await this.movie.getMovieData(id);
    console.log("Movie data: ");
    console.log(result);
  }

  async getTrending()
  {
    let result = await this.movie.getTrendingMovie();
    console.log("Trending: ");
    console.log(result);
  }
}

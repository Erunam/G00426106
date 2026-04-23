import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { MovieDB } from '../services/movie-db';
import { MyData } from '../services/data';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonGrid, IonRow, IonCol],
})
export class HomePage {
  name = "G00426106";
  keyword = "";
  movieData: any;

  constructor(private mydata: MyData, private movie: MovieDB) {}
  
  ngOnInit()
  {
    this.runApp();
  }

  async runApp()
  {
    await this.checkFirstRun();
    await this.getKeyword();
    this.getMovies();
  }

  async searchClick(keyword: string)
  {
    console.log("click: " + keyword);
    await this.mydata.set("keyword", keyword);
    await this.getKeyword();
    this.getMovies();
  }

  getMovies()
  {
    if (this.keyword == null || this.keyword == "")
    {
      this.getTrending();
    }
    else
    {
      this.searchMovies(this.keyword);
    }
  }

  async getKeyword()
  {
    this.keyword = await this.mydata.get("keyword");
  }
  
  async searchMovies(keyword: string)
  {
    //this.movieData = await this.movie.getMovies( keyword );
    console.log("searching movie ... ");
    this.movieData = await this.movie.getMovies( keyword );
    console.log(this.movieData);
  }

  async getTrending()
  {
    //let result = await this.movie.getTrendingMovie();
    console.log("getting trending...");
    this.movieData = await this.movie.getTrendingMovie();
    console.log(this.movieData);
  }
  
  async checkFirstRun()
  {
    console.log("getting firstRun flag..");
    let firstRun = await this.mydata.get("firstRun");
    if (firstRun == null)
    {
      console.log("initialise..")
      await this.initialise();
      await this.mydata.set("firstRun", true);
    }
  }

  async initialise()
  {
    console.log("first run pending ...");
    await this.mydata.set("apiKey", "e132512c4c29d4cde63e3ee5621ba016");
    await this.movie.setBaseUrl();
    console.log("first run done");
  }
}

/*
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
*/

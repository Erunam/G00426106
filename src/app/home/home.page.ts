import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/angular/standalone';
import { MovieDB } from '../services/movie-db';
import { MyData } from '../services/data';
import { HttpOptions } from '@capacitor/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent],
})
export class HomePage {
  name = "G00426106";
  keyword = "";
  movieData!: any;
  baseUrl = "";
  posterSize = "";
  posterBaseUrl = "";
  posterSizeIndex = 0;
  api = "e132512c4c29d4cde63e3ee5621ba016";
  options: HttpOptions = {
    url : "https://api.themoviedb.org/3/trending/movie/day?api_key="
  }

  constructor(private mydata: MyData, private movie: MovieDB) {}
  
  ngOnInit(){
    this.runApp();
  }

  async ngOnDestroy(){
    console.log("destroy Home Page ...");
    await this.mydata.remove("keyword");
  }

  async runApp()
  {
    await this.checkFirstRun();
    await this.getKeyword();
    await this.setPosterBaseUrl();
    await this.getMovies();

    /*
    this.keyword = await this.mydata.get("keyword");
    this.options.url += this.api;
    let result = await this.movie.get(this.options);
    this.movieData = result.results;
    console.log(this.movieData);
    */
  }

  async searchClick(keyword: string)
  {
    console.log("click: " + keyword);
    await this.mydata.set("keyword", keyword);
    await this.getKeyword();
    this.getMovies();
  }

  async getMovies()
  {
    if (this.keyword == null || this.keyword == "")
    {
      await this.getTrending();
    }
    else
    {
      await this.searchMovies(this.keyword);
    }
  }

  async getKeyword()
  {
    this.keyword = await this.mydata.get("keyword");
  }

  async setPosterBaseUrl(){
    console.log("setPosterBaseUrl");
    let baseUrl = await this.mydata.get("baseUrl");
    let sizes = JSON.parse(await this.mydata.get("posterSizes"));
    let posterSize = sizes[this.posterSizeIndex];
    this.posterBaseUrl = baseUrl + posterSize;
    console.log(this.posterBaseUrl);
  }
  
  async searchMovies(keyword: string)
  {
    //this.movieData = await this.movie.getMovies( keyword );
    console.log("searching movie ... ");
    let result = await this.movie.getMovies( keyword );
    console.log(result);
    this.movieData = result.results;
    console.log(this.movieData);
  }

  async getTrending()
  {
    //let result = await this.movie.getTrendingMovie();
    console.log("getting trending...");
    let result = await this.movie.getTrendingMovie();
    this.movieData = result.results;
    console.log(JSON.stringify(this.movieData));
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

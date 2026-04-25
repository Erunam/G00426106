import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonContent, IonButton, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput } from '@ionic/angular/standalone';
import { MovieDB } from '../services/movie-db';
import { MyData } from '../services/data';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart } from 'ionicons/icons';
import { heartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [ RouterLink,
             IonIcon,
             FormsModule,
             CommonModule,
             IonHeader,
             IonToolbar,
             IonContent,
             IonButton,
             IonGrid,
             IonRow,
             IonCol,
             IonCard,
             IonCardHeader,
             IonCardTitle,
             IonCardContent,
             IonInput],
})
export class HomePage {
  name = "G00426106";
  keyword = "";
  movieData!: any;
  baseUrl = "";
  posterSize = "";
  posterBaseUrl = "";
  posterSizeIndex = 0;
  apiKey = "e132512c4c29d4cde63e3ee5621ba016";

  constructor(private router: Router, private mydata: MyData, private movie: MovieDB) {
    addIcons({ heart, heartOutline });
  }
  
  ngOnInit(){
    this.runApp();
  }

  async ngOnDestroy(){
    console.log("destroy Home Page ...");
    await this.mydata.remove("keyword");
  }

  async onSearchClick(){
    await this.mydata.set("keyword", this.keyword);
    await this.getMovies();
  }

  async onCardClick(movieId: number){
    console.log(movieId);
    await this.mydata.set("movieId", movieId);
    this.router.navigate(['/movies']);
  }

  async runApp()
  {
    await this.checkFirstRun();
    await this.getKeyword();
    await this.setPosterBaseUrl();
    await this.getMovies();
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
    let baseUrl = await this.mydata.get("baseUrl");
    let sizes = JSON.parse(await this.mydata.get("posterSizes"));
    let posterSize = sizes[this.posterSizeIndex];
    this.posterBaseUrl = baseUrl + posterSize;
  }
  
  async searchMovies(keyword: string)
  {
    let result = await this.movie.getMovies( keyword );
    this.movieData = result.results;
  }

  async getTrending()
  {
    let result = await this.movie.getTrendingMovie();
    this.movieData = result.results;
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
    await this.mydata.set("apiKey", this.apiKey);
    await this.movie.setBaseUrl();
    console.log("first run done");
  }
  
}
/*
  async searchClick(keyword: string)
  {
    console.log("click: " + keyword);
    await this.mydata.set("keyword", keyword);
    await this.getKeyword();
    this.getMovies();
  }
*/

import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonContent, IonButton, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonTitle } from '@ionic/angular/standalone';
import { MovieDB } from '../services/movie-db';
import { MyData } from '../services/data';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart } from 'ionicons/icons';
import { heartOutline } from 'ionicons/icons';
import { Favourites } from '../services/favourites';
import { addCircleOutline } from 'ionicons/icons';
import { removeCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [RouterLink,
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
    IonInput,
    IonTitle],
})

/**
 * Operations on the Home Page
 */
export class HomePage {
  name = "G00426106";
  keyword = "";
  movieData!: any;
  
  baseUrl = "";
  posterSizes!: number[];
  posterBaseUrl = "";
  posterSizeIndex = 0;
  apiKey = "e132512c4c29d4cde63e3ee5621ba016";

  constructor(private router: Router, private mydata: MyData, private movie: MovieDB, private fav: Favourites) {
    // adding icons to the project
    addIcons({ heart, heartOutline, addCircleOutline, removeCircleOutline });
  }
  
  /**
   * Initialise the page
   */
  ngOnInit(){
    this.runHome();
  }

  /**
   * Resizes the images to larger size by updating the poster base url
   * Event: Increase button click
   */
  onSizeUp(){
    this.posterSizeIndex++;
    if (this.posterSizeIndex >= this.posterSizes.length){
      this.posterSizeIndex = this.posterSizes.length - 1;
    }
    this.setPosterBaseUrl();
  }

  /**
   * Resizes the images to smaller size by updating the poster base url
   * Event: Decrease button click
   */
  onSizeDown(){
    this.posterSizeIndex--;
    if (this.posterSizeIndex < 0){
      this.posterSizeIndex = 0;
    }
    this.setPosterBaseUrl();
  }

  /**
   * Response to the search button click
   * Searches the movie for given keyword
   */
  async onSearchClick(){
    await this.mydata.set("keyword", this.keyword);
    // retrieve the movies for given keyword
    await this.getMovies();
  }

  /**
   * Navigates to movie detail page
   * @param movieId 
   */
  async onCardClick(movieId: number){
    await this.mydata.set("movieId", movieId);
    this.router.navigate(['/movies']);
  }

  /**
   * Main method for the page
   */
  async runHome()
  {
    await this.checkFirstRun();       // checks if application is run for the first time and step up if yes
    await this.getKeyword();          // retrieve most recently used keyword from storage
    await this.initPosterBaseUrl();   // initializes the url for images
    await this.getMovies();           // retrieve movie data
  }

  /**
   * Retrieve the movie data to display on the Home Page
   * if this is the first run or empty keyword was provided 
   * then it returns current trending movies
   */
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

  /**
   * Retrieve the most recently used keyword from storage
   */
  async getKeyword()
  {
    this.keyword = await this.mydata.get("keyword");
  }

  /**
   * Updates the images link (base part)
   */
  async setPosterBaseUrl(){
    this.posterBaseUrl = this.baseUrl + this.posterSizes[this.posterSizeIndex];
  }

  /**
   * Retrieves parts of images url stored in local storage
   */
  async initPosterBaseUrl(){
    let baseUrl = await this.mydata.get("baseUrl");
    this.baseUrl = baseUrl;
    let sizes = JSON.parse(await this.mydata.get("posterSizes"));
    this.posterSizes = sizes;

    await this.setPosterBaseUrl();
  }
  
  /**
   * Retrieves the list of movies which match given keyword
   * @param keyword 
   */
  async searchMovies(keyword: string)
  {
    let result = await this.movie.getMovies( keyword );
    this.movieData = result.results;
  }

  /**
   * Retrieves the list of currently trending movies
   */
  async getTrending()
  {
    let result = await this.movie.getTrendingMovie();
    this.movieData = result.results;
  }
  
  /**
   * Checks if the application is run for the first time
   * Initialize it if yes
   * It set flag "firstRun" after application initialisation
   */
  async checkFirstRun()
  {
    let firstRun = await this.mydata.get("firstRun");
    if (firstRun == null)
    {
      await this.initialise();                      // init the app
      await this.mydata.set("firstRun", true);      // save flag indicating that init was already done
    }
  }

  /**
   * Initialize the application
   */
  async initialise()
  {
    // store the api key
    await this.mydata.set("apiKey", this.apiKey);
    // store the url data
    await this.movie.setBaseUrl();
    // initializes the favourites data set
    await this.fav.initFavourites();
  }
  
}
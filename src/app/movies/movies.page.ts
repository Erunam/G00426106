import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonContent, IonButton, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonTitle, IonItemDivider, IonLabel } from '@ionic/angular/standalone';
import { MovieDB } from '../services/movie-db';
import { MyData } from '../services/data';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, removeCircleOutline, addCircleOutline } from 'ionicons/icons';
import { heartOutline } from 'ionicons/icons';
import { home } from 'ionicons/icons';
import { Favourites } from '../services/favourites';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
  standalone: true,
  imports: [IonLabel, IonItemDivider, IonTitle,  RouterLink,
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
             IonCardContent],
})

/**
 * This page provides detailed information about movie members
 * Also allows the user to add the movie to the favourite list
 */
export class MoviesPage {

  movieId!: number;
  movieCast!: any;
  movieCrew!: any;
  movieTitle!: string;
  movieOverview!: string;

  baseUrl = "";
  posterSizes!: number[];
  posterBaseUrl = "";
  posterSizeIndex = 0;

  favButton = ["Add to Favourites", "Remove from Favourites"];
  favourited = 0;

  testArray = [1, 4, 6, 7];
 
  constructor(private router: Router, private mydata: MyData, private movie: MovieDB, private fav: Favourites) {
        addIcons({home,heart,removeCircleOutline,addCircleOutline,heartOutline});
  }

  ngOnInit(){
  }

  /**
   * Actions performed when page is about to be displayed
   */
  ionViewWillEnter(){
    this.runMovies();
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
   * Adds movie to the favourites if it is not in the list already
   * Removes movie from the favourites if it is already in
   */
  async onFavClick(){
    if (this.favourited == 0){
      await this.fav.addFavourite(this.movieId);
    }
    else{
      await this.fav.remFavourite(this.movieId);
    }
    await this.updateFav();
  }

  /**
   * Navigates to Member Detail Page
   * @param personId 
   */
  async onCardClick(personId: number){
    await this.mydata.set("personId", personId);
    this.router.navigate(['/persons']);
  }

  /**
   * Main method for the page
   */
  async runMovies(){
    let movieId = await this.mydata.get("movieId");
    this.movieId = movieId;
    await this.initPosterBaseUrl();                 // initialize the ursl
    await this.getMovie();                          // retrieve movie information
    await this.getMovieDetails();                   // retrieve cast and crew information
    await this.updateFav();                         // update the button: add/remove favourites 
  }

  /**
   * Updates the add to/ remove from favourites button
   * The text showed and its look is based on the "favourite" flag
   */
  async updateFav(){
    let f = await this.fav.isFavourited(this.movieId);
    if (f){
      this.favourited = 1;
    }
    else{
      this.favourited = 0;
    }
  }

  /**
   * Retrieve information about movie given by its id
   */
  async getMovie(){
    if ( this.movieId != null ){
      let result = await this.movie.getMovieData( this.movieId );
      this.movieTitle = result.original_title;
      this.movieOverview = result.overview;
    }
  }

  /**
   * Retrieve cast and crew data
   */
  async getMovieDetails(){
    if ( this.movieId != null ){
      let result = await this.movie.getMovieDetails( this.movieId );
      this.movieCast = result.cast;
      this.movieCrew = result.crew;
    }
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
}

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

  ionViewWillEnter(){
    this.runMovies();
  }

  onSizeUp(){
    this.posterSizeIndex++;
    if (this.posterSizeIndex >= this.posterSizes.length){
      this.posterSizeIndex = this.posterSizes.length - 1;
    }
    this.setPosterBaseUrl();
  }
  onSizeDown(){
    this.posterSizeIndex--;
    if (this.posterSizeIndex < 0){
      this.posterSizeIndex = 0;
    }
    this.setPosterBaseUrl();
  }

  async onFavClick(){
    if (this.favourited == 0){
      await this.fav.addFavourite(this.movieId);
    }
    else{
      await this.fav.remFavourite(this.movieId);
    }
    await this.updateFav();
  }

  async onCardClick(personId: number){
    await this.mydata.set("personId", personId);
    this.router.navigate(['/persons']);
  }

  async runMovies(){
    let movieId = await this.mydata.get("movieId");
    this.movieId = movieId;
    await this.initPosterBaseUrl();
    await this.getMovie();
    await this.getMovieDetails();
    await this.updateFav();
  }

  async updateFav(){
    let f = await this.fav.isFavourited(this.movieId);
    if (f){
      this.favourited = 1;
    }
    else{
      this.favourited = 0;
    }
  }

  async getMovie(){
    if ( this.movieId != null ){
      let result = await this.movie.getMovieData( this.movieId );
      this.movieTitle = result.original_title;
      this.movieOverview = result.overview;
    }
  }

  async getMovieDetails(){
    if ( this.movieId != null ){
      let result = await this.movie.getMovieDetails( this.movieId );
      this.movieCast = result.cast;
      this.movieCrew = result.crew;
    }
  }

  async setPosterBaseUrl(){
    this.posterBaseUrl = this.baseUrl + this.posterSizes[this.posterSizeIndex];
  }

  async initPosterBaseUrl(){
    let baseUrl = await this.mydata.get("baseUrl");
    this.baseUrl = baseUrl;
    let sizes = JSON.parse(await this.mydata.get("posterSizes"));
    this.posterSizes = sizes;

    await this.setPosterBaseUrl();
  }
}

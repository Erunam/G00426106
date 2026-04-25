import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonContent, IonButton, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonTitle, IonItemDivider, IonLabel } from '@ionic/angular/standalone';
import { MovieDB } from '../services/movie-db';
import { MyData } from '../services/data';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { contractOutline, heart } from 'ionicons/icons';
import { heartOutline } from 'ionicons/icons';
import { home } from 'ionicons/icons';

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
             IonCardContent,
             IonInput],
})
export class MoviesPage {

  movieId!: number;
  movieCast!: any;
  movieCrew!: any;
  movieTitle!: string;
  movieOverview!: string;
  baseUrl = "";
  posterSize = "";
  posterBaseUrl = "";
  posterSizeIndex = 0;
 
  constructor(private router: Router, private mydata: MyData, private movie: MovieDB) {
        addIcons({ heart, heartOutline, home });
  }

  ngOnInit(){
    console.log("Movies ngOnInit");
  }


  ionViewWillEnter(){
    console.log("Movies ionViewWillEnter");
    this.runMovies();
  }

  async onCardClick(personId: number){
    await this.mydata.set("personId", personId);
    this.router.navigate(['/persons']);
  }


  async runMovies(){
    let movieId = await this.mydata.get("movieId");
    this.movieId = movieId;
    await this.setPosterBaseUrl();
    await this.getMovie();
    await this.getMovieDetails();
  }

  async getMovie(){
    if ( this.movieId != null ){
      let result = await this.movie.getMovieData( this.movieId );
      this.movieTitle = result.original_title;
      this.movieOverview = result.overview;
      console.log("getMovie end");
    }
  }

  async getMovieDetails(){
    if ( this.movieId != null ){
      let result = await this.movie.getMovieDetails( this.movieId );
      this.movieCast = result.cast;
      this.movieCrew = result.crew;
      console.log("getMovieDetails end");
    }
  }

  async setPosterBaseUrl(){
    let baseUrl = await this.mydata.get("baseUrl");
    let sizes = JSON.parse(await this.mydata.get("posterSizes"));
    let posterSize = sizes[this.posterSizeIndex];
    this.posterBaseUrl = baseUrl + posterSize;
  }
}

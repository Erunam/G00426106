import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonTitle, IonButton } from '@ionic/angular/standalone';
import { MovieDB } from '../services/movie-db';
import { MyData } from '../services/data';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home } from 'ionicons/icons';
import { Favourites } from '../services/favourites';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
  standalone: true,
  imports: [IonButton,
            IonTitle,
            RouterLink,
            IonIcon,
            FormsModule,
            CommonModule,
            IonHeader,
            IonToolbar,
            IonContent,
            IonGrid,
            IonRow,
            IonCol,
            IonCard,
            IonCardContent],
})

export class FavouritesPage {

  favData!: any;
  favMoviesData!: any[];

  baseUrl = "";
  posterSize = "";
  posterBaseUrl = "";
  posterSizeIndex = 0;

  constructor(private router: Router, private mydata: MyData, private movie: MovieDB, private fav: Favourites) {
        addIcons({ home });
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    //this.favMoviesData = [];
    this.runFavourities();
  }

  async runFavourities(){
    await this.setPosterBaseUrl();
    await this.getFavouriteList();
    await this.getFavouriteDetails();
  }

  async onFavClick(movieId: number){
    await this.fav.remFavourite(movieId);
    await this.getFavouriteList();
    await this.getFavouriteDetails();
  }

  async onCardClick(movieId: number){
    await this.mydata.set("movieId", movieId);
    this.router.navigate(['/movies']);
  }

  async getFavouriteDetails(){
    this.favMoviesData = [];
    for (let i = 0; i < this.favData.length; i++){
      let result = await this.movie.getMovieData(this.favData[i]);
      this.favMoviesData.push(result);
    }
  }

  async getFavouriteList(){
    let result = await this.fav.obtainFavourites();
    this.favData = result;
  }

  async setPosterBaseUrl(){
    let baseUrl = await this.mydata.get("baseUrl");
    let sizes = JSON.parse(await this.mydata.get("posterSizes"));
    let posterSize = sizes[this.posterSizeIndex];
    this.posterBaseUrl = baseUrl + posterSize;
  }
}

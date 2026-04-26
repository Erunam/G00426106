import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonTitle, IonItemDivider, IonLabel, IonCardSubtitle } from '@ionic/angular/standalone';
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

@Component({
  selector: 'app-persons',
  templateUrl: './persons.page.html',
  styleUrls: ['./persons.page.scss'],
  standalone: true,
  imports: [IonCardSubtitle, IonLabel, IonItemDivider, IonTitle,  RouterLink,
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
             IonCardHeader,
             IonCardTitle,
             IonCardContent],
})

export class PersonsPage {
  personId!: number;
  personName!: string;
  personAka!: string;
  personDOB!: Date;
  personDOD!: Date;
  personBio!: string;
  personPoster!: string;
  personCredits!: any;
  
  baseUrl = "";
  posterSizes!: number[];
  posterBaseUrl = "";
  posterSizeIndex = 0;
  moviePosterBaseUrl = "";

  constructor(private router: Router, private mydata: MyData, private movie: MovieDB) {
        addIcons({home,heart,removeCircleOutline,addCircleOutline,heartOutline});
  }

  ngOnInit() {
  }


  ionViewWillEnter(){
    this.runPersons();
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

  async onCardClick(movieId: number){
    await this.mydata.set("movieId", movieId);
    this.router.navigate(['/movies']);
  }

  async runPersons(){
    let personId = await this.mydata.get("personId");
    this.personId = personId;
    await this.initPosterBaseUrl();
    await this.getPersonData();
    await this.getPersonCredits();
  }

  async getPersonCredits(){
    if ( this.personId != null ){
      let result = await this.movie.getMovieCredit(this.personId);
      this.personCredits = result.cast;
    }
  }

  async getPersonData(){
    if ( this.personId != null ){
      let result = await this.movie.getMemberData(this.personId);
      this.personName = result.name;
      this.personAka = this.parseAka(result.also_known_as);
      this.personPoster = result.profile_path;
      this.personDOB = result.birthday;
      this.personDOD = result.deathday;
      this.personBio = result.biography;
    }
  }

  parseAka(aka: string[]){
    let akaName = "";
    for (let i = 0; i < aka.length; i++){
      akaName += aka[i] + ", ";
    }
    akaName = akaName.substring(0, akaName.length - 2);
    return akaName;
  }

  async setPosterBaseUrl(){
    this.posterBaseUrl = this.baseUrl + this.posterSizes[this.posterSizeIndex];
  }

  async initPosterBaseUrl(){
    let baseUrl = await this.mydata.get("baseUrl");
    this.baseUrl = baseUrl;
    let sizes = JSON.parse(await this.mydata.get("posterSizes"));
    this.posterSizes = sizes;

    this.moviePosterBaseUrl = this.baseUrl + this.posterSizes[0];

    await this.setPosterBaseUrl();
  }
}

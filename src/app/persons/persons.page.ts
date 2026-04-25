import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonContent, IonButton, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonTitle, IonItemDivider, IonLabel, IonCardSubtitle } from '@ionic/angular/standalone';
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
  posterSize = "";
  posterBaseUrl = "";
  moviePosterBaseUrl = "";
  posterSizeIndex = 0;
 
  constructor(private router: Router, private mydata: MyData, private movie: MovieDB) {
        addIcons({ heart, heartOutline, home });
  }

  ngOnInit() {
    console.log("Persons ngOnInit");
  }


  ionViewWillEnter(){
    console.log("Persons ionViewWillEnter");
    this.runPersons();
  }

  async onCardClick(movieId: number){
    await this.mydata.set("movieId", movieId);
    this.router.navigate(['/movies']);
  }

  async runPersons(){
    let personId = await this.mydata.get("personId");
    this.personId = personId;
    await this.setPosterBaseUrl();
    await this.getPersonData();
    await this.getPersonCredits();
  }

  async getPersonCredits(){
    if ( this.personId != null ){
      let result = await this.movie.getMovieCredit(this.personId);
      this.personCredits = result.cast;
      console.log("getPersonCredits end");
      console.log( this.personCredits);
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
      console.log("getPersonData end");
    }
  }

  parseAka(aka: string[]){
    let akaName = "";
    for (let i = 0; i < aka.length; i++){
      akaName += aka[i] + ", ";
    }
    akaName = akaName.substring(0, akaName.length - 2);
    console.log(akaName);
    return akaName;
  }

  async setPosterBaseUrl(){
    let baseUrl = await this.mydata.get("baseUrl");
    let sizes = JSON.parse(await this.mydata.get("posterSizes"));
    let posterSize = sizes[this.posterSizeIndex];
    this.posterBaseUrl = baseUrl + posterSize;
    this.moviePosterBaseUrl = baseUrl + sizes[0];
  }
}

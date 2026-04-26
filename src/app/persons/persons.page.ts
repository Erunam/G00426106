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

/**
 * This page provides detailed information about actors and crew
 */
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


  /**
   * Actions performed when page is about to be displayed
   */
  ionViewWillEnter(){
    this.runPersons();
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
   * Navigates to Movie Details Page
   * @param movieId 
   */
  async onCardClick(movieId: number){
    await this.mydata.set("movieId", movieId);
    this.router.navigate(['/movies']);
  }

  /**
   * Main method for the page
   */
  async runPersons(){
    let personId = await this.mydata.get("personId");
    this.personId = personId;
    await this.initPosterBaseUrl();
    await this.getPersonData();
    await this.getPersonCredits();
  }

  /**
   * Retrieves the list of other movies the member has been credited for
   */
  async getPersonCredits(){
    if ( this.personId != null ){
      let result = await this.movie.getMovieCredit(this.personId);
      this.personCredits = result.cast;
    }
  }

  /**
   * Retrieve details about person in question
   */
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

  /**
   * Parse also know as array to produce clean string
   * @param aka 
   * @returns 
   */
  parseAka(aka: string[]){
    let akaName = "";
    for (let i = 0; i < aka.length; i++){
      akaName += aka[i] + ", ";
    }
    akaName = akaName.substring(0, akaName.length - 2);
    return akaName;
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

    this.moviePosterBaseUrl = this.baseUrl + this.posterSizes[0];

    await this.setPosterBaseUrl();
  }
}

import { Injectable } from '@angular/core';
import { MyData } from './data';

@Injectable({
  providedIn: 'root',
})

/**
 * This class provides functionality to add/removal and store the selected items
 */
export class Favourites {

  items: number[] = [];

  constructor(private mydata: MyData ) { }

  /**
   * Checks if the item id exists in the data set
   * @param id 
   * @returns
   */
  async isFavourited(id: number){
    await this.getFavourites();
    if (this.items != null ){
      for (let i = 0; i<this.items.length; i++ ){
        if (id == this.items[i]){
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Add the item to the data set if it does not exists already
   * @param id 
   */
  async addFavourite(id: number){
    await this.getFavourites();
    let fav = await this.isFavourited(id);
    if ( fav == false ){
      this.items.push(id);
    }
    await this.mydata.set("favourites", JSON.stringify(this.items));  
  }

  /**
   * Remove the item from the data set
   * @param id 
   */
  async remFavourite(id: number){
    await this.getFavourites();
    let temp: number[] = new Array();
    for (let i = 0; i<this.items.length; i++ ){
      if (id != this.items[i]){
        temp.push(this.items[i]);
      }
    }
    this.items = temp;
    await this.mydata.set("favourites", JSON.stringify(this.items))
  }

  /**
   * Reads the stored list of id's
   */
  async getFavourites(){
    let favItems = await this.mydata.get("favourites");
    if (favItems != null)
    {
      this.items = JSON.parse(favItems);
    }
  }

  /**
   * Provides the stored id's to the program
   * @returns 
   */
  async obtainFavourites(){
    await this.getFavourites();
    return this.items;
  }

  /**
   * Initialise the favourites base
   *  must be initialised at the first program run
   */
  async initFavourites(){
    let favItems = await this.mydata.get("favourites");
    if (favItems == null)
    {
      await this.mydata.set("favourites", JSON.stringify(this.items));
    }
  }

}

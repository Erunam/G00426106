import { Injectable } from '@angular/core';
import { MyData } from './data';

@Injectable({
  providedIn: 'root',
})

export class Favourites {

  items: number[] = [];

  constructor(private mydata: MyData ) { }

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

  async addFavourite(id: number){
    await this.getFavourites();
    let fav = await this.isFavourited(id);
    if ( fav == false ){
      this.items.push(id);
    }
    await this.mydata.set("favourites", JSON.stringify(this.items));  
  }

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

  async getFavourites(){
    let favItems = await this.mydata.get("favourites");
    if (favItems != null)
    {
      this.items = JSON.parse(favItems);
    }
  }

  async obtainFavourites(){
    await this.getFavourites();
    return this.items;
  }

  async initFavourites(){
    let favItems = await this.mydata.get("favourites");
    if (favItems == null)
    {
      await this.mydata.set("favourites", JSON.stringify(this.items));
    }
  }

}

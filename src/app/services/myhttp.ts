import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpOptions } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class MyHttp {

  getBaseUrl(options: HttpOptions)
  {
    // base urls must be stored in app data by calling class
    return this.get(options);
  }

  getTrendingMovie()
  {

  }

  getMovieData(movieId: number)
  {

  }

  getMemberData(personId: number)
  {

  }

  getMovieCredit(personId: number)
  {

  }


  async get(options: HttpOptions)
  {
    return (await CapacitorHttp.get(options)).data;
  }
}

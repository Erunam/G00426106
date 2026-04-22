import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpOptions } from '@capacitor/core';
import { MyData } from './data';

@Injectable({
  providedIn: 'root',
})

export class MovieDB {
  
  serviceUrl = "https://api.themoviedb.org/3/configuration?api_key=";
  movieTrendingUrl = "https://api.themoviedb.org/3/trending/movie/day?api_key=";
  movieSearch_1 = "https://api.themoviedb.org/3/search/movie?query=";
  movieSearch_2 = "&api_key=";
  movieData_1 = "https://api.themoviedb.org/3/movie/";
  movieData_2 = "/credits?api_key=";
  memberData_1 = "https://api.themoviedb.org/3/person/";
  memberData_2 = "?api_key=";
  movieCredit_1 = "https://api.themoviedb.org/3/person/";
  movieCredit_2 = "/movie_credits?api_key=";
  
  options: HttpOptions =
  {
    url: ""
  }
  
  constructor(private mydata: MyData ) {}

  async getMovieCredit(persond: number)
  {
    let apiKey = await this.mydata.get("apiKey");
    this.options.url = this.movieCredit_1 + persond + this.movieCredit_2 + apiKey;
    return await this.get(this.options);
  }

  async getMemberData(personId: number)
  {
    let apiKey = await this.mydata.get("apiKey");
    this.options.url = this.memberData_1 + personId + this.memberData_2 + apiKey;
    return await this.get(this.options);
  }

  async getMovieData(id: number)
  {
    let apiKey = await this.mydata.get("apiKey");
    this.options.url = this.movieData_1 + id + this.movieData_2 + apiKey;
    return await this.get(this.options);
  }
  
  async getTrendingMovie()
  {
    let apiKey = await this.mydata.get("apiKey");
    this.options.url = this.movieTrendingUrl + apiKey;

    return await this.get(this.options);
  }

  async setApiKey(apiKey: string)
  {
    await this.mydata.set("apiKey", apiKey);
  }

  async setBaseUrl()
  {
    let apiKey = await this.mydata.get("apiKey");
    this.options.url = this.serviceUrl + apiKey;

    let result = await this.get(this.options);
    this.mydata.set("baseUrl", result.images.base_url);
    this.mydata.set("posterSizes", JSON.stringify(result.images.poster_sizes));
    this.mydata.set("posterSize", result.images.poster_sizes[0]);
    this.mydata.set("imageSizeLength", result.images.poster_sizes.length);
  }

  async get(options: HttpOptions)
  {
    return (await CapacitorHttp.get(options)).data;
  }
}

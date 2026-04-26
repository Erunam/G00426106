import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpOptions } from '@capacitor/core';
import { MyData } from './data';

@Injectable({
  providedIn: 'root',
})

/**
 * Service providing movie information from TheMovieDB
 * It is designed to provide specific requested set of data as per methods
 */
export class MovieDB {
  
  serviceUrl = "https://api.themoviedb.org/3/configuration?api_key=";
  movieTrendingUrl = "https://api.themoviedb.org/3/trending/movie/day?api_key=";
  movieSearch_1 = "https://api.themoviedb.org/3/search/movie?query=";
  movieSearch_2 = "&api_key=";
  movieDetails_1 = "https://api.themoviedb.org/3/movie/";
  movieDetails_2 = "/credits?api_key=";
  memberData_1 = "https://api.themoviedb.org/3/person/";
  memberData_2 = "?api_key=";
  movieCredit_1 = "https://api.themoviedb.org/3/person/";
  movieCredit_2 = "/movie_credits?api_key=";
  movieData_1 = "https://api.themoviedb.org/3/movie/";
  movieData_2 = "?api_key=";
  
  options: HttpOptions =
  {
    url: ""
  }
  
  constructor(private mydata: MyData ) {}

  /**
   * Returns the cast and crew for given movie id
   * @param personId 
   * @returns 
   */
  async getMovieCredit(personId: number)
  {
    let apiKey = await this.mydata.get("apiKey");
    this.options.url = this.movieCredit_1 + personId + this.movieCredit_2 + apiKey;
    return await this.get(this.options);
  }

  /**
   * Return the member data
   * @param personId 
   * @returns 
   */
  async getMemberData(personId: number)
  {
    let apiKey = await this.mydata.get("apiKey");
    this.options.url = this.memberData_1 + personId + this.memberData_2 + apiKey;
    return await this.get(this.options);
  }

  /**
   * Return details about cast and crew for given movie id
   * @param id 
   * @returns 
   */
  async getMovieDetails(id: number)
  {
    let apiKey = await this.mydata.get("apiKey");
    this.options.url = this.movieDetails_1 + id + this.movieDetails_2 + apiKey;
    return await this.get(this.options);
  }

  /**
   * Return movie details for given movie id
   * @param id 
   * @returns 
   */
  async getMovieData(id: number)
  {
    let apiKey = await this.mydata.get("apiKey");
    this.options.url = this.movieData_1 + id + this.movieData_2 + apiKey;
    return await this.get(this.options);

  }

  /**
   * Return search results
   * @param keyword 
   * @returns 
   */
  async getMovies(keyword: string)
  {
    let apiKey = await this.mydata.get("apiKey");
    this.options.url = this.movieSearch_1 + keyword + this.movieSearch_2 + apiKey;
    return await this.get(this.options);
  }

  /**
   * Returns trending movies
   * @returns 
   */
  async getTrendingMovie()
  {
    let apiKey = await this.mydata.get("apiKey");
    this.options.url = this.movieTrendingUrl + apiKey;
    return await this.get(this.options);
  }

  /**
   * Stores provided API key in local storage
   * @param apiKey 
   */
  async setApiKey(apiKey: string)
  {
    await this.mydata.set("apiKey", apiKey);
  }

  /**
   * Retrieves and stores url components used to generate links to the images
   *  - base url
   *  - array providing set of picture sizes available 
   *  - default size of images
   *  - the size of the array
   */
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

  /**
   * Data retrieval method
   * @param options must be HttpOption and contain min "url" component specified
   * @returns 
   */
  async get(options: HttpOptions)
  {
    return (await CapacitorHttp.get(options)).data;
  }
}

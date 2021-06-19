import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";

import {  Observable, throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private REST_API_SERVER = "http://localhost:3000/products";

  public first: string = "";  
  public prev: string = "";  
  public next: string = "";  
  public last: string = "";
  constructor(private httpClient: HttpClient) { }

  parseLinkHeader(header:any) {
    if (header.length == 0) {
      return ;
    }

    let parts = header.split(',');
    let links: {[name:string] : string}= {};
    parts.forEach( (p: string) => {
      let section = p.split(';');
      var url = section[0].replace(/<(.*)>/, '$1').trim();
      var name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;

    });

    this.first  = links["first"];
    this.last   = links["last"];
    this.prev   = links["prev"];
    this.next   = links["next"]; 
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  // public sendGetRequest(){
  //   return this.httpClient.get(this.REST_API_SERVER).pipe(catchError(this.handleError));
  // }

  //with parameter
  // public sendGetRequest(){
  //   // Add safe, URL encoded_page parameter 
  //   const options = { params: new HttpParams({fromString: "_page=1&_limit=20"}) };
  //   //try to connect max 3 times
  //   return this.httpClient.get(this.REST_API_SERVER, options).pipe(retry(3), catchError(this.handleError));
  // }

  // GET /products for getting the products,
  // GET /products/<id> for getting a single product by id,
  // POST /products for creating a new product,
  // PUT /products/<id> for updating a product by id,
  // PATCH /products/<id> for partially updating a product by id,
  // DELETE /products/<id> for deleting a product by id.
  public sendGetRequest(){
    // Add safe, URL encoded _page and _limit parameters 
    return this.httpClient.get<Product[]>(this.REST_API_SERVER, {  params: new HttpParams({fromString: "_page=1&_limit=20"}), observe: "response"}).pipe(retry(3), catchError(this.handleError), tap(res => {
      console.log(res.headers.get('Link'));
      this.parseLinkHeader(res.headers.get('Link'));
    }));
  }

  public sendGetRequestToUrl(url: string){
    return this.httpClient.get<Product[]>(url, { observe: "response"}).pipe(retry(3), catchError(this.handleError), tap(res => {
      console.log(res.headers.get('Link'));
      this.parseLinkHeader(res.headers.get('Link'));

    }));
  }
}
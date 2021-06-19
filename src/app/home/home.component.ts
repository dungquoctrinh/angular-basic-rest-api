import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import {  takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Product } from '../product';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private dataService: ApiService) { }

  ngOnInit() {

    // this.dataService.sendGetRequest().pipe(takeUntil(this.destroy$)).subscribe((data)=>{
    //   console.log(data);
    //   this.products = data;
    // })  

	// this.dataService.sendGetRequest().pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<any>)=>{
	// 	console.log(res);
	// 	this.products = res.body;
	//   })  
	this.dataService.sendGetRequest().pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<Product[]>) => {
		console.log(res);
		this.products = <Product[]>res.body;
	  })
  }

  //unscribe the data
  //should be handle by angular. In rare case then we would need to do it 
  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  public firstPage() {
    this.products = [];
    this.dataService.sendGetRequestToUrl(this.dataService.first).pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<Product[]>) => {
      console.log(res);
      this.products = <Product[]>res.body;
    })
  }
  public previousPage() {

    if (this.dataService.prev !== undefined && this.dataService.prev !== '') {
      this.products = [];
      this.dataService.sendGetRequestToUrl(this.dataService.prev).pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<Product[]>) => {
        console.log(res);
        this.products = <Product[]>res.body;
      })
    }

  }
  public nextPage() {
    if (this.dataService.next !== undefined && this.dataService.next !== '') {
      this.products = [];
      this.dataService.sendGetRequestToUrl(this.dataService.next).pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<Product[]>) => {
        console.log(res);
        this.products = <Product[]>res.body;
      })
    }
  }
  public lastPage() {
    this.products = [];
    this.dataService.sendGetRequestToUrl(this.dataService.last).pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<Product[]>) => {
      console.log(res);
      this.products = <Product[]>res.body;
    })
  }
}
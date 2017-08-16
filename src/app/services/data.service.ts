import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  private isAuthenticated: boolean = false;
  private jwtToken: string = '';
  private userId: string = '';
  constructor() { }

  public setToken(token): void {
    this.jwtToken = token;
    this.isAuthenticated = true;
  }

  public getToken(): any {
    return this.jwtToken;
  }

  public setUserId(id: string): void {
    this.userId = id;
  }
  public getUserId(): string {
    return this.userId;
  }

}

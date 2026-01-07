import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageMasterdataService {

  constructor(
    private http: HttpClient
  ) { }

  private baseUrl: string = environment.apiUrl
  private readonly token: string | null = "Get Token";
  AddRole(role: any) {
    // const headers = new HttpHeaders({
    //   'Authorization' : `Bearer ${this.token}`
    // })
    return this.http.post(`${this.baseUrl}Master/insertRole`, role, {})
  }
  
  getAllRoles() {
    return this.http.get<any>(`${this.baseUrl}Master/getAllRole`);
  }

  getRoleById(id: number) {
  return this.http.get<any>(`${this.baseUrl}Master/getRoleById?roleId=${id}`);
}


  deleteRoleById(id: number) {
    return this.http.delete<any>(`${this.baseUrl}Master/deleteRoleById?roleId=${id}`);
  }
}

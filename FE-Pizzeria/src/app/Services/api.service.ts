import { Injectable } from '@angular/core';
import axios from "axios"
import { apiResponse } from '../Interfaces/apiResponse';
import { enviroment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  SERVER = enviroment.serverURL
  constructor() { }



  //POST NEW RECORD TO 'table'
  async registration(tableName: string, data:any){
    try {
      const response = await axios.post(`${this.SERVER}/${tableName}/registration`, data)
      return {
        status: 200,
        message: "A regisztráció sikeresen megtörtént! Most már bejelentkezhetsz!",
        data: response.data //Nem kötelező vsszaküldeni.
      }
    } catch (err: any) {
      return{
        status: 500,
        message: err.response.data.error
      }
    }
  }


  
  //POST NEW RECORD TO 'table'
  async login(tableName: string, data:any){
    try {
      const response = await axios.post(`${this.SERVER}/${tableName}/login`, data)
      return {
        status: 200,
        message: "Bejelentkeztél",
        data: response.data //Nem kötelező vsszaküldeni.
      }
    } catch (err: any) {
      return{
        status: 500,
        message: err.response.data.error
      }
    }
  }



  //GET ALL RECORD FROM 'table'
  async selectAll(tableName: string):Promise<apiResponse>{
    try {
      const response = await axios.get(`${this.SERVER}/${tableName}`)
      console.log(response)
      return {
        status: 200,
        data: response.data
      }
    } catch (error: any) {
      console.log(error.message);
      return{
        status: 500,
        message: "Valami hiba történt az adatok lekérdésekor"
      }
    }
  }

  //GET ONE RECORD FROM 'table' BY 'id'
  async select(tableName: string, id: number):Promise<apiResponse>{
    try {
      const response = await axios.get(`${this.SERVER}/${tableName}/${id}`)
      return {
        status: 200,
        data: response.data
      }
    } catch (error: any) {
      console.log(error.message);
      return{
        status: 500,
        message: "Valami hiba történt az adatok lekérdésekor"
      }
    }

  }

  //POST NEW RECORD TO 'table'
  async insert(tableName: string, data:any){
    try {
      const response = await axios.post(`${this.SERVER}/${tableName}/`, data)
      return {
        status: 200,
        message: "a rekord sikeresen felvéve!",
        data: response.data //Nem kötelező vsszaküldeni.
      }
    } catch (error: any) {
      console.log(error.message);
      return{
        status: 500,
        message: "Valami hiba történt az adatok módosításakor"
      }
    }
  }

  //UPDATE RECORD FROM 'table' by 'id' 
  async update(tableName: string, id:number, data:any){
    try {
      const response = await axios.patch(`${this.SERVER}/${tableName}/${id}`, data)
      return {
        status: 200,
        message: "a rekord módosítva!",
        data: response.data //Nem kötelező vsszaküldeni.
      }
    } catch (error: any) {
      console.log(error.message);
      return{
        status: 500,
        message: "Valami hiba történt a művelet során"
      }
    }
  }

  // DELETE ONE RECORD FROM 'table' by 'id'
  async delete(tableName:string, id:number){
    try {
      const response = await axios.delete(`${this.SERVER}/${tableName}/${id}`)
      return {
        status: 200,
        message: "Sikeresen törölted a rekordot a táblából!"
      }
    } catch (error: any) {
      console.log(error.message);
      return{
        status: 500,
        message: "Valami hiba történt az adatok lekérdésekor"
      }
    }
  }

  //DELETE ALL record from 'table'
  async deleteAll(tableName:string){
  try {
    const response = await axios.delete(`${this.SERVER}/${tableName}`)
    return {
      status: 200,
      message: "Összes rekord törölve a táblából!"
    }
  } catch (error: any) {
    console.log(error.message);
    return{
      status: 500,
      message: "Valami hiba történt az adatok lekérdésekor"
    }
  }}
}

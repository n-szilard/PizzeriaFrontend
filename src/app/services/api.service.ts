import { Injectable } from '@angular/core';
import axios from 'axios';
import { ApiResponse } from '../interfaces/apiResponse';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  SERVER = 'http://localhost:3000';
  constructor() {}

  async registration(table: string, data: any) {
    try {
      const response = await axios.post(`${this.SERVER}/${table}/registration`, data);
      return {
        status: 200,
        message: "A regisztráció sikeres!",
        data: response.data
      }
    }
    catch (error: any) {
      return {
        status: 500,
        message: error.response.data.error
      }
    }
  }

  async login(table: string, data: any) {
    try {
      const response = await axios.post(`${this.SERVER}/${table}/login`, data);
      return {
        status: 200,
        message: "A belépés sikeres!",
        data: response.data
      }
    }
    catch (error: any) {
      return {
        status: 500,
        message: error.response.data.error
      }
    }
  }

  async upload(formData: FormData): Promise<ApiResponse> {
    try {
      const response = await axios.post(`${this.SERVER}/upload`, formData);
      return {
        status: 200,
        data: response.data
      }
    } catch (error: any) {
      return {
        status: 500,
        message: "Internal Server Error"
      }
    }
  }

  async deleteImage(filename: string): Promise<ApiResponse> {
    try {
      const response = await axios.delete(`${this.SERVER}/image/${filename}`);
      return {
        status: 200,
        data: response.data
      }
    } catch (error: any) {
      return {
        status: 500,
        message: "Nem sikerült törölni a képet"
      }
    }
  }

  // GET all records from table
  async selectAll(table: string): Promise<ApiResponse> {
    try {
      const response = await axios.get(`${this.SERVER}/${table}`);
      return {
        status: 200,
        data: response.data
      }
    }
    catch (error: any) {
      return {
        status: 500,
        message: "Internal Server Error"
      }
    }
  }

  // Get one record from table by id
  async selectOne(table: string, id: number): Promise<ApiResponse> {
    try {
      const response = await axios.get(`${this.SERVER}/${table}/${id}`);
      return {
        status: 200,
        data: response.data
      }
    }
    catch (error: any) {
      return {
        status: 500,
        message: "Internal Server Error"
      }
    }
  }

  // POST new record to table
  async insert(table: string, data: any): Promise<ApiResponse> {
    try {
      const response = await axios.post(`${this.SERVER}/${table}`, data);
      return {
        status: 200,
        message: "Rekord felveve",
        data: response.data
      }
    }
    catch (error: any) {
      return {
        status: 500,
        message: "Internal Server Error"
      }
    }
  }

  // PATCH update record in table
  async update(table: string, id: number, data: any): Promise<ApiResponse> {
    try {
      const response = await axios.patch(`${this.SERVER}/${table}/${id}`, data);
      return {
        status: 200,
        message: "Rekord modositva",
        data: response.data
      }
    }
    catch (error: any) {
      return {
        status: 500,
        message: "Internal Server Error"
      }
    }
  }

  // DELETE ONE record from table by id
  async delete(table: string, id: number): Promise<ApiResponse> {
    try {
      const response = await axios.delete(`${this.SERVER}/${table}/${id}`);
      return {
        status: 200,
        message: "A rekord sikeresen törölve"
      }
    }
    catch (error: any) {
      return {
        status: 500,
        message: "Internal Server Error"
      }
    }
  }

}
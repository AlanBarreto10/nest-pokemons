import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';


@Injectable()
export class SeedService {

  /*
    Si se quiere cambiar de paquete por x motivo (fetch u otro):
    Crear un adaptador (wrapper) para envolver el paquete (axios) e injectar en la clase
    -> Common/Interface-->http-adapter.interface: definicion de lo que necesito una clase a implementar(Ej: get<T>)
    -> Common/Adapter --->axios.adapter.ts: implementacion de los metodos de la interface (implements HttpAdapter)
  */
  private readonly axios: AxiosInstance = axios;

  constructor(
      @InjectModel(Pokemon.name)
      private readonly pokemonModel: Model<Pokemon>
    ){}
  
  async executedSeed() {
    await this.pokemonModel.deleteMany();

    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    
    const pokemonToInsert: { name: string, no: number} [] = [];


    data.results.forEach(async ({name, url}) => {
      const segments = url.split('/');
      const no = +segments[segments.length-2];

      pokemonToInsert.push({name, no});
    })

    await this.pokemonModel.insertMany(pokemonToInsert);
    return 'Seed executed';
  }

}

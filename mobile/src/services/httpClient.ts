import axios from 'axios';

// a conexão com o aws api
// essa url você encontra no console do aws api gateway abaixo de invoke.
// por segurança ela foi retirada do código 
export const httpClient = axios.create({
  baseURL: 'https://******.execute-api.us-east-1.amazonaws.com',
});

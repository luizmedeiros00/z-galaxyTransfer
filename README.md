## Teste Api Liverfly

Para iniciar o projeto siga as instruções

```
npm install (node na versão 19)
docker-compose up -d (para subir o banco de dados)
node_modules/db-migrate/bin/db-migrate up
npx nodemon src/main.ts
```
a api estara rodando em http://localhost:3000

## Api
#### Cadastrar Piloto
POST http://localhost:3000/aviators
```RequestBody
{
    "name": "Luiz",
    "flyCardNumber": 2,
    "currentPlanet": "Meraki"
}
```
#### Cadastrar Aeronave
POST http://localhost:3000/airships
```RequestBody
{
    "model": "Airship Model",
    "yearManufacture": 2023,
    "fuelCapacity": 100,
    "flyCardNumberAviator": 2   
}
```
#### Cadastrar Voo
POST http://localhost:3000/flights
```RequestBody
{
    "startAt": "2023-04-18 10:42:00",
     "arrivalAt": "2023-04-20 12:00:00",
     "destinationPlanet": "Kefir",
     "airshipId": 1
}
```
#### Recuperar dados do piloto
GET http://localhost:3000/aviators/:flyCardNumber

#### Recuperar historico de voos do piloto
GET http://localhost:3000/flights/:flyCardNumber


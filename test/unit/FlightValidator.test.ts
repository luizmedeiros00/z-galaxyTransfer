import FlightValidator from "../../src/application/validators/FlightValidator"

test("deve retornar true se as datas do FlightData são válidas", function () {
   const flightData =  {
        startAt: new Date('2023-04-16 18:00:00'),
        arrivalAt: new Date('2023-04-17 18:00:00'),
        destinationPlanet: 'planet 1',
        airshipId: 1,
    }

   const valid =  FlightValidator.validateDates(flightData)

   expect(valid).toBe(true)
})

test("deve retornar false se as datas do FlightData não forem válidas", function () {
    const flightData =  {
         startAt: new Date('2023-04-16 18:00:00'),
         arrivalAt: new Date('2023-04-14 18:00:00'),
         destinationPlanet: 'planet 1',
         airshipId: 1,
     }
 
    const valid =  FlightValidator.validateDates(flightData)
 
    expect(valid).toBe(false)
 })
import Flight from "../../src/domain/entity/flights/Flight"

test('Deve retornar true se o voo ja foi finalizado', function() {
    const flight = new Flight(
        1,
        new Date('2023-04-10 08:00:00'),
        new Date('2023-04-16 12:00:00'),
        'destination_planet',
        'origin_planet',
        1,
        'airship_model',
        100,
        100
    )

    const finished = flight.finished(new Date('2023-04-17 12:00:00'))
    expect(finished).toBe(true)

    const finishedForHour = flight.finished(new Date('2023-04-16 13:00:00'))
    expect(finishedForHour).toBe(true)
})
import AviatorValidator from "../../src/application/validators/AviatorValidator"

test("Deve validar se o fly card number é primo", function () {
    const flyCardNumber: number = 2
    const isPrime = AviatorValidator.validateFlyCardNumber(flyCardNumber)
    expect(isPrime).toBe(true)
})

test("Deve retornar false se o fly card number não for primo", function() {
    const flyCardNumber: number = 4
    const isPrime = AviatorValidator.validateFlyCardNumber(flyCardNumber)
    expect(isPrime).toBe(false)
})
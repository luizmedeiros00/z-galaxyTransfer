
export default class AviatorValidator {
    static validateFlyCardNumber(flyCardNumber: number): boolean {
        if (flyCardNumber <= 1) {
            return false;
        }

        for (let i = 2; i <= Math.sqrt(flyCardNumber); i++) {
            if (flyCardNumber % i === 0) {
                return false;
            }
        }

        return true;
    }
}
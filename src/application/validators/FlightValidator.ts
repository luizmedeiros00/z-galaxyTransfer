import { isAfter } from 'date-fns';
import FlightData from '../../domain/entity/flights/FlightData';

export default class FlightValidator {
  static validateDates(flight: FlightData): boolean {
    return isAfter(flight.arrivalAt, flight.startAt)
  }

  static isTomorrow(firstDate: Date, nextDate: Date) {
    const newLastFlightDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());
    const newStartDateNewFlight = new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate());
    return newStartDateNewFlight > newLastFlightDate
  }
}
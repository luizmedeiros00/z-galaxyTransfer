import { isAfter } from 'date-fns';
import FlightData from '../../domain/entity/flights/FlightData';

export default class FlightValidator {
  static validateDates(flight: FlightData): boolean {
    return isAfter(flight.arrivalAt, flight.startAt)
  }
}
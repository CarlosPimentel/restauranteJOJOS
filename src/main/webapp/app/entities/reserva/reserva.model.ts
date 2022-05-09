import dayjs from 'dayjs/esm';
import { IMesa } from 'app/entities/mesa/mesa.model';

export interface IReserva {
  id?: number;
  fecha?: dayjs.Dayjs;
  mesa?: IMesa | null;
}

export class Reserva implements IReserva {
  constructor(public id?: number, public fecha?: dayjs.Dayjs, public mesa?: IMesa | null) {}
}

export function getReservaIdentifier(reserva: IReserva): number | undefined {
  return reserva.id;
}

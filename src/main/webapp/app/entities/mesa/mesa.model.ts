import { IReserva } from 'app/entities/reserva/reserva.model';
import { IRegistroMesa } from 'app/entities/registro-mesa/registro-mesa.model';

export interface IMesa {
  id?: number;
  estado?: number;
  numero?: number;
  reservas?: IReserva[] | null;
  registroMesas?: IRegistroMesa[] | null;
}

export class Mesa implements IMesa {
  constructor(
    public id?: number,
    public estado?: number,
    public numero?: number,
    public reservas?: IReserva[] | null,
    public registroMesas?: IRegistroMesa[] | null
  ) {}
}

export function getMesaIdentifier(mesa: IMesa): number | undefined {
  return mesa.id;
}

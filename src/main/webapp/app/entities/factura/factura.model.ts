import dayjs from 'dayjs/esm';
import { IRegistroMesa } from 'app/entities/registro-mesa/registro-mesa.model';

export interface IFactura {
  id?: number;
  fecha?: dayjs.Dayjs;
  registroMesa?: IRegistroMesa | null;
}

export class Factura implements IFactura {
  constructor(public id?: number, public fecha?: dayjs.Dayjs, public registroMesa?: IRegistroMesa | null) {}
}

export function getFacturaIdentifier(factura: IFactura): number | undefined {
  return factura.id;
}

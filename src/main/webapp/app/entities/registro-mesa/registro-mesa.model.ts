import dayjs from 'dayjs/esm';
import { IMesa } from 'app/entities/mesa/mesa.model';
import { IFactura } from 'app/entities/factura/factura.model';
import { ILineaPedido } from 'app/entities/linea-pedido/linea-pedido.model';

export interface IRegistroMesa {
  id?: number;
  fecha?: dayjs.Dayjs;
  mesa?: IMesa | null;
  factura?: IFactura | null;
  lineaPedidos?: ILineaPedido[] | null;
}

export class RegistroMesa implements IRegistroMesa {
  constructor(
    public id?: number,
    public fecha?: dayjs.Dayjs,
    public mesa?: IMesa | null,
    public factura?: IFactura | null,
    public lineaPedidos?: ILineaPedido[] | null
  ) {}
}

export function getRegistroMesaIdentifier(registroMesa: IRegistroMesa): number | undefined {
  return registroMesa.id;
}

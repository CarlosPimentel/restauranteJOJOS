import { IRegistroMesa } from 'app/entities/registro-mesa/registro-mesa.model';
import { IProducto } from 'app/entities/producto/producto.model';

export interface ILineaPedido {
  id?: number;
  precio?: number;
  iva?: number;
  cantidad?: number;
  registroMesa?: IRegistroMesa | null;
  producto?: IProducto | null;
}

export class LineaPedido implements ILineaPedido {
  constructor(
    public id?: number,
    public precio?: number,
    public iva?: number,
    public cantidad?: number,
    public registroMesa?: IRegistroMesa | null,
    public producto?: IProducto | null
  ) {}
}

export function getLineaPedidoIdentifier(lineaPedido: ILineaPedido): number | undefined {
  return lineaPedido.id;
}

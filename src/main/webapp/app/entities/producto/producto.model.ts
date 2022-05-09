import { ILineaPedido } from 'app/entities/linea-pedido/linea-pedido.model';

export interface IProducto {
  id?: number;
  tipo?: number;
  referencia?: string;
  nombre?: string;
  precio?: number;
  iva?: number;
  url?: string;
  lineaPedidos?: ILineaPedido[] | null;
}

export class Producto implements IProducto {
  constructor(
    public id?: number,
    public tipo?: number,
    public referencia?: string,
    public nombre?: string,
    public precio?: number,
    public iva?: number,
    public url?: string,
    public lineaPedidos?: ILineaPedido[] | null
  ) {}
}

export function getProductoIdentifier(producto: IProducto): number | undefined {
  return producto.id;
}

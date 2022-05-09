import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LineaPedidoService } from '../service/linea-pedido.service';
import { ILineaPedido, LineaPedido } from '../linea-pedido.model';
import { IRegistroMesa } from 'app/entities/registro-mesa/registro-mesa.model';
import { RegistroMesaService } from 'app/entities/registro-mesa/service/registro-mesa.service';
import { IProducto } from 'app/entities/producto/producto.model';
import { ProductoService } from 'app/entities/producto/service/producto.service';

import { LineaPedidoUpdateComponent } from './linea-pedido-update.component';

describe('LineaPedido Management Update Component', () => {
  let comp: LineaPedidoUpdateComponent;
  let fixture: ComponentFixture<LineaPedidoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let lineaPedidoService: LineaPedidoService;
  let registroMesaService: RegistroMesaService;
  let productoService: ProductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LineaPedidoUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(LineaPedidoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LineaPedidoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    lineaPedidoService = TestBed.inject(LineaPedidoService);
    registroMesaService = TestBed.inject(RegistroMesaService);
    productoService = TestBed.inject(ProductoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call RegistroMesa query and add missing value', () => {
      const lineaPedido: ILineaPedido = { id: 456 };
      const registroMesa: IRegistroMesa = { id: 16317 };
      lineaPedido.registroMesa = registroMesa;

      const registroMesaCollection: IRegistroMesa[] = [{ id: 1565 }];
      jest.spyOn(registroMesaService, 'query').mockReturnValue(of(new HttpResponse({ body: registroMesaCollection })));
      const additionalRegistroMesas = [registroMesa];
      const expectedCollection: IRegistroMesa[] = [...additionalRegistroMesas, ...registroMesaCollection];
      jest.spyOn(registroMesaService, 'addRegistroMesaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ lineaPedido });
      comp.ngOnInit();

      expect(registroMesaService.query).toHaveBeenCalled();
      expect(registroMesaService.addRegistroMesaToCollectionIfMissing).toHaveBeenCalledWith(
        registroMesaCollection,
        ...additionalRegistroMesas
      );
      expect(comp.registroMesasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Producto query and add missing value', () => {
      const lineaPedido: ILineaPedido = { id: 456 };
      const producto: IProducto = { id: 31705 };
      lineaPedido.producto = producto;

      const productoCollection: IProducto[] = [{ id: 49863 }];
      jest.spyOn(productoService, 'query').mockReturnValue(of(new HttpResponse({ body: productoCollection })));
      const additionalProductos = [producto];
      const expectedCollection: IProducto[] = [...additionalProductos, ...productoCollection];
      jest.spyOn(productoService, 'addProductoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ lineaPedido });
      comp.ngOnInit();

      expect(productoService.query).toHaveBeenCalled();
      expect(productoService.addProductoToCollectionIfMissing).toHaveBeenCalledWith(productoCollection, ...additionalProductos);
      expect(comp.productosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const lineaPedido: ILineaPedido = { id: 456 };
      const registroMesa: IRegistroMesa = { id: 7228 };
      lineaPedido.registroMesa = registroMesa;
      const producto: IProducto = { id: 73470 };
      lineaPedido.producto = producto;

      activatedRoute.data = of({ lineaPedido });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(lineaPedido));
      expect(comp.registroMesasSharedCollection).toContain(registroMesa);
      expect(comp.productosSharedCollection).toContain(producto);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LineaPedido>>();
      const lineaPedido = { id: 123 };
      jest.spyOn(lineaPedidoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lineaPedido });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lineaPedido }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(lineaPedidoService.update).toHaveBeenCalledWith(lineaPedido);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LineaPedido>>();
      const lineaPedido = new LineaPedido();
      jest.spyOn(lineaPedidoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lineaPedido });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lineaPedido }));
      saveSubject.complete();

      // THEN
      expect(lineaPedidoService.create).toHaveBeenCalledWith(lineaPedido);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LineaPedido>>();
      const lineaPedido = { id: 123 };
      jest.spyOn(lineaPedidoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lineaPedido });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(lineaPedidoService.update).toHaveBeenCalledWith(lineaPedido);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackRegistroMesaById', () => {
      it('Should return tracked RegistroMesa primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackRegistroMesaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackProductoById', () => {
      it('Should return tracked Producto primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProductoById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});

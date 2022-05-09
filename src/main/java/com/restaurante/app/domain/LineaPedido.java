package com.restaurante.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A LineaPedido.
 */
@Entity
@Table(name = "linea_pedido")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class LineaPedido implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "precio", nullable = false)
    private Double precio;

    @NotNull
    @Column(name = "iva", nullable = false)
    private Integer iva;

    @NotNull
    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @ManyToOne
    @JsonIgnoreProperties(value = { "mesa", "factura", "lineaPedidos" }, allowSetters = true)
    private RegistroMesa registroMesa;

    @ManyToOne
    @JsonIgnoreProperties(value = { "lineaPedidos" }, allowSetters = true)
    private Producto producto;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public LineaPedido id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getPrecio() {
        return this.precio;
    }

    public LineaPedido precio(Double precio) {
        this.setPrecio(precio);
        return this;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Integer getIva() {
        return this.iva;
    }

    public LineaPedido iva(Integer iva) {
        this.setIva(iva);
        return this;
    }

    public void setIva(Integer iva) {
        this.iva = iva;
    }

    public Integer getCantidad() {
        return this.cantidad;
    }

    public LineaPedido cantidad(Integer cantidad) {
        this.setCantidad(cantidad);
        return this;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public RegistroMesa getRegistroMesa() {
        return this.registroMesa;
    }

    public void setRegistroMesa(RegistroMesa registroMesa) {
        this.registroMesa = registroMesa;
    }

    public LineaPedido registroMesa(RegistroMesa registroMesa) {
        this.setRegistroMesa(registroMesa);
        return this;
    }

    public Producto getProducto() {
        return this.producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public LineaPedido producto(Producto producto) {
        this.setProducto(producto);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LineaPedido)) {
            return false;
        }
        return id != null && id.equals(((LineaPedido) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LineaPedido{" +
            "id=" + getId() +
            ", precio=" + getPrecio() +
            ", iva=" + getIva() +
            ", cantidad=" + getCantidad() +
            "}";
    }
}

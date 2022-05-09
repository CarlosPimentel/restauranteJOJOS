package com.restaurante.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A RegistroMesa.
 */
@Entity
@Table(name = "registro_mesa")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class RegistroMesa implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "fecha", nullable = false)
    private ZonedDateTime fecha;

    @ManyToOne
    @JsonIgnoreProperties(value = { "reservas", "registroMesas" }, allowSetters = true)
    private Mesa mesa;

    @JsonIgnoreProperties(value = { "registroMesa" }, allowSetters = true)
    @OneToOne(mappedBy = "registroMesa")
    private Factura factura;

    @OneToMany(mappedBy = "registroMesa")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "registroMesa", "producto" }, allowSetters = true)
    private Set<LineaPedido> lineaPedidos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public RegistroMesa id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getFecha() {
        return this.fecha;
    }

    public RegistroMesa fecha(ZonedDateTime fecha) {
        this.setFecha(fecha);
        return this;
    }

    public void setFecha(ZonedDateTime fecha) {
        this.fecha = fecha;
    }

    public Mesa getMesa() {
        return this.mesa;
    }

    public void setMesa(Mesa mesa) {
        this.mesa = mesa;
    }

    public RegistroMesa mesa(Mesa mesa) {
        this.setMesa(mesa);
        return this;
    }

    public Factura getFactura() {
        return this.factura;
    }

    public void setFactura(Factura factura) {
        if (this.factura != null) {
            this.factura.setRegistroMesa(null);
        }
        if (factura != null) {
            factura.setRegistroMesa(this);
        }
        this.factura = factura;
    }

    public RegistroMesa factura(Factura factura) {
        this.setFactura(factura);
        return this;
    }

    public Set<LineaPedido> getLineaPedidos() {
        return this.lineaPedidos;
    }

    public void setLineaPedidos(Set<LineaPedido> lineaPedidos) {
        if (this.lineaPedidos != null) {
            this.lineaPedidos.forEach(i -> i.setRegistroMesa(null));
        }
        if (lineaPedidos != null) {
            lineaPedidos.forEach(i -> i.setRegistroMesa(this));
        }
        this.lineaPedidos = lineaPedidos;
    }

    public RegistroMesa lineaPedidos(Set<LineaPedido> lineaPedidos) {
        this.setLineaPedidos(lineaPedidos);
        return this;
    }

    public RegistroMesa addLineaPedido(LineaPedido lineaPedido) {
        this.lineaPedidos.add(lineaPedido);
        lineaPedido.setRegistroMesa(this);
        return this;
    }

    public RegistroMesa removeLineaPedido(LineaPedido lineaPedido) {
        this.lineaPedidos.remove(lineaPedido);
        lineaPedido.setRegistroMesa(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RegistroMesa)) {
            return false;
        }
        return id != null && id.equals(((RegistroMesa) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RegistroMesa{" +
            "id=" + getId() +
            ", fecha='" + getFecha() + "'" +
            "}";
    }
}

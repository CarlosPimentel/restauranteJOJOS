package com.restaurante.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Producto.
 */
@Entity
@Table(name = "producto")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Producto implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Min(value = 0)
    @Max(value = 4)
    @Column(name = "tipo", nullable = false)
    private Integer tipo;

    @NotNull
    @Column(name = "referencia", nullable = false)
    private String referencia;

    @NotNull
    @Column(name = "nombre", nullable = false)
    private String nombre;

    @NotNull
    @Column(name = "precio", nullable = false)
    private Double precio;

    @NotNull
    @Column(name = "iva", nullable = false)
    private Integer iva;

    @NotNull
    @Column(name = "url", nullable = false)
    private String url;

    @OneToMany(mappedBy = "producto")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "registroMesa", "producto" }, allowSetters = true)
    private Set<LineaPedido> lineaPedidos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Producto id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getTipo() {
        return this.tipo;
    }

    public Producto tipo(Integer tipo) {
        this.setTipo(tipo);
        return this;
    }

    public void setTipo(Integer tipo) {
        this.tipo = tipo;
    }

    public String getReferencia() {
        return this.referencia;
    }

    public Producto referencia(String referencia) {
        this.setReferencia(referencia);
        return this;
    }

    public void setReferencia(String referencia) {
        this.referencia = referencia;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Producto nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Double getPrecio() {
        return this.precio;
    }

    public Producto precio(Double precio) {
        this.setPrecio(precio);
        return this;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Integer getIva() {
        return this.iva;
    }

    public Producto iva(Integer iva) {
        this.setIva(iva);
        return this;
    }

    public void setIva(Integer iva) {
        this.iva = iva;
    }

    public String getUrl() {
        return this.url;
    }

    public Producto url(String url) {
        this.setUrl(url);
        return this;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Set<LineaPedido> getLineaPedidos() {
        return this.lineaPedidos;
    }

    public void setLineaPedidos(Set<LineaPedido> lineaPedidos) {
        if (this.lineaPedidos != null) {
            this.lineaPedidos.forEach(i -> i.setProducto(null));
        }
        if (lineaPedidos != null) {
            lineaPedidos.forEach(i -> i.setProducto(this));
        }
        this.lineaPedidos = lineaPedidos;
    }

    public Producto lineaPedidos(Set<LineaPedido> lineaPedidos) {
        this.setLineaPedidos(lineaPedidos);
        return this;
    }

    public Producto addLineaPedido(LineaPedido lineaPedido) {
        this.lineaPedidos.add(lineaPedido);
        lineaPedido.setProducto(this);
        return this;
    }

    public Producto removeLineaPedido(LineaPedido lineaPedido) {
        this.lineaPedidos.remove(lineaPedido);
        lineaPedido.setProducto(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Producto)) {
            return false;
        }
        return id != null && id.equals(((Producto) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Producto{" +
            "id=" + getId() +
            ", tipo=" + getTipo() +
            ", referencia='" + getReferencia() + "'" +
            ", nombre='" + getNombre() + "'" +
            ", precio=" + getPrecio() +
            ", iva=" + getIva() +
            ", url='" + getUrl() + "'" +
            "}";
    }
}

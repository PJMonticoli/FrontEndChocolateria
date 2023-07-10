import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EstadoPedido } from 'src/app/models/estado-pedido';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { EstadoPedidoService } from 'src/app/services/estado-pedido.service';
import { PedidoService } from 'src/app/services/pedido.service';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-estado-pedido',
  templateUrl: './estado-pedido.component.html',
  styleUrls: ['./estado-pedido.component.css']
})
export class EstadoPedidoComponent implements OnInit, OnDestroy {
  private subscription : Subscription;
  @Input() pedido: any;
  @Output() onActualizado = new EventEmitter();
  estadosPedido: EstadoPedido[];
  formulario: FormGroup;
  constructor(private servicioPedido : PedidoService,
             private servicioEstado : EstadoPedidoService,
             private formBuilder : FormBuilder){}

  ngOnInit(): void {
    this.subscription = new Subscription();
    this.formulario = this.formBuilder.group({
      estadoPedido : [,Validators.required]
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  getEstados(): void {
    this.subscription.add(
      this.servicioEstado.obtenerTodos().subscribe({
        next: (r: ResultadoGenerico) => {
          if (r.ok && r.resultado) {
            if (this.pedido.estado === 'Pagado') {
              this.estadosPedido = r.resultado.filter((x) => {
                return x.nombre === 'Entregado' || x.nombre === 'Cancelado';
              }) as EstadoPedido[];
            } else if (this.pedido.estado === 'Creado') {
              this.estadosPedido = r.resultado.filter((x) => {
                return x.nombre === 'Cancelado';
              }) as EstadoPedido[];
            } else if (this.pedido.estado === 'Entregado') {
              this.estadosPedido = r.resultado.filter((x) => {
                return x.nombre === 'Cancelado';
              }) as EstadoPedido[];
            }
          } else {
            console.error(r.mensaje);
          }
        },
        error: (e) => {
          console.error(e);
        }
      })
    );
  }

  modificoEstado() : void{
    if(this.formulario.valid){
      const body = {
        idEstado : this.formulario.controls['estadoPedido'].value.id,
        idPedido : this.pedido.id
      }
      this.subscription.add(
        this.servicioPedido.actualizarEstado(body).subscribe({
          next : (res : ResultadoGenerico)=>{
            if(res.ok){
              Swal.fire({title: "Listo", text : "Actualizo el estado del pedido con éxito", icon: "success"})
              this.onActualizado.emit();
            }else{
              Swal.fire({title: "Error", text : "Error al intentar actualizar estado del pedido", icon: "error"})  
            }
          },
          error : (e)=>{
            Swal.fire({title:'Error!', text: `${e.message}`, icon: 'error'});
          }
        })
      )
    }
  }

  get controlEstado() : FormControl{
    return this.formulario.controls['estadoPedido'] as FormControl;
  }

}

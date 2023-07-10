import {
  Component,EventEmitter,Input,OnDestroy,OnInit,Output,} from '@angular/core';
import {FormBuilder,FormControl,FormGroup,Validators,} from '@angular/forms';
import { Subscription } from 'rxjs';
import { DetallePedido } from 'src/app/models/detalle-pedido';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { TipoPago } from 'src/app/models/tipo-pago';
import { CobroService } from 'src/app/services/cobro.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { TipoPagoService } from 'src/app/services/tipo-pago.service';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-cobro',
  templateUrl: './cobro.component.html',
  styleUrls: ['./cobro.component.css'],
})
export class CobroComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  tiposPago: TipoPago[];
  cobraConTarjeta: boolean;
  labelBoton: string;
  formulario: FormGroup;
  mostrarCodQr: boolean = false;
  @Input() abonaCliente: boolean;
  @Input() disabled: boolean;
  @Input() pedido: any;
  @Output() onCobrado = new EventEmitter();
  detalles: DetallePedido[];
  montoTotal: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private servicioTipoPago: TipoPagoService,
    private servicioPedido: PedidoService,
    private servicioCobro: CobroService
  ) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.disabled = this.pedido.estado != 'Creado';
    this.labelBoton = this.abonaCliente? 'Pagar' : 'Cobrar'
    this.subscription = new Subscription();
    this.formulario = this.formBuilder.group({
      tipoPago: [,Validators.required],
      codigoAutorizacion: [,Validators.required],
    })
    this.obtenerTiposPago();
    this.formulario.controls["tipoPago"].valueChanges.subscribe(x => {
      if(x.nombre == 'Tarjeta de Débito' || x.nombre == 'Tarjeta de Crédito') {
        this.formulario.controls['codigoAutorizacion'].setValidators([Validators.required]);
        this.cobraConTarjeta = true;
        this.mostrarCodQr = false;
      } else if (x.nombre == 'Mercado Pago') {
        this.formulario.controls['codigoAutorizacion'].clearValidators();
        this.cobraConTarjeta = false;
        this.mostrarCodQr = true;
      } else {
        this.formulario.controls['codigoAutorizacion'].clearValidators();
        this.cobraConTarjeta = false;
        this.mostrarCodQr = false;
      }
      this.formulario.controls['codigoAutorizacion'].reset();
      this.formulario.controls['codigoAutorizacion'].updateValueAndValidity();
   })
  }
  calcularTotal(): void {
    let total = 0;
    this.detalles.forEach(x => {
      total = total + x.precioUnitario * x.cantidad;
    });
    this.montoTotal = total;
  }
  obtenerTiposPago(): void {
    this.subscription.add(
      this.servicioTipoPago.obtenerTodos().subscribe({
        next: (r: ResultadoGenerico) => {
          if (r.ok && r.resultado) {
            if (this.abonaCliente) {
              this.tiposPago = r.resultado.filter(x => {
                return x.nombre == 'Mercado Pago' || x.nombre == 'Tarjeta de Crédito' || x.nombre == 'Tarjeta de Débito';
              });
            } else {
              this.tiposPago = r.resultado as TipoPago[];
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
  
  obtenerDetalles(): void {
    if(!this.pedido.id){
      console.error("Pedido id is undefined");
      return;
    }
    this.subscription.add(
      this.servicioPedido.obtenerDetalles(this.pedido.id).subscribe({
        next: (r: ResultadoGenerico) => {
          if(r.ok){
            this.detalles = r.resultado? r.resultado : [];
            this.calcularTotal();
          }
          else {
            console.error(r.mensaje);
          }
        },
        error: (e) => {
          console.error(e);
        }
      })
    )
  }
  guardarCobro(): void {
    if(this.formulario.valid) {
      const { tipoPago, codigoAutorizacion } = this.formulario.value;
      const reqbody = {
        idPedido: this.pedido.id,
        tipoPago: tipoPago, 
        codigoAutorizacion: codigoAutorizacion, 
        montoCobrado: this.montoTotal
      }
      this.subscription.add(
        this.servicioCobro.agregar(reqbody).subscribe({
          next: (r: ResultadoGenerico) => {
            if(r.ok){
              this.onCobrado.emit();
              const verbo = this.abonaCliente ? 'Pago' : 'Cobro';
              Swal.fire({title:'Listo!', text:`${verbo} realizado con éxito`, icon: 'success'});
            } else {
              Swal.fire({title:'Oops!', text:`Ocurrió un error`, icon: 'error'});
              console.error(r.mensaje);
            }

          },
          error: (e) => {
            Swal.fire({title:'Error!', text:`Ocurrió un error`, icon: 'error'});
            console.error(e);
          }
        })
      )
    } else {
      Swal.fire({title:'Atención!', text:`Revise los campos!`, icon: 'warning'});
    }
  }

  get controlTipoPago(): FormControl {
    return this.formulario.controls['tipoPago'] as FormControl;
  }
  get controlCodAutorizacion(): FormControl {
    return this.formulario.controls['codigoAutorizacion'] as FormControl;
  }
}

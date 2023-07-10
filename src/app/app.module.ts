import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SesionIniciadaService } from './services/sesion-iniciada.service';
import { UsuarioService } from './services/usuario.service';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AltaPedidoComponent } from './components/pedidos/alta-pedido/alta-pedido.component';
import { ElementoProductoComponent } from './components/pedidos/elemento-producto/elemento-producto.component';
import { ListadoPedidosComponent } from './components/pedidos/listados/listado-pedidos/listado-pedidos.component';
import { ProductoService } from './services/producto.service';
import { PedidoService } from './services/pedido.service';
import { DetallesPedidoComponent } from './components/pedidos/detalles-pedido/detalles-pedido.component';
import { EstadoPedidoComponent } from './components/pedidos/estado-pedido/estado-pedido.component';
import { EstadoPedidoService } from './services/estado-pedido.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListadoPedidosPendientesComponent } from './components/pedidos/listados/listado-pedidos-pendientes/listado-pedidos-pendientes.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CobroComponent } from './components/pedidos/cobro/cobro.component';
import { CobroService } from './services/cobro.service';
import { TipoPagoService } from './services/tipo-pago.service';
import { ListadoPedidosPropiosComponent } from './components/pedidos/listados/listado-pedidos-propios/listado-pedidos-propios.component';
import { AltaSocioComponent } from './components/socios/alta-socio/alta-socio.component';
import { ListadoSociosComponent } from './components/socios/listado-socios/listado-socios.component';
import { SocioService } from './services/socio.service';
import { DetallesSocioComponent } from './components/socios/detalles-socio/detalles-socio.component';
import { BajaSocioComponent } from './components/socios/baja-socio/baja-socio.component';
import { AltaProductoComponent } from './components/productos/alta-producto/alta-producto.component';
import { ListadoProductosComponent } from './components/productos/listado-productos/listado-productos.component';
import { BajaProductoComponent } from './components/productos/baja-producto/baja-producto.component';
import { RegistroUsuarioExternoComponent } from './components/usuarios/registro-usuario-externo/registro-usuario-externo.component';
import { FiltroPipe } from './pipes/filtro.pipe';
import { FiltroSocioPipe } from './pipes/filtro-socio.pipe';
import { FiltroPedidoPipe } from './pipes/filtro-pedido.pipe';
import { CancelarPedidoComponent } from './components/pedidos/cancelar-pedido/cancelar-pedido.component';
import { AltaPromocionComponent } from './components/promociones/alta-promocion/alta-promocion.component';
import { PromocionService } from './services/promocion.service';
import { ListadoPromocionesComponent } from './components/promociones/listados/listado-promociones/listado-promociones.component';
import { FiltroPromocionPipe } from './pipes/filtro-promocion.pipe';
import { BajaPromocionComponent } from './components/promociones/baja-promocion/baja-promocion.component';
import { ListadoPromocionesDisponiblesComponent } from './components/promociones/listados/listado-promociones-disponibles/listado-promociones-disponibles.component';
import { CanjearComponent } from './components/promociones/canjear/canjear.component';
import { AltaStockComponent } from './components/productos/stock/alta-stock/alta-stock.component';
import { ListadoStockComponent } from './components/productos/stock/listado-stock/listado-stock.component';
import { ListadoPromocionesCanjeadasComponent } from './components/promociones/listados/listado-promociones-canjeadas/listado-promociones-canjeadas.component';
import { DetallesPromocionCanjeadaComponent } from './components/promociones/detalles-promocion-canjeada/detalles-promocion-canjeada.component';
import { FiltroCanjeadasPipe } from './pipes/filtro-canjeadas.pipe';
import { ReporteSociosComponent } from './components/reportes/reporte-socios/reporte-socios.component';
import { NgChartsModule } from 'ng2-charts';
import { ReporteProductosComponent } from './components/reportes/reporte-productos/reporte-productos.component';
import { FiltroReportePipe } from './pipes/filtro-reporte.pipe';
import { FiltroReporteSocioPipe } from './pipes/filtro-reporte-socio.pipe';
import { ReportePromocionesComponent } from './components/reportes/reporte-promociones/reporte-promociones.component';
import { FiltroReportePromocionPipe } from './pipes/filtro-reporte-promocion.pipe';
import { FiltroAltaPedidoPipe } from './pipes/filtro-alta-pedido.pipe';
import { ReporteCobrosComponent } from './components/reportes/reporte-cobros/reporte-cobros.component';
import { FiltroReporteCantidadPipe } from './pipes/filtro-reporte-cantidad.pipe';
import { NoEncontradoComponent } from './components/no-encontrado/no-encontrado.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { RecuperarClaveComponent } from './components/usuarios/recuperar-clave/recuperar-clave.component';
import { RankingProductosComponent } from './components/reportes/ranking-productos/ranking-productos.component';
import { BajaUsuarioComponent } from './components/usuarios/baja-usuario/baja-usuario.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    AltaPedidoComponent,
    ElementoProductoComponent,
    ListadoPedidosComponent,
    DetallesPedidoComponent,
    EstadoPedidoComponent,
    ListadoPedidosPendientesComponent,
    CobroComponent,
    ListadoPedidosPropiosComponent,
    AltaSocioComponent,
    ListadoSociosComponent,
    DetallesSocioComponent,
    BajaSocioComponent,
    AltaProductoComponent,
    ListadoProductosComponent,
    BajaProductoComponent,
    RegistroUsuarioExternoComponent,
    FiltroPipe,
    FiltroSocioPipe,
    FiltroPedidoPipe,
    CancelarPedidoComponent,
    AltaPromocionComponent,
    ListadoPromocionesComponent,
    FiltroPromocionPipe,
    BajaPromocionComponent,
    ListadoPromocionesDisponiblesComponent,
    CanjearComponent,
    AltaStockComponent,
    ListadoStockComponent,
    ListadoPromocionesCanjeadasComponent,
    DetallesPromocionCanjeadaComponent,
    FiltroCanjeadasPipe,
    ReporteSociosComponent,
    ReporteProductosComponent,
    FiltroReportePipe,
    FiltroReporteSocioPipe,
    ReportePromocionesComponent,
    FiltroReportePromocionPipe,
    FiltroAltaPedidoPipe,
    ReporteCobrosComponent,
    FiltroReporteCantidadPipe,
    NoEncontradoComponent,
    ContactoComponent,
    RecuperarClaveComponent,
    RankingProductosComponent,
    BajaUsuarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatInputModule,
    NgChartsModule
  ],
  providers: [
    UsuarioService,
    SesionIniciadaService,
    ProductoService,
    PedidoService,
    EstadoPedidoService,
    CobroService,
    TipoPagoService,
    SocioService,
    PromocionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

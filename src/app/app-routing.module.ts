import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactoComponent } from './components/contacto/contacto.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NoEncontradoComponent } from './components/no-encontrado/no-encontrado.component';
import { AltaPedidoComponent } from './components/pedidos/alta-pedido/alta-pedido.component';
import { ListadoPedidosPendientesComponent } from './components/pedidos/listados/listado-pedidos-pendientes/listado-pedidos-pendientes.component';
import { ListadoPedidosPropiosComponent } from './components/pedidos/listados/listado-pedidos-propios/listado-pedidos-propios.component';
import { ListadoPedidosComponent } from './components/pedidos/listados/listado-pedidos/listado-pedidos.component';
import { AltaProductoComponent } from './components/productos/alta-producto/alta-producto.component';
import { ListadoProductosComponent } from './components/productos/listado-productos/listado-productos.component';
import { ListadoStockComponent } from './components/productos/stock/listado-stock/listado-stock.component';
import { AltaPromocionComponent } from './components/promociones/alta-promocion/alta-promocion.component';
import { ListadoPromocionesCanjeadasComponent } from './components/promociones/listados/listado-promociones-canjeadas/listado-promociones-canjeadas.component';
import { ListadoPromocionesDisponiblesComponent } from './components/promociones/listados/listado-promociones-disponibles/listado-promociones-disponibles.component';
import { ListadoPromocionesComponent } from './components/promociones/listados/listado-promociones/listado-promociones.component';
import { RankingProductosComponent } from './components/reportes/ranking-productos/ranking-productos.component';
import { ReporteCobrosComponent } from './components/reportes/reporte-cobros/reporte-cobros.component';
import { ReporteProductosComponent } from './components/reportes/reporte-productos/reporte-productos.component';
import { ReportePromocionesComponent } from './components/reportes/reporte-promociones/reporte-promociones.component';
import { ReporteSociosComponent } from './components/reportes/reporte-socios/reporte-socios.component';
import { AltaSocioComponent } from './components/socios/alta-socio/alta-socio.component';
import { ListadoSociosComponent } from './components/socios/listado-socios/listado-socios.component';
import { RecuperarClaveComponent } from './components/usuarios/recuperar-clave/recuperar-clave.component';
import { RegistroUsuarioExternoComponent } from './components/usuarios/registro-usuario-externo/registro-usuario-externo.component';
import { AdminGuard } from './guards/admin.guard';
import { EmpleadoGuard } from './guards/empleado.guard';

const routes: Routes = [
  {path:'home', component : HomeComponent},
  {path: '', component : HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'pedido/nuevo', component: AltaPedidoComponent},
  {path: 'pedido/listado', component: ListadoPedidosComponent, canActivate: [ EmpleadoGuard]},
  {path: 'pedido/pendiente', component: ListadoPedidosPendientesComponent, canActivate: [ EmpleadoGuard]},
  {path: 'pedido/propios', component: ListadoPedidosPropiosComponent},
  {path: 'socio/nuevo', component: AltaSocioComponent},
  {path:'socio/nuevo/:id', component : AltaSocioComponent},
  {path: 'socio/listado', component: ListadoSociosComponent, canActivate: [ EmpleadoGuard]},
  {path: 'producto/nuevo', component : AltaProductoComponent, canActivate: [ EmpleadoGuard]},
  {path: 'producto/nuevo/:id', component : AltaProductoComponent, canActivate: [ EmpleadoGuard]},
  {path: 'producto/listado', component : ListadoProductosComponent, canActivate: [ EmpleadoGuard]},
  {path: 'registro', component : RegistroUsuarioExternoComponent},
  {path: 'promocion/nuevo', component: AltaPromocionComponent, canActivate: [ EmpleadoGuard]},
  {path: 'promocion/listado', component: ListadoPromocionesComponent, canActivate: [ EmpleadoGuard]},
  {path: 'promocion/listado/disponibles', component: ListadoPromocionesDisponiblesComponent},
  {path: 'promocion/listado/canjeadas', component: ListadoPromocionesCanjeadasComponent, canActivate: [ EmpleadoGuard]},
  {path: 'stock/listado', component: ListadoStockComponent, canActivate: [ EmpleadoGuard]},
  {path: 'reportes/socios', component: ReporteSociosComponent, canActivate: [ AdminGuard ]},
  {path: 'reportes/productos', component: ReporteProductosComponent, canActivate: [ AdminGuard ]},
  {path: 'ranking/productos', component: RankingProductosComponent, canActivate: [ AdminGuard ]},
  {path: 'reportes/promociones', component: ReportePromocionesComponent, canActivate: [ AdminGuard ]},
  {path: 'reportes/cobros', component: ReporteCobrosComponent, canActivate: [ AdminGuard  ]},
  {path: 'contacto', component : ContactoComponent},
  {path: 'recuperarclave', component : RecuperarClaveComponent},
  {path: '**', component: NoEncontradoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

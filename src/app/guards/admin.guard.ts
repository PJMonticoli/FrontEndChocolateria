import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private servicioUsuario: UsuarioService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('token');
    if (token) {
      const body = token.split('.')[1];
      const buff = JSON.parse(atob(body));
      if (buff.rol === 'Admin') {
        return true;
      } else {
        Swal.fire({
          title: 'ERROR!',
          text: 'No tienes los permisos adecuados para acceder a este recurso',
          icon: 'error'
        }).then(() => {
          this.router.navigate(['/home']);
        });
        return false;
      }
    } else {
      Swal.fire({
        title: 'ATENCIÓN!',
        text: 'Necesitas iniciar sesión para acceder a este recurso',
        icon: 'warning'
      }).then(() => {
        this.router.navigate(['/login']);
      });
      return false;
    }
  }
}

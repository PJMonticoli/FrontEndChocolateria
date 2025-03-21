import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PromocionService } from 'src/app/services/promocion.service';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  promociones: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  private subscription = new Subscription();

  constructor(private promocionService: PromocionService) {}

  ngOnInit(): void {
    this.initSlider();
    this.cargarPromociones();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initSlider(): void {
    let slides = document.querySelectorAll('.slide');
    let index = 0;
    setInterval(() => {
      slides[index].classList.remove('active');
      index = (index + 1) % slides.length;
      slides[index].classList.add('active');
    }, 7000);
  }

  private cargarPromociones(): void {
    this.loading = true;
    this.subscription.add(
      this.promocionService.obtenerDisponibles().subscribe({
        next: (res: ResultadoGenerico) => {
          if (res.resultado && res.resultado.length > 0) {
            this.promociones = res.resultado.slice(0, 3);
          } else {
            this.error = 'No hay promociones disponibles actualmente';
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar promociones:', err);
          this.error = 'Error al cargar las promociones. Inténtalo más tarde.';
          this.loading = false;
        }
      })
    );
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-AR');
  }

  scrollToPromos(): void {
    const promoSection = document.getElementById('promociones');
    if (promoSection) {
      promoSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
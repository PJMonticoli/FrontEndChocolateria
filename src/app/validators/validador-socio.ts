import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SocioService } from "../services/socio.service";

export class ValidadorSocio {
    static validadorDNI(servicioSocio : SocioService) : AsyncValidatorFn {
        return (control : AbstractControl) : Observable<ValidationErrors | null> =>{
            return servicioSocio.existeSocioConDNI(control.value).pipe(
                map((result : boolean) => result ? null : {noExisteSocio : true})
            )
        }
    }
}

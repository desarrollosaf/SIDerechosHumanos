import { NgStyle } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService } from '../../../../service/user.service';
import { User } from '../../../../interfaces/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgStyle,
    RouterLink,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  returnUrl: any;
  user: User[] = [];
  loggedin: boolean = false;
  Uemail: string = '';
  Upassword: string = '';
  userRole$: Observable<string | undefined>;

  public _userService = inject(UserService);

  constructor(private router: Router, private route: ActivatedRoute) {
    // Rol como observable a partir del usuario actual
    this.userRole$ = this._userService.currentUser$.pipe(
      map(user => user?.email)
    );
  }

  ngOnInit(): void {
    // Obtener returnUrl si viene como parámetro
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    
  }

  onLoggedin(form: NgForm) {
    console.log('Intentando login con:', form.value.Uemail, form.value.Upassword);

    const user: User = {
      email: form.value.Uemail,
      password: form.value.Upassword
    };

    this._userService.login(user).subscribe({
      next: (response: any) => {
        const token = response.token;
        const userData = response.user;

        localStorage.setItem('myToken', token);
        localStorage.setItem('isLoggedin', 'true');

        this._userService.setCurrentUser(userData);
        this.userRole$.subscribe(role => {
          console.log('Rol actual:', role);
        });
        
        this.router.navigate([this.returnUrl]);
      },
      error: (e: HttpErrorResponse) => {
        if (e.error && e.error.msg) {
          console.error('Error del servidor:', e.error.msg);
        } else {
          console.error('Error desconocido:', e);
        }
      },
    });
  }
}

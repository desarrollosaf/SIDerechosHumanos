import { NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild, inject, TemplateRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../../service/user.service';
import { User } from '../../../../interfaces/user';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-login',
    imports: [
        NgStyle,
        RouterLink,
        FormsModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',


})
export class LoginComponent implements OnInit {

  returnUrl: any;
  user: User[] = []
  loggedin: boolean;
  Uemail: string = '';
  Upassword: string = '';

  public _userService  =  inject( UserService )
  
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onLoggedin(form: NgForm) {
    //e.preventDefault();
    console.log('false')
    console.log(form.value.Uemail)
    console.log(form.value.Upassword)

    const user: User = {
      email: form.value.Uemail,
      password: form.value.Uemail
    }

    this._userService.login(user).subscribe({
      next: (response: any) => {
        const token = response.token
        console.log(token);     

        localStorage.setItem('myToken',token) 
        this.router.navigate(['/admin/product/listProduct'])
        // this.router.navigate(['/dashboard/product/listProduct']) 
      },
      error: (e: HttpErrorResponse) => {
        
      },
    })   
    /*localStorage.setItem('isLoggedin', 'false');
    if (localStorage.getItem('isLoggedin') === 'true') {
      this.router.navigate([this.returnUrl]);
    }*/
  }

}

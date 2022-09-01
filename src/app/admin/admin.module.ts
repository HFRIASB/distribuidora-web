import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './home/home.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { VistaUsuarioComponent } from './vista-usuario/vista-usuario.component';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';



@NgModule({
  declarations: [
    HomeComponent,
    UsuariosComponent,
    VistaUsuarioComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    Ng2SearchPipeModule
  ]
})
export class AdminModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/authentication/components/login/login.component';


const routes: Routes = [
    {
        path: "",
        component:LoginComponent
    }
    // {
    //     path: "ticket",
    //     loadChildren: () => import('./modules/ticket/ticket.module').then(m => m.TicketModule)
    // },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

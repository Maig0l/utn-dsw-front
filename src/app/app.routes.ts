import { RouterModule, Routes} from '@angular/router';
import { NgModule} from '@angular/core';
import { StudioComponent } from './components/studio/studio.component';
import { ShopComponent } from './components/shop/shop.component';
import { PlatformComponent } from './components/platform/platform.component';
import { LoginComponent } from './auth/login/login.component.js';
import { HomepageComponent } from './pages/homepage/homepage.component.js';

export const routes: Routes = [
    {path: 'studio', component: StudioComponent},
    {path : 'shop', component: ShopComponent},
    {path : 'platform', component: PlatformComponent},
    {path : 'homepage', component: HomepageComponent},
    {path: '', redirectTo: '/homepage', pathMatch: 'full'}, // Redirección en caso de ruta vacía
    //{path: '**', redirectTo: '/studio'}, // Redirección en caso de ruta no encontrada
    {path: 'log-in', component: LoginComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutesModule {

}

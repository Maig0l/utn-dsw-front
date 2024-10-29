import { RouterModule, Routes} from '@angular/router';
import { NgModule} from '@angular/core';
import { StudioComponent } from './components/studio/studio.component';
import { ShopComponent } from './components/shop/shop.component';
import { PlatformComponent } from './components/platform/platform.component';
import { LoginComponent } from './auth/login/login.component.js';
import { HomepageComponent } from './pages/homepage/homepage.component.js';
import { FranchiseComponent } from './franchise/franchise.component.js';
import { GameComponent } from './game/game.component.js';
import { PlaylistComponent } from './components/playlist/playlist.component.js';
import { ViewGameComponent } from './game/view-game/view-game.component.js';
import { TagComponent } from './components/tag/tag.component.js';


export const routes: Routes = [
    {path: 'studio', component: StudioComponent},
    {path : 'shop', component: ShopComponent},
    {path : 'tag', component: TagComponent},
    {path : 'platform', component: PlatformComponent},
    {path : 'franchise', component: FranchiseComponent},
    {path : 'game', component: GameComponent },
    {path: 'game/view_game', component: ViewGameComponent},
    {path : 'playlist', component: PlaylistComponent},
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

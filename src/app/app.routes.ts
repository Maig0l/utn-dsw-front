import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { StudioComponent } from './components/studio/studio.component';
import { ShopComponent } from './components/shop/shop.component';
import { PlatformComponent } from './components/platform/platform.component';
import { LoginComponent } from './components/login/login.component';
import { HomepageComponent } from './pages/homepage/homepage.component.js';
import { FranchiseComponent } from './components/franchise/franchise.component.js';
import { GameComponent } from './components/game/game.component.js';
import { PlaylistComponent } from './components/playlist/playlist.component.js';
import { ViewGameComponent } from './components/view-game/view-game.component.js';
import { TagComponent } from './components/tag/tag.component.js';
import { ReviewComponent } from './components/review/review.component.js';
import { RegisterComponent } from './components/register/register.component';
import { GameDetailsComponent } from './pages/game-details/game-details.component.js';
import { EditGameComponent } from './components/edit-game/edit-game.component';
import { ViewTagComponent } from './components/view-tag/view-tag.component.js';
import { SearchFiltersComponent } from './search-filters/search-filters.component.js';
import { UserComponent } from './components/user/user.component.js';

export const routes: Routes = [
  { path: 'studio', component: StudioComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'tag', component: TagComponent },
  { path: 'tag/view_tag', component: ViewTagComponent },
  { path: 'platform', component: PlatformComponent },
  { path: 'franchise', component: FranchiseComponent },
  { path: 'game', component: GameComponent },
  { path: 'game/view_game', component: ViewGameComponent },
  { path: 'review', component: ReviewComponent },
  { path: 'review/:id', component: ReviewComponent },
  { path: 'game/:id', component: GameDetailsComponent },
  { path: 'edit-game/:id', component: EditGameComponent },
  { path: 'search-filters', component: SearchFiltersComponent },

  { path: 'playlist', component: PlaylistComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: '', redirectTo: '/homepage', pathMatch: 'full' }, // Redirección en caso de ruta vacía
  //{path: '**', redirectTo: '/studio'}, // Redirección en caso de ruta no encontrada
  { path: 'log-in', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user/:id', component: UserComponent },
  { path: 'user/:id/edit', component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutesModule {}

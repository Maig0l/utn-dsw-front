import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { StudioComponent } from './components/studio/studio.component';
import { ShopComponent } from './components/shop/shop.component';
import { PlatformComponent } from './components/platform/platform.component';
import { LoginComponent } from './components/login/login.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { FranchiseComponent } from './components/franchise/franchise.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { ViewGameComponent } from './components/view-game/view-game.component';
import { TagComponent } from './components/tag/tag.component';
import { ReviewComponent } from './components/review/review.component';
import { RegisterComponent } from './components/register/register.component';
import { GameDetailsComponent } from './pages/game-details/game-details.component';
import { EditGameComponent } from './components/edit-game/edit-game.component';
import { ViewTagComponent } from './components/view-tag/view-tag.component';
import { SearchFiltersComponent } from './pages/search-filters/search-filters.component';
import { UserComponent } from './pages/user/user.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { PlaylistEditComponent } from './components/playlist-edit/playlist-edit.component';
import { AdminGuard } from './admin.guard';
import { CrudsComponent } from './pages/cruds/cruds.component';
import { GameCrudComponent } from './components/game-crud/game-crud.component.js';
import { GameComponent } from './components/game/game.component.js';

export const routes: Routes = [
  { path: 'tag/view_tag', component: ViewTagComponent },
  { path: 'game/view_game', component: ViewGameComponent },
  { path: 'review', component: ReviewComponent },
  { path: 'review/:id', component: ReviewComponent },
  { path: 'game/:id', component: GameDetailsComponent },
  { path: 'search-filters', component: SearchFiltersComponent },
  { path: 'playlist/:id', component: PlaylistEditComponent },
  { path: 'playlist', component: PlaylistComponent },

  { path: 'homepage', component: HomepageComponent },
  { path: '', redirectTo: '/homepage', pathMatch: 'full' }, // Redirección en caso de ruta vacía
  //{path: '**', redirectTo: '/studio'}, // Redirección en caso de ruta no encontrada
  { path: 'log-in', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'user/edit-profile', component: UserEditComponent },
  { path: 'user/:nick', component: UserComponent },

  {
    path: 'administradores',
    component: CrudsComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'platform',
        component: PlatformComponent,
        canActivate: [AdminGuard],
      },
      { path: 'studio', component: StudioComponent, canActivate: [AdminGuard] },
      { path: 'shop', component: ShopComponent, canActivate: [AdminGuard] },
      { path: 'tag', component: TagComponent, canActivate: [AdminGuard] },
      {
        path: 'franchise',
        component: FranchiseComponent,
        canActivate: [AdminGuard],
      },
      { path: 'game', component: GameCrudComponent, canActivate: [AdminGuard] },
      {
        path: 'game/create',
        component: GameComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'game/edit/:id',
        component: EditGameComponent,
        canActivate: [AdminGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutesModule {}

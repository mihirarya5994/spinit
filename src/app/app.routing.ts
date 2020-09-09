import { Routes, RouterModule } from '@angular/router';

import { EventResolver } from './core/resolvers/event.resolver';
import { AuthGuard } from './core/guards/auth.guard';

import { SplashComponent } from './components/splash/splash.component';

const routes: Routes = [
  {
    path: '',
    component: SplashComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'index.html',
    component: SplashComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'bb',
    loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard]
  }
];

export const AppRoutes = RouterModule.forRoot(routes);

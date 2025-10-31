import { Routes, UrlSegment, UrlMatchResult } from '@angular/router';
import { LandingOneComponent } from './components/landing-one/landing-one.component';

export const LANDING_ALIASES = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10'];
export const DEFAULT_LANDING = 'L1';

function landingAliasMatcher(aliases: string[]) {
  const set = new Set(aliases.map(a => a.toLowerCase()));
  return (segments: UrlSegment[]): UrlMatchResult | null => {
    if (!segments.length) return null;
    const first = segments[0].path.toLowerCase();
    if (set.has(first)) {
      return { consumed: segments.slice(0, 1), posParams: { variant: segments[0] } };
    }
    return null;
  };
}

// Aliases específicos
const L2_ONLY = ['L2'];
const L3_ONLY = ['L3'];
const ALIASES_OTHERS = LANDING_ALIASES.filter(a => a !== 'L2' && a !== 'L3');

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: DEFAULT_LANDING },

  // EXCEÇÃO: L2 -> LandingTwoComponent
  {
    matcher: landingAliasMatcher(L2_ONLY),
    loadComponent: () =>
      import('./components/landing-two/landing-two.component').then(m => m.LandingTwoComponent),
  },

  // EXCEÇÃO: L3 -> LandingThreeComponent
  {
    matcher: landingAliasMatcher(L3_ONLY),
    loadComponent: () =>
      import('./components/landing-three/landing-three.component').then(m => m.LandingThreeComponent),
  },

  // Demais aliases -> LandingOneComponent
  { matcher: landingAliasMatcher(ALIASES_OTHERS), component: LandingOneComponent },

  { path: '**', redirectTo: DEFAULT_LANDING },
];

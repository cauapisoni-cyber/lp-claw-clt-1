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

const L2_ONLY = ['L2'];
const ALIASES_EXCEPT_L2 = LANDING_ALIASES.filter(a => a !== 'L2');

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: DEFAULT_LANDING },

  // EXCEÇÃO: quando for L2, carrega o landing-two
  {
    matcher: landingAliasMatcher(L2_ONLY),
    loadComponent: () =>
      import('./components/landing-two/landing-two.component').then(m => m.LandingTwoComponent),
  },

  // Demais aliases (L1, L3..L10) continuam no landing-one
  { matcher: landingAliasMatcher(ALIASES_EXCEPT_L2), component: LandingOneComponent },

  { path: '**', redirectTo: DEFAULT_LANDING },
];

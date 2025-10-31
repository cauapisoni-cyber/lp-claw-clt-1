import { Routes, UrlSegment, UrlMatchResult } from '@angular/router';
import { LandingOneComponent } from './components/landing-one/landing-one.component';
import { PrivacyComponent } from './shared/privacy/privacy.component';

export const LANDING_ALIASES = ['clt2', 'clt', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10'];

function landingAliasMatcher(aliases: string[]) {
  const set = new Set(aliases.map(a => a.toLowerCase()));

  return (segments: UrlSegment[]): UrlMatchResult | null => {
    if (!segments.length) return null;
    const first = segments[0].path.toLowerCase();

    const match = Array.from(set).find(alias =>
      first === alias || first.startsWith(`${alias}:`)
    );

    if (match) {
      const [variant, extra] = first.split(':');
      const posParams: any = { variant: new UrlSegment(variant, {}) };
      if (extra) posParams.extra = new UrlSegment(extra, {});
      return { consumed: [segments[0]], posParams };
    }

    return null;
  };
}

const CLT2_ONLY = ['clt2'];
const CLT_ONLY = ['clt'];
const ALIASES_OTHERS = LANDING_ALIASES.filter(a => a !== 'clt2' && a !== 'clt');

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/landing-one/landing-one.component').then(m => m.LandingOneComponent),
  },

  {
    matcher: landingAliasMatcher(CLT_ONLY),
    loadComponent: () =>
      import('./components/landing-three/landing-three.component').then(m => m.LandingThreeComponent),
  },

  {
    matcher: landingAliasMatcher(CLT2_ONLY),
    loadComponent: () =>
      import('./components/landing-two/landing-two.component').then(m => m.LandingTwoComponent),
  },

  { matcher: landingAliasMatcher(ALIASES_OTHERS), component: LandingOneComponent },

  {
    path: 'privacy',
    component: PrivacyComponent,
  },

  {
    path: '**',
    loadComponent: () =>
      import('./components/landing-one/landing-one.component').then(m => m.LandingOneComponent),
  },
];

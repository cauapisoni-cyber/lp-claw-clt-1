import { Routes, UrlSegment, UrlMatchResult } from '@angular/router';
import { HomeComponent } from './components/home/home';

export const LANDING_ALIASES = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10',];

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

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: DEFAULT_LANDING },
  { matcher: landingAliasMatcher(LANDING_ALIASES), component: HomeComponent },
  { path: '**', redirectTo: DEFAULT_LANDING },
];

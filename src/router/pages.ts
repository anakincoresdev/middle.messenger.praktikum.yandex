import { LoginPage } from '@/pages/login/index.ts';
import { MessengerPage } from '@/pages/messenger/index.ts';
import { ProfilePage } from '@/pages/profile/index.ts';
import { RegistrationPage } from '@/pages/registration/index.ts';
import { ErrorPage } from '@/pages/error/index.ts';

import { Route, RouteNames } from './types.ts';

export const ROUTES: Route[] = [
  { name: RouteNames.Login, component: () => new LoginPage() },
  { name: RouteNames.Profile, component: () => new ProfilePage() },
  { name: RouteNames.Messenger, component: () => new MessengerPage() },
  // { name: RouteNames.Registration, component: RegistrationPage },
  // { name: RouteNames.Error, component: ErrorPage },
];

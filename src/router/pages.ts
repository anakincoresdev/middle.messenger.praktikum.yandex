import { LoginPage } from '@/pages/login';
import { RegistrationPage } from '@/pages/registration';
import { ErrorPage } from '@/pages/error';
import { ProfilePage } from '@/pages/profile';
import { MessengerPage } from '@/pages/messenger';

import { Route, RouteNames } from './types.ts';

export const ROUTES: Route[] = [
  { name: RouteNames.Login, component: LoginPage },
  { name: RouteNames.Registration, component: RegistrationPage },
  { name: RouteNames.Profile, component: ProfilePage },
  { name: RouteNames.Error, component: ErrorPage },
  { name: RouteNames.Messenger, component: MessengerPage },
];

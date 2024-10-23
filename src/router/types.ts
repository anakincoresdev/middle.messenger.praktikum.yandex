import { Component } from '@/core/component.ts';

export enum RouteNames {
  Login = 'login',
  Registration = 'registration',
  Error = 'error',
  Profile = 'profile',
  Messenger = 'messenger',
}

export interface Route {
  name: RouteNames;
  component: () => Component;
}

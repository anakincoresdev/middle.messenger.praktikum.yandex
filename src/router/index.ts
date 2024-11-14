import { router } from '@/router/Router.ts';
import { LoginPage } from '@/pages/login/index.ts';
import { RegistrationPage } from '@/pages/registration/index.ts';
import { MessengerPage } from '@/pages/messenger/index.ts';
import { ProfilePage } from '@/pages/profile/index.ts';
import { ErrorPage } from '@/pages/error/index.ts';

export default () => {
  router
    .use('/', LoginPage)
    .use('/sign-up', RegistrationPage)
    .use('/messenger', MessengerPage)
    .use('/settings', ProfilePage)
    .use('/error', ErrorPage)
    .start();
};

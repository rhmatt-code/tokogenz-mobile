import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },

  // Splash
  {
    path: 'splash',
    loadComponent: () =>
      import('./pages/splash/splash.page')
        .then(m => m.SplashPage)
  },

  // Auth
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.page')
        .then(m => m.LoginPage)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register.page')
        .then(m => m.RegisterPage)
  },

  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/auth/forgot-password/forgot-password.page')
        .then(m => m.ForgotPasswordPage)
  },

  {
    path: 'verify-email',
    loadComponent: () =>
      import('./pages/auth/verify-email/verify-email.page')
        .then(m => m.VerifyEmailPage)
  },

  {
    path: 'verify-otp',
    loadComponent: () =>
      import('./pages/auth/verify-otp/verify-otp.page')
        .then(m => m.VerifyOtpPage)
  },

  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/auth/reset-password/reset-password.page')
        .then(m => m.ResetPasswordPage)
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./pages/products/product-detail/product-detail.page')
        .then(m => m.ProductDetailPage)
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/orders/checkout/checkout.page')
        .then(m => m.CheckoutPage)
  },
  {
    path: 'live-room/:liveId',
    loadComponent: () =>
    import('./pages/live/live-room/live-room.page')
    .then(m => m.LiveRoomPage)
  },
  {
    path: 'store/:id',
    loadComponent: () =>  
      import(
        './pages/store/store-profile/store-profile.page'
      ).then(
        m => m.StoreProfilePage
      )
  },
       
  

  {
  path: 'tabs',
  loadComponent: () =>
    import('./layouts/tabs/tabs.page')
      .then(m => m.TabsPage),
  children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.page')
            .then(m => m.HomePage)
      },
      {
        path: 'live-list',
        loadComponent: () =>
          import('./pages/live/live-list/live-list.page')
            .then(m => m.LiveListPage)
      },
      
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/orders/order-list/order-list.page')
            .then(m => m.OrderListPage)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile-page/profile-page.page')
            .then(m => m.ProfilePage)
      },
      {
        path: 'edit-profile/:id',
        loadComponent: () =>
          import('./pages/profile/edit-profile/edit-profile.page')
            .then(m => m.EditProfilePage)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },

  // Fallback
  {
    path: '**',
    redirectTo: 'splash'
  },
    

];
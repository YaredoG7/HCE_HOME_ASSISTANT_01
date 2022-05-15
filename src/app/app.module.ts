import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatButtonModule,
  MatButtonToggleModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatMenuModule,
  MatSidenavModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatSlideToggleModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatRadioModule,
  MatGridListModule,
  MatProgressBarModule,
  MatListModule,
  MatCardModule,
  MatDialogModule,
  MatTabsModule,
  MatChipsModule,
  MatSnackBarModule } from '@angular/material';

import { ChartsModule } from 'ng2-charts';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { NgProgressModule, NgProgressInterceptor } from 'ngx-progressbar';

import { HttpService } from './services';
import { HceSocketService } from './services';


import { NgInitDirective } from './directives/ng-init.directive';

import { NavBarComponent } from './components/shared/navbar/navbar.component';
import { ToolbarComponent } from './components/shared/toolbar/toolbar.component';
import { AppComponent } from './components/app/app.component';

import { HomeComponent } from './components/home/home.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { LoginComponent } from './components/login/login.component';
import { UserListComponent } from './components/users/list/user-list.component';
import { UserDetailsComponent } from './components/users/details/user-details.component';
import { CreateEditUserComponent } from './components/users/shared/create-edit-user/create-edit-user.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LayoutComponent } from './components/layout/base/layout.component';
import { AlertsLayoutComponent } from './components/layout/alerts-layout/alerts-layout.component';
import { ButtonsLayoutComponent } from './components/layout/buttons-layout/buttons-layout.component';
import { TypographyComponent } from './components/layout/typography/typography.component';
import { ConfirmDialogComponent } from './components/dialogs/confirm-dialog/confirm-dialog.component';
import { DetailsComponent } from './components/hce_cams/details/details.component';
import { ListComponent } from './components/hce_cams/list/list.component';
import { CreateEditCamComponent } from './components/hce_cams/shared/create-edit-cam/create-edit-cam.component';
import { LightsComponent } from './components/lights/lights.component';
import { LocksComponent } from './components/locks/locks.component';
import { ResetPinComponent } from './components/dialogs/reset-pin/reset-pin.component';
import { AlertDialogComponent } from './components/dialogs/alert-dialog/alert-dialog.component';
import { HceIotCoreService } from './components/hce-iot-core.service';
import { ObservableService } from './services/observable.service';
import { CreateEditLocksComponent } from './components/create-edit-locks/create-edit-locks.component';
import { CreateEditLightsComponent } from './components/create-edit-lights/create-edit-lights.component';
import { NgxVideoListPlayerModule } from 'ngx-video-list-player';
import { CookieService } from 'ngx-cookie-service';

const appRoutes: Routes = [
  {
      path: '',
      component: MainLayoutComponent,
      // canActivate: [AuthGuard],
      children: [
          { path: '', pathMatch: 'full', redirectTo: '/login' },
          { path: 'home', component: HomeComponent, data: {title: 'ሁTOPIA'} }, //T🧿PI🔺
          { path: 'users', component: UserListComponent, data: {title: 'Users'}},
          { path: 'users/new', component: CreateEditUserComponent, data: {title: 'New user'} },
          { path: 'users/edit/:id', component: CreateEditUserComponent, data: {title: 'Edit user'} },
          { path: 'users/details/:id', component: UserDetailsComponent, data: {title: 'User details'} },
          { path: 'cameras', component: ListComponent, data: {title: 'Cameras'}},
          { path: 'cameras/new', component: CreateEditCamComponent, data: {title: 'New camera'} },
          { path: 'cameras/edit/:id', component: CreateEditCamComponent, data: {title: 'Edit camera'} },
          { path: 'cameras/details/:id', component: DetailsComponent, data: {title: 'Camera details'} },
          { path: 'settings', component: SettingsComponent, data: {title: 'Settings'} },
          { path: 'lights', component: LightsComponent, data: {title: 'Lights'} },
          { path: 'lights/new', component: CreateEditLightsComponent, data: {title: 'New LED Light'} },
          { path: 'lights/edit/:id', component: CreateEditLightsComponent, data: {title: 'Edit LED Light'} },
          { path: 'locks', component: LocksComponent, data: {title: 'Locks'} },
          { path: 'locks/new', component: CreateEditLocksComponent, data: {title: 'New Lock'} },
          { path: 'locks/edit/:id', component: CreateEditLocksComponent, data: {title: 'Edit Lock'} },
          { path: 'profile', component: ProfileComponent, data: {title: 'Profile'} },
          {
            path: 'layout', data: {title: 'Layout'},
            children:[
              { path: 'base', component: LayoutComponent, data: {title: 'Camera Feed'} },
              { path: 'alerts', component: AlertsLayoutComponent, data: {title: 'Video Recordings'} },
              { path: 'buttons', component: ButtonsLayoutComponent, data: {title: 'Water Systems'} },
              { path: 'typography', component: TypographyComponent, data: {title: 'Typography'} }
            ]
          }
      ]
  },
  {
      path: '',
      component: LoginLayoutComponent,
      children: [
          {
              path: 'login',
              component: LoginComponent
          }
      ]
  },
  { path: '**', redirectTo: '/home' }

];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainLayoutComponent,
    NavBarComponent,
    LoginLayoutComponent,
    LoginComponent,
    UserListComponent,
    UserListComponent,
    ToolbarComponent,
    UserDetailsComponent,
    SettingsComponent,
    ProfileComponent,
    NgInitDirective,
    LayoutComponent,
    CreateEditUserComponent,
    AlertsLayoutComponent,
    ButtonsLayoutComponent,
    TypographyComponent,
    ConfirmDialogComponent,
    DetailsComponent,
    ListComponent,
    CreateEditCamComponent,
    LightsComponent,
    LocksComponent,
    ResetPinComponent,
    AlertDialogComponent,
    CreateEditLocksComponent,
    CreateEditLightsComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    HttpClientModule,
    NgProgressModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSlideToggleModule,
    MatCardModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
    MatListModule,
    MatGridListModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatTabsModule,
    MatChipsModule,
    NgxVideoListPlayerModule,
    ChartsModule,
    RoundProgressModule
  ],
  providers: [
    HttpService,
    HceSocketService,
    HceIotCoreService,
    CookieService,
    ObservableService,
    Title,
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: NgProgressInterceptor, 
      multi: true 
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmDialogComponent, ResetPinComponent, AlertDialogComponent]
})
export class AppModule { }

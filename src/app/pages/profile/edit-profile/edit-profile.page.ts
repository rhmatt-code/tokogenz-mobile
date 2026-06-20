import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonSpinner,
  IonItem,
  IonInput,
  IonTextarea,
  IonIcon
} from '@ionic/angular/standalone';

import { FormsModule } from '@angular/forms';

import { addIcons } from 'ionicons';

import {
  camera,
  storefrontOutline,
  locationOutline,
  mailOutline
} from 'ionicons/icons';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,

    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonSpinner,
    IonItem,
    IonInput,
    IonTextarea,
    IonIcon
  ],

  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss']
})
export class EditProfilePage implements OnInit {

  isLoading = true;

  isSaving = false;

  user: any = null;

  selectedFile: File | null = null;

  previewImage: string | null = null;

  constructor(
    private auth: AuthService
  ) {

    addIcons({
      camera,
      storefrontOutline,
      locationOutline,
      mailOutline
    });

  }

  async ngOnInit() {

    await this.loadProfile();

  }

  async loadProfile() {

    try {

      this.user =
        await this.auth.getUser();

    } catch (error) {

      console.error(
        'Load profile error',
        error
      );

    } finally {

      this.isLoading = false;

    }

  }

  onFileSelected(
    event: any
  ) {

    const file =
      event.target.files?.[0];

    if (!file) {

      return;

    }

    this.selectedFile =
      file;

    const reader =
      new FileReader();

    reader.onload =
      () => {

        this.previewImage =
          reader.result as string;

      };

    reader.readAsDataURL(
      file
    );

  }

  saveProfile() {
    console.log(this.user);
    if (!this.user) {

      return;

    }

    this.isSaving = true;

    const formData =
      new FormData();

    formData.append('email', this.user.email ?? '');
    formData.append('name', this.user.name ?? '');
    formData.append('address', this.user.address ?? '');
    if (
      this.selectedFile
    ) {

      formData.append(
        'logo',
        this.selectedFile
      );

    }

    this.auth
      .updateProfile(
        formData
      )
      .subscribe({

        next: async (
          res: any
        ) => {

          this.isSaving =
            false;

          alert(
            'Profil berhasil diperbarui'
          );

          const freshUser =
          await this.auth.getProfile();
          await this.auth.refreshUser();
          localStorage.setItem(
            'user',
            JSON.stringify(
              freshUser
            )
          );

        },

        error: (
          err: any
        ) => {

          this.isSaving =
            false;

          console.error(
            err
          );

          alert(
            err?.error?.message ??
            'Gagal memperbarui profil'
          );

        },
        
        
      });

  }

}
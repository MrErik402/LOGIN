import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from '../../../services/message.service';
import { User } from '../../../interfaces/user';
import { PassmodComponent } from '../passmod/passmod.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PassmodComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})

export class ProfileComponent implements OnInit {
  profileForm: Partial<User> = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };
  profileMeta = {
    reg: '',
    last: ''
  };
  isLoading = true;
  isSaving = false;
  private userId?: number;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private message: MessageService
  ) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  async loadProfile(): Promise<void> {
    const loggedUser = this.auth.loggedUser();
    if (!loggedUser || loggedUser.length === 0 || !loggedUser[0].id) {
      this.isLoading = false;
      this.message.show('warning', 'Figyelem', 'Nem található bejelentkezett felhasználó.');
      return;
    }

    this.isLoading = true;

    try {
      const response = await this.api.select('users', loggedUser[0].id);
      if (response.status === 500 || !response.data || response.data.length === 0) {
        this.message.show('danger', 'Hiba', response.message ?? 'Nem sikerült betölteni a profilt.');
        return;
      }

      const user: User = response.data[0];
      this.profileForm = {
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        address: user.address ?? ''
      };
      this.profileMeta = {
        reg: user.reg ?? '',
        last: user.last ?? ''
      };

      this.auth.refreshUserSession(response.data);
    } catch (error) {
      this.message.show('danger', 'Hiba', 'Váratlan hiba történt a profil betöltésekor.');
    } finally {
      this.isLoading = false;
    }
  }

  async save(): Promise<void> {
    if (!this.userId) {
      this.message.show('danger', 'Hiba', 'Nincs felhasználói azonosító.');
      return;
    }

    const { name, email, phone, address } = this.profileForm;

    if (!name?.trim() || !email?.trim()) {
      this.message.show('warning', 'Hiányzó adat', 'A név és e-mail mező kitöltése kötelező.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      this.message.show('warning', 'Érvénytelen e-mail', 'Adj meg egy érvényes e-mail címet.');
      return;
    }

    this.isSaving = true;

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() ?? '',
        address: address?.trim() ?? ''
      };

      const result = await this.api.update('users', this.userId, payload);
      if (result.status === 500) {
        this.message.show('danger', 'Hiba', result.message ?? 'Nem sikerült frissíteni a profilt.');
        return;
      }

      await this.loadProfile();
      this.message.show('success', 'Siker', 'A profil sikeresen frissült.');
    } catch (error) {
      this.message.show('danger', 'Hiba', 'Váratlan hiba történt mentés közben.');
    } finally {
      this.isSaving = false;
    }
  }

}

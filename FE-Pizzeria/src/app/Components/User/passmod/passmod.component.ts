import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from '../../../services/message.service';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-passmod',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './passmod.component.html',
  styleUrl: './passmod.component.scss'
})

export class PassmodComponent {
  form = {
    current: '',
    next: '',
    confirm: ''
  };
  isSaving = false;
  private passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private message: MessageService
  ) { }

  async save(): Promise<void> {
    const userData = this.auth.loggedUser();
    if (!userData || userData.length === 0) {
      this.message.show('danger', 'Hiba', 'Nem található bejelentkezett felhasználó.');
      return;
    }

    const user: User = userData[0];

    if (!user.id || !user.email) {
      this.message.show('danger', 'Hiba', 'Hiányos felhasználói adatok.');
      return;
    }

    if (!this.form.current || !this.form.next || !this.form.confirm) {
      this.message.show('warning', 'Hiányzó adat', 'Tölts ki minden mezőt.');
      return;
    }

    if (this.form.next !== this.form.confirm) {
      this.message.show('warning', 'Hiba', 'Az új jelszó és a megerősítés nem egyezik.');
      return;
    }

    if (!this.passwordPattern.test(this.form.next)) {
      this.message.show('warning', 'Gyenge jelszó', 'A jelszónak legalább 8 karakterből kell állnia, tartalmaznia kell kis- és nagybetűt, valamint számot.');
      return;
    }

    this.isSaving = true;

    try {
      const loginCheck = await this.api.login('users', {
        email: user.email,
        password: this.form.current
      });

      if (loginCheck.status === 500) {
        this.message.show('danger', 'Hibás jelszó', loginCheck.message ?? 'A megadott régi jelszó helytelen.');
        return;
      }

      const hashedPassword = await this.hashPassword(this.form.next);
      const updateResult = await this.api.update('users', user.id, { password: hashedPassword });

      if (updateResult.status === 500) {
        this.message.show('danger', 'Hiba', updateResult.message ?? 'Nem sikerült módosítani a jelszót.');
        return;
      }

      const refreshed = await this.api.select('users', user.id);
      if (refreshed.status !== 500 && refreshed.data) {
        this.auth.refreshUserSession(refreshed.data);
      }

      this.message.show('success', 'Siker', 'A jelszó sikeresen frissült.');
      this.form = {
        current: '',
        next: '',
        confirm: ''
      };
    } catch (error) {
      this.message.show('danger', 'Hiba', 'Váratlan hiba történt a jelszó módosítása során.');
    } finally {
      this.isSaving = false;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    if (!globalThis.crypto?.subtle) {
      throw new Error('A böngésző nem támogatja a kriptográfiai műveleteket.');
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await globalThis.crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

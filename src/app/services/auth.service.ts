import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase!: SupabaseClient;
  private _currentUser: BehaviorSubject<boolean | User | any> =
    new BehaviorSubject(null);

  constructor(private router: Router) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    this.supabase.auth
      .getUser()
      .then((user) => {
        console.log('User: ' + user);
        this._currentUser.next(user);
      })
      .catch((error) => {
        console.log('Error getting user', error);
        this._currentUser.next(false);
      });

    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log('Event: ' + event);
      console.log('Session: ' + session);

      if (event == 'SIGNED_IN') {
        console.log('User', session?.user);
        this._currentUser.next(session?.user);
      } else {
        this._currentUser.next(false);
        //this.router.navigateByUrl('/', { replaceUrl: true });
      }
    });
  }

  async signInUserWithEmailAndPassword(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return new Error(error.message);
    }
    return data;
  }

  async signOut() {
    try {
      await this.supabase.auth.signOut();
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  }

  get currentUser() {
    return this._currentUser.asObservable();
  }
}

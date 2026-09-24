import { Injectable, signal } from '@angular/core'
import { AuthChangeEvent, createClient, Session, User } from '@supabase/supabase-js'
import { environment } from '../../../environments/environment'

export interface Profile {
  id?: string
  username: string
  website: string
  avatar_url: string
}

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  readonly client = createClient(environment.supabaseUrl, environment.supabasePublishableKey)
  readonly user = signal<User | null>(null)

  constructor() {
    this.client.auth.onAuthStateChange((_event, session) => {
      this.user.set(session?.user ?? null)
    })
  }

  async getUser(): Promise<User | null> {
    const { data, error } = await this.client.auth.getUser()
    if (error) {
      return null
    }
    return data.user
  }

  async isLoggedIn(): Promise<boolean> {
    const { data, error } = await this.client.auth.getClaims()
    return !error && !!data?.claims
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.client.auth.onAuthStateChange(callback)
  }

  signIn(email: string) {
    return this.client.auth.signInWithOtp({ email })
  }

  signOut() {
    return this.client.auth.signOut()
  }


  profile(user: User) {
    return this.client
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single()
  }
    updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    }
    return this.client.from('profiles').upsert(update)
  }
  downLoadImage(path: string) {
    return this.client.storage.from('avatars').download(path)
  }
  uploadAvatar(filePath: string, file: File) {
    return this.client.storage.from('avatars').upload(filePath, file)
  }
}

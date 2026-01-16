// User type for Firebase Auth
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

# Firebase Realtime Database rules for notepad

Apply these in the Firebase console (Realtime Database → Rules tab). The nertia repo does not currently track a `database.rules.json` file, so rules are configured via the console.

## Adds (merge into the existing rules object under the root)

```json
{
  "rules": {
    "notepad": {
      "posts": {
        ".read": "auth != null && auth.token.email.toLowerCase() == 'ps2pdx@gmail.com'",
        ".write": "auth != null && auth.token.email.toLowerCase() == 'ps2pdx@gmail.com'",
        ".indexOn": ["status", "date"]
      }
    }
  }
}
```

Public blog reads go through `firebase-admin` on the server (bypasses rules), so no anonymous-read rule is needed.

## Storage rules

For hero + inline media at `gs://{bucket}/blog/{postId}/...`:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /blog/{postId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email.lower() == 'ps2pdx@gmail.com';
    }
  }
}
```

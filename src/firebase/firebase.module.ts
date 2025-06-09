import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: () => {
        const credentials = JSON.parse(process?.env?.FIREBASE_ADMIN_CREDENTIALS!);

        // Corrige quebras de linha na private_key
        credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');

        return admin.initializeApp({
          credential: admin.credential.cert(credentials),
        });
      },
    },
  ],
  exports: ['FIREBASE_ADMIN'],
})
export class FirebaseModule {}

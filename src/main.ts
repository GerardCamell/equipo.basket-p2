import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({ projectId: "equipo-basket-p2", appId: "1:474074122785:web:a3440b09aa77b492a2f160", databaseURL: "https://equipo-basket-p2-default-rtdb.europe-west1.firebasedatabase.app", storageBucket: "equipo-basket-p2.firebasestorage.app", apiKey: "AIzaSyBUUF5jhHNx2TON-UsgyZ0LyssrWHC2gaw", authDomain: "equipo-basket-p2.firebaseapp.com", messagingSenderId: "474074122785", measurementId: "G-0T52MVSGHZ", projectNumber: "474074122785", version: "2" })), provideFirestore(() => getFirestore())
  ]
}).catch(err => console.error(err));
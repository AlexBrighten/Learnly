import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (serviceAccount) {
    try {
      const parsedServiceAccount = JSON.parse(serviceAccount);
      return initializeApp({
        credential: cert(parsedServiceAccount),
        projectId: "learnly-srm",
      });
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env var:", e.message);
    }
  }

  // Fallback to default credentials or just the project ID (will fail locally without ADC)
  return initializeApp({
    projectId: "learnly-srm",
  });
}

const adminApp = getAdminApp();
const adminDb = getFirestore(adminApp);
const adminAuth = getAuth(adminApp);

export { adminApp, adminDb, adminAuth };

import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

/**
 * Üretilen lisansı Firestore'a kaydeder.
 */
export async function saveLicenseToFirebase(token: string, prefix: string, durationDays: number) {
  try {
    const codesRef = collection(db, "MoreSpace", "CODELER", "codes");
    
    // Geçerlilik süresini hesapla (Şu an + gün sayısı)
    const now = new Date();
    const expiresAtDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
    const expiresAt = Timestamp.fromDate(expiresAtDate);

    await addDoc(codesRef, {
      code: token,
      prefix: prefix || "KEY",
      durationDays: durationDays,
      createdAt: serverTimestamp(),
      expiresAt: expiresAt,
      status: "active",
      source: "Sales Portal"
    });
    return { success: true };
  } catch (error) {
    console.error("Firebase Save Error:", error);
    throw new Error("Veritabanına kaydedilirken bir hata oluştu.");
  }
}

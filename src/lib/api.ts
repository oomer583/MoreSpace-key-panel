import { saveLicenseToFirebase } from "./firebase";

/**
 * Rastgele bir lisans anahtarı üretir. 
 * Seçilen öneki (GOLD, LITE, TRIAL) anahtarın başına ekler.
 */
function generateRandomToken(prefix: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = 12; // Ana gövde uzunluğu
  const randomPart = Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
  return prefix ? `${prefix}${randomPart}` : randomPart;
}

/**
 * Yeni bir lisans üretir ve Firebase'e kaydeder.
 */
export async function generateLicense(prefix: string, durationDays: number): Promise<{ success: boolean; token: string }> {
  try {
    // 1. Rastgele token üretimi
    const token = generateRandomToken(prefix);

    // 2. Firebase'e kaydetme
    await saveLicenseToFirebase(token, prefix, durationDays);

    return { success: true, token };
  } catch (error: any) {
    console.error("License Generation Error:", error);
    throw new Error(error.message || "Anahtar üretilirken veya kaydedilirken bir hata oluştu.");
  }
}

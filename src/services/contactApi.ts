import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface ContactSubmission {
  name: string;
  phone: string;
  contactMethod: string;
  service: string;
  details: string;
}

export const submitContactForm = async (
  data: ContactSubmission,
): Promise<{ success: boolean; id?: string }> => {
  try {
    const docRef = await addDoc(collection(db, "contacts"), {
      ...data,
      status: "active",
      createdAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error submitting contact form: ", error);
    return { success: false };
  }
};

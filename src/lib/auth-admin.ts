import { getAuth } from "firebase-admin/auth";
import { isAdminEmail } from "@/lib/admin";
import { initAdmin } from "@/lib/firebaseAdmin";

export type VerifyResult =
  | { ok: true; email: string }
  | { ok: false; status: 401 | 403; message: string };

export async function verifyAdminToken(req: Request): Promise<VerifyResult> {
  const header = req.headers.get("authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return { ok: false, status: 401, message: "missing bearer token" };
  }
  const token = header.slice("Bearer ".length);
  const app = initAdmin();
  try {
    const decoded = await getAuth(app).verifyIdToken(token);
    const email = decoded.email ?? "";
    if (!isAdminEmail(email)) {
      return { ok: false, status: 403, message: "not an admin" };
    }
    return { ok: true, email };
  } catch {
    return { ok: false, status: 401, message: "invalid token" };
  }
}

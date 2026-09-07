import { redirect } from "next/navigation";

import LoginForm from "@/components/admin/LoginForm";
import { getSession, isAdminConfigured } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getSession()) redirect("/admin");

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <h1>Bonaca CRM</h1>
        <p>Sign in to edit the website.</p>

        {isAdminConfigured ? null : (
          <div className="admin-notice" data-tone="error" style={{ marginBottom: "1rem" }}>
            <strong>ADMIN_PASSWORD is not set.</strong> Add it to <code>.env</code> and
            restart the server before signing in.
          </div>
        )}

        <LoginForm />

        <p className="admin-login-foot">Bonaca — content management</p>
      </div>
    </div>
  );
}

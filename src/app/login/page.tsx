import { Suspense } from "react";
import LoginForm from "./loginForm";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto">
      <Suspense fallback={<div>Loading login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

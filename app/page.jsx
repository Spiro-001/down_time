import SignInForm from "@/components/SignInForm";
import { logOutRequiredServer } from "@/lib/auth";

export default async function Home() {
  await logOutRequiredServer();
  return (
    <main className="flex flex-1 justify-between h-screen">
      <div className="bg-red-300 flex-1">Background Image</div>
      <SignInForm />
    </main>
  );
}

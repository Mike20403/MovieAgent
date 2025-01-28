import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { Home } from "./home";

export default async function App() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <Home />
    </HydrateClient>
  );
}

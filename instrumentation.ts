export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { execSync } = await import("child_process");
    try {
      execSync("npx prisma migrate deploy", {
        env: { ...process.env },
        stdio: "pipe",
      });
    } catch {
      // Database might not exist yet — try prisma db push as fallback
      execSync("npx prisma db push --skip-generate --accept-data-loss", {
        env: { ...process.env },
        stdio: "pipe",
      });
    }
  }
}

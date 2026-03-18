// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import { jwtVerify } from "jose";

vi.mock("server-only", () => ({}));

const mockCookieSet = vi.fn();
const mockCookieGet = vi.fn();
const mockCookieDelete = vi.fn();

vi.mock("next/headers", () => ({
  cookies: vi.fn(() =>
    Promise.resolve({
      set: mockCookieSet,
      get: mockCookieGet,
      delete: mockCookieDelete,
    })
  ),
}));

const JWT_SECRET = new TextEncoder().encode("development-secret-key");

describe("createSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets an httpOnly auth-token cookie", async () => {
    const { createSession } = await import("../auth");
    await createSession("user-1", "test@example.com");

    expect(mockCookieSet).toHaveBeenCalledOnce();
    const [name, , options] = mockCookieSet.mock.calls[0];
    expect(name).toBe("auth-token");
    expect(options.httpOnly).toBe(true);
    expect(options.sameSite).toBe("lax");
    expect(options.path).toBe("/");
  });

  it("stores a valid signed JWT in the cookie", async () => {
    const { createSession } = await import("../auth");
    await createSession("user-1", "test@example.com");

    const token = mockCookieSet.mock.calls[0][1];
    expect(token.split(".")).toHaveLength(3);

    const { payload } = await jwtVerify(token, JWT_SECRET);
    expect(payload.userId).toBe("user-1");
    expect(payload.email).toBe("test@example.com");
  });

  it("sets cookie expiry ~7 days in the future", async () => {
    const before = Date.now();
    const { createSession } = await import("../auth");
    await createSession("user-1", "test@example.com");

    const options = mockCookieSet.mock.calls[0][2];
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const diff = (options.expires as Date).getTime() - before;
    expect(diff).toBeGreaterThan(sevenDaysMs - 1000);
    expect(diff).toBeLessThan(sevenDaysMs + 1000);
  });
});

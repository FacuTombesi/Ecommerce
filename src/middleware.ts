import { NextRequest, NextResponse } from "next/server";
import { isValidPassword } from "./lib/utils";

export async function middleware(req: NextRequest) {
  if (await isAuthenticated(req) === false) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" } // Uses browser's built-in authenticator
    })
  }
}

// Function that checks if the user is authenticated or not
async function isAuthenticated(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization"); // Get the autorization header from the browser which can have lowercase A o uppercase A

  if (authHeader == null) return false;

  /*
  DECRYPTING authHeader INFORMATION

  Buffer.from(authHeader) = "Basic fg0v87dfy0gse97dyvb09g78s80agf98aguv8f"
  Buffer.from(authHeader.split(" ")[1]) = "fg0v87dfy0gse97dyvb09g78s80agf98aguv8f"
  Buffer.from(authHeader.split(" ")[1], "base64") = [username:password]
  Buffer.from(authHeader.split(" ")[1], "base64").toString() = "username:password"
  Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":") = "username", "password"
  */

  const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":"); // Get the username and password from the second value ([1]) of the authHeader and, since the information is encrypted, we use the buffer to decrypt it

  return username === process.env.ADMIN_USERNAME && (await isValidPassword(password, process.env.HASHED_ADMIN_PASSWORD as string));
}

// Set up a config to run the middleware every time a condition inside the config is met
export const config = {
  matcher: "/admin/:path*" // Gets every path that's under the admin path
}
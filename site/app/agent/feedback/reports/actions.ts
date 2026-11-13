"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { OWNER_COOKIE, ownerToken, sameText } from "@/lib/feedback/owner.ts"

const PAGE = "/agent/feedback/reports"

/** Checks the secret and, when it's right, sets the owner cookie for a week. */
export async function signIn(form: FormData) {
  const secret = process.env.FEEDBACK_REPORTS_SECRET
  const given = String(form.get("secret") ?? "")
  if (!secret || !given || !sameText(given, secret)) redirect(`${PAGE}?wrong=1`)
  ;(await cookies()).set(OWNER_COOKIE, ownerToken(secret), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: PAGE,
    maxAge: 60 * 60 * 24 * 7,
  })
  redirect(PAGE)
}

export async function signOut() {
  ;(await cookies()).delete({ name: OWNER_COOKIE, path: PAGE })
  redirect(PAGE)
}

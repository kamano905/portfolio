import { locales } from "@/lib/i18n/config"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

function findPageId(value: unknown): string | null {
  if (!value || typeof value !== "object") return null

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findPageId(item)
      if (found) return found
    }
    return null
  }

  const record = value as Record<string, unknown>

  if (typeof record.page_id === "string") return record.page_id
  if (typeof record.pageId === "string") return record.pageId
  if (record.object === "page" && typeof record.id === "string")
    return record.id

  for (const nested of Object.values(record)) {
    const found = findPageId(nested)
    if (found) return found
  }

  return null
}

export async function POST(request: Request) {
  const secret = request.headers.get("X-Notion-Secret")

  if (secret !== process.env.NOTION_WEBHOOK_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = await request.json().catch(() => null)
  const explicitProjectId =
    typeof payload?.projectId === "string"
      ? payload.projectId
      : typeof payload?.id === "string"
        ? payload.id
        : null

  for (const locale of locales) {
    revalidatePath(`/${locale}/home`)
    revalidatePath(`/${locale}/about`)
  }

  let revalidatedProjectPath: string | null = null
  const pageId = explicitProjectId ?? findPageId(payload)

  if (pageId) {
    revalidatedProjectPath = pageId
  }

  if (revalidatedProjectPath) {
    for (const locale of locales) {
      revalidatePath(`/${locale}/projects/${revalidatedProjectPath}`)
    }
  }

  return NextResponse.json({
    success: true,
    paths: revalidatedProjectPath
      ? locales.flatMap((locale) => [
          `/${locale}/home`,
          `/${locale}/about`,
          `/${locale}/projects/${revalidatedProjectPath}`,
        ])
      : locales.flatMap((locale) => [`/${locale}/home`, `/${locale}/about`]),
  })
}

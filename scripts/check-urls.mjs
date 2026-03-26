#!/usr/bin/env node

import { promises as fs } from "node:fs"
import path from "node:path"
import process from "node:process"

const ROOT_DIR = process.cwd()
const TARGET_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".md",
  ".mdx",
  ".json",
])
const IGNORE_DIR_NAMES = new Set([
  ".git",
  ".next",
  "node_modules",
  "dist",
  "coverage",
  "out",
])
const URL_PATTERN = /\bhttps?:\/\/[^\s<>"'`()[\]]+/g
const REQUEST_TIMEOUT_MS = 15000
const MAX_CONCURRENCY = 8
const SHOULD_LIST_ONLY = process.argv.includes("--list-only")
const IGNORED_URL_PATTERNS = [
  /^https:\/\/vercel\.com\/new\/clone\?/,
]

function cleanExtractedUrl(rawUrl) {
  return rawUrl.replace(/[.,;:!?*]+$/g, "")
}

function shouldSkipUrl(url) {
  if (/[{}]/.test(url)) {
    return true
  }
  return IGNORED_URL_PATTERNS.some((pattern) => pattern.test(url))
}

async function collectFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  const paths = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dirPath, entry.name)
      if (entry.isDirectory()) {
        if (IGNORE_DIR_NAMES.has(entry.name)) {
          return []
        }
        return collectFiles(fullPath)
      }
      const extension = path.extname(entry.name)
      if (!TARGET_EXTENSIONS.has(extension)) {
        return []
      }
      return [fullPath]
    }),
  )
  return paths.flat()
}

async function extractUrlsFromFile(filePath) {
  const content = await fs.readFile(filePath, "utf8")
  const found = content.match(URL_PATTERN) ?? []
  return found.map(cleanExtractedUrl)
}

async function extractAllUrls() {
  const files = await collectFiles(ROOT_DIR)
  const urlSet = new Set()

  await Promise.all(
    files.map(async (filePath) => {
      const urls = await extractUrlsFromFile(filePath)
      for (const url of urls) {
        if (shouldSkipUrl(url)) {
          continue
        }
        urlSet.add(url)
      }
    }),
  )

  return Array.from(urlSet).sort((a, b) => a.localeCompare(b))
}

async function requestWithFallback(url) {
  const headers = {
    "user-agent": "portfolio-nextjs-notion-url-checker/1.0",
  }

  const headResponse = await fetch(url, {
    method: "HEAD",
    redirect: "follow",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers,
  })

  if (headResponse.ok || headResponse.status === 429) {
    return headResponse
  }

  if ([403, 405, 501].includes(headResponse.status)) {
    return fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers,
    })
  }

  return headResponse
}

async function runWithConcurrency(items, worker) {
  let index = 0
  const workers = Array.from({ length: MAX_CONCURRENCY }, async () => {
    while (index < items.length) {
      const currentIndex = index
      index += 1
      await worker(items[currentIndex])
    }
  })
  await Promise.all(workers)
}

async function validateUrls(urls) {
  const failures = []

  await runWithConcurrency(urls, async (url) => {
    try {
      const response = await requestWithFallback(url)
      if (!response.ok && response.status !== 429) {
        failures.push({ url, status: response.status, reason: response.statusText })
      }
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Unknown error"
      failures.push({ url, status: "ERR", reason })
    }
  })

  return failures
}

async function main() {
  const urls = await extractAllUrls()

  if (urls.length === 0) {
    console.log("No HTTP(S) URLs found.")
    return
  }

  if (SHOULD_LIST_ONLY) {
    console.log(`Found ${urls.length} URL(s):`)
    for (const url of urls) {
      console.log(`- ${url}`)
    }
    return
  }

  console.log(`Checking ${urls.length} URL(s)...`)
  const failures = await validateUrls(urls)

  if (failures.length > 0) {
    console.error(`Found ${failures.length} broken URL(s):`)
    for (const failure of failures) {
      console.error(
        `- ${failure.url} -> ${failure.status} (${failure.reason || "request failed"})`,
      )
    }
    process.exitCode = 1
    return
  }

  console.log("All URLs are valid.")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

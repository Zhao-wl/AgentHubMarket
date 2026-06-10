#!/usr/bin/env node
// 校验 marketplace.json 是否符合 AgentHub 远端市场格式要求。
// 零依赖,可在 CI 或本地直接用 `node scripts/validate-marketplace.mjs` 运行。

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const manifestPath = join(root, 'marketplace.json')

const errors = []
const warnings = []

const ID_RE = /^[a-z0-9][a-z0-9._-]*$/
const VERSION_RE = /^v?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/
const REPO_RE = /^https:\/\/(github\.com|gitlab\.com)\/.+/
const RAW_RE = /^https:\/\/(raw\.githubusercontent\.com|gitlab\.com)\/.+/
const HTTPS_HOST_RE = /^https:\/\/(github\.com|gitlab\.com|raw\.githubusercontent\.com)\/.+/

let raw
try {
  raw = readFileSync(manifestPath, 'utf8')
} catch (err) {
  console.error(`无法读取 marketplace.json: ${err.message}`)
  process.exit(1)
}

let data
try {
  data = JSON.parse(raw)
} catch (err) {
  console.error(`marketplace.json 不是合法 JSON: ${err.message}`)
  process.exit(1)
}

if (data.schemaVersion !== 1) {
  errors.push(`schemaVersion 必须为 1,实际为 ${JSON.stringify(data.schemaVersion)}`)
}

if (!Array.isArray(data.plugins)) {
  errors.push('plugins 必须是数组')
} else {
  const seen = new Set()
  data.plugins.forEach((p, i) => {
    const where = `plugins[${i}]${p && p.id ? ` (${p.id})` : ''}`

    if (typeof p !== 'object' || p === null) {
      errors.push(`${where}: 必须是对象`)
      return
    }

    for (const field of ['id', 'name', 'version', 'repository', 'readme']) {
      if (typeof p[field] !== 'string' || p[field].length === 0) {
        errors.push(`${where}: 缺少必填字段 ${field}`)
      }
    }

    if (typeof p.id === 'string') {
      if (!ID_RE.test(p.id)) {
        errors.push(`${where}: id 只能包含小写字母、数字、. - _,且不能以符号开头`)
      }
      if (seen.has(p.id)) {
        errors.push(`${where}: id 重复`)
      }
      seen.add(p.id)
    }

    if (typeof p.name === 'string' && p.name.length > 60) {
      errors.push(`${where}: name 不应超过 60 个字符`)
    }

    if (typeof p.version === 'string' && !VERSION_RE.test(p.version)) {
      errors.push(`${where}: version "${p.version}" 不是合法 semver`)
    }

    if (typeof p.repository === 'string' && !REPO_RE.test(p.repository)) {
      errors.push(`${where}: repository 必须是 GitHub / GitLab HTTPS 仓库地址`)
    }

    if (typeof p.readme === 'string' && !RAW_RE.test(p.readme)) {
      errors.push(`${where}: readme 必须是 GitHub / GitLab raw HTTPS URL`)
    }

    if (p.manifest !== undefined && (typeof p.manifest !== 'string' || !RAW_RE.test(p.manifest))) {
      errors.push(`${where}: manifest 必须是 GitHub / GitLab raw HTTPS URL`)
    }

    if (p.homepage !== undefined && (typeof p.homepage !== 'string' || !HTTPS_HOST_RE.test(p.homepage))) {
      errors.push(`${where}: homepage 必须是 GitHub / GitLab HTTPS URL`)
    }

    if (p.icon !== undefined && (typeof p.icon !== 'string' || !RAW_RE.test(p.icon))) {
      errors.push(`${where}: icon 必须是 GitHub / GitLab raw HTTPS URL`)
    }

    if (p.description !== undefined && typeof p.description === 'string' && p.description.length > 160) {
      warnings.push(`${where}: description 超过 160 个字符,展示时可能被截断`)
    }

    if (p.tags !== undefined) {
      if (!Array.isArray(p.tags)) {
        errors.push(`${where}: tags 必须是数组`)
      } else {
        if (p.tags.length > 10) {
          warnings.push(`${where}: tags 超过 10 个,客户端会忽略多余部分`)
        }
        p.tags.forEach((t, ti) => {
          if (typeof t !== 'string' || t.length === 0) {
            errors.push(`${where}: tags[${ti}] 必须是非空字符串`)
          }
        })
      }
    }
  })
}

for (const w of warnings) {
  console.warn(`warning: ${w}`)
}

if (errors.length > 0) {
  console.error('\nmarketplace.json 校验失败:')
  for (const e of errors) {
    console.error(`  - ${e}`)
  }
  process.exit(1)
}

const count = Array.isArray(data.plugins) ? data.plugins.length : 0
console.log(`marketplace.json 校验通过,共 ${count} 个插件条目。`)

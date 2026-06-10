#!/usr/bin/env node
// 将 plugins/agenthub.test-hello/ 同步到仓库根目录，供 GitHub 归档安装使用。
// AgentHub 安装插件时会下载整个仓库 zip，并只在归档根目录查找 agenthub.plugin.json。

import { cpSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const sourceDir = join(root, 'plugins', 'agenthub.test-hello')
const manifestSrc = join(sourceDir, 'agenthub.plugin.json')
const manifestDest = join(root, 'agenthub.plugin.json')
const iconsSrc = join(sourceDir, 'icons')
const iconsDest = join(root, 'icons')

if (!existsSync(manifestSrc)) {
  console.error(`缺少插件源目录: ${manifestSrc}`)
  process.exit(1)
}

cpSync(manifestSrc, manifestDest)
mkdirSync(iconsDest, { recursive: true })
cpSync(iconsSrc, iconsDest, { recursive: true })

const manifest = JSON.parse(readFileSync(manifestDest, 'utf8'))
console.log(`已同步测试插件到仓库根: ${manifest.id}@${manifest.version}`)

# 本地开发指南

本文说明如何将本仓库作为 AgentHub 的远端市场，并用内置测试插件验证插件功能。

## 前置条件

- 本地已安装并可运行 [AgentHub](../AgentHub)（`D:\Projects\Research\AgentHub`）。
- 本仓库已推送到 GitHub：`https://github.com/Zhao-wl/AgentHubMarket`（默认分支 `master`）。

> AgentHub M1 只从 **GitHub / GitLab HTTPS** 拉取市场清单与插件归档，不能直接读取本地磁盘路径。修改本仓库后需 `git push`，再在 AgentHub 中刷新市场。

## 1. 配置 AgentHub 市场源

在 AgentHub **设置中心 → 插件 → 插件市场 → 市场源列表** 中填入：

```json
[
  {
    "id": "agenthub-market-local",
    "name": "AgentHubMarket (Dev)",
    "type": "github",
    "url": "https://github.com/Zhao-wl/AgentHubMarket",
    "manifestPath": "marketplace.json",
    "ref": "master",
    "enabled": true
  }
]
```

也可使用直接 URL 类型：

```json
[
  {
    "id": "agenthub-market-local",
    "name": "AgentHubMarket (Dev)",
    "type": "url",
    "url": "https://raw.githubusercontent.com/Zhao-wl/AgentHubMarket/master/marketplace.json",
    "enabled": true
  }
]
```

建议同时开启 **打开插件市场时自动刷新**（`agenthub.marketplace.refreshOnOpen`）。

## 2. 测试插件说明

内置测试插件位于 `plugins/agenthub.test-hello/`，已在 `marketplace.json` 中登记。

由于 AgentHub 安装时会下载**整个插件仓库**的 GitHub 归档，并只在归档根目录查找 `agenthub.plugin.json`，本仓库采用「源目录 + 根目录同步」的方式：

| 路径 | 用途 |
| --- | --- |
| `plugins/agenthub.test-hello/` | 插件源码（编辑此目录） |
| `agenthub.plugin.json`、`icons/`（根目录） | 由同步脚本生成，供 GitHub 归档安装 |

修改测试插件后，在仓库根目录执行：

```bash
node scripts/sync-test-plugin.mjs
node scripts/validate-marketplace.mjs
git add .
git commit -m "..."
git push
```

然后在 AgentHub 插件市场中点击刷新。

## 3. 建议验证步骤

1. 刷新市场，确认列表中出现 **Test Hello**。
2. 打开详情页，确认 README 与 manifest 信息正常。
3. 安装插件。
4. 在当前项目启用插件。
5. 左侧活动栏出现 **Hello Test** 图标；点击后 L 面板显示占位视图（含 `pluginId` / `activityId` / `viewId`）。
6. 设置中心 → **Test Hello** 分类下可见「问候语」配置项。

## 4. 常见问题

**刷新后看不到插件**

- 确认已 `git push` 到 GitHub，且 `ref` 与默认分支一致（本仓库为 `master`）。
- 检查 AgentHub 市场源 JSON 格式是否正确。

**安装失败：缺少 agenthub.plugin.json**

- 确认已运行 `node scripts/sync-test-plugin.mjs` 并将根目录的 `agenthub.plugin.json`、`icons/` 一并提交推送。

**manifest id/version 与市场条目不一致**

- 同步后检查 `plugins/agenthub.test-hello/agenthub.plugin.json` 与 `marketplace.json` 中对应条目的 `id`、`version` 是否一致。

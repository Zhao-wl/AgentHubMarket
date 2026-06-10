# 插件提交说明

本文档说明如何向 AgentHub Marketplace 提交插件条目。

## 提交流程

1. Fork 本仓库。
2. 在 `marketplace.json` 的 `plugins` 数组中追加你的插件条目。
3. 确保插件条目通过 `schemas/marketplace.schema.json` 校验。
4. 提交 Pull Request,在描述中说明插件用途与仓库地址。
5. 维护者审核索引信息后合并。

> 提示:合并到本仓库只表示插件被收录进索引,**不代表 AgentHub 对插件代码做了安全审查或背书**。

## 插件条目字段

### 必需字段

| 字段 | 类型 | 要求 |
| --- | --- | --- |
| `id` | string | 插件全局唯一 id。只能包含小写字母、数字、`.`、`-`、`_`,建议使用发布者前缀,如 `agenthub.skill-browser` |
| `name` | string | 插件展示名称,不应超过 60 个字符 |
| `version` | string | 语义化版本,如 `0.1.0` |
| `repository` | string | 插件仓库地址,必须是 GitHub / GitLab HTTPS 仓库地址 |
| `readme` | string | README 原始文件 URL,必须是 HTTPS |

### 可选字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `description` | string | 列表摘要,不应超过 160 个字符 |
| `publisher` | string | 发布者名称 |
| `ref` | string | 插件安装与缺省文件探测使用的分支 / tag / commit。缺省使用市场源 `ref`,再回落 `main` / `master` |
| `manifest` | string | `agenthub.plugin.json` 原始文件 URL。缺省时客户端按仓库根目录探测 |
| `tags` | string[] | 搜索与筛选标签,建议小写 kebab-case,最多 10 个 |
| `license` | string | 许可证标识,如 `MIT` |
| `homepage` | string | 插件主页 |
| `icon` | string | 图标原始 URL |

## 插件条目示例

GitHub 仓库:

```json
{
  "id": "agenthub.skill-browser",
  "name": "Skill Browser",
  "description": "浏览与管理本地 Skill",
  "publisher": "agenthub",
  "version": "0.1.0",
  "repository": "https://github.com/acme/agenthub-skill-browser",
  "ref": "main",
  "readme": "https://raw.githubusercontent.com/acme/agenthub-skill-browser/main/README.md",
  "manifest": "https://raw.githubusercontent.com/acme/agenthub-skill-browser/main/agenthub.plugin.json",
  "tags": ["skill", "tools"],
  "license": "MIT"
}
```

GitLab 仓库:

```json
{
  "id": "agenthub.mcp-tools",
  "name": "MCP Tools",
  "description": "管理项目可用 MCP 工具",
  "publisher": "agenthub",
  "version": "0.1.0",
  "repository": "https://gitlab.com/acme/agenthub-mcp-tools",
  "ref": "main",
  "readme": "https://gitlab.com/acme/agenthub-mcp-tools/-/raw/main/README.md",
  "manifest": "https://gitlab.com/acme/agenthub-mcp-tools/-/raw/main/agenthub.plugin.json",
  "tags": ["mcp"]
}
```

## 插件仓库要求

每个插件条目的 `repository` 指向一个独立插件仓库。插件仓库至少应包含:

```text
agenthub-skill-browser/
├─ README.md
├─ agenthub.plugin.json
├─ package.json                 # 如果插件使用 Node/前端构建,推荐提供
├─ dist/                        # 推荐提交可直接加载的构建产物
└─ icons/
   └─ plugin.svg
```

约束:

- 插件仓库应提交可直接安装 / 加载的产物。AgentHub 不在安装时执行 `npm install`、`npm run build` 或任意构建脚本。
- `agenthub.plugin.json` 中的 `id`、`version` 必须与本仓库 `marketplace.json` 条目一致。不一致时客户端会阻断安装。
- README 中可以包含 Markdown,但不应依赖远端脚本执行。

## URL 规范

- 所有 URL 必须是 `https`,拒绝 `http`。
- `repository` 必须是 `https://github.com/<owner>/<repo>` 或 `https://gitlab.com/<group...>/<repo>`。
- `readme`、`manifest` 必须是 GitHub / GitLab raw HTTPS URL。
- `homepage`、`icon` 必须是 GitHub / GitLab HTTPS URL。

## 本地校验

提交前可使用 `schemas/marketplace.schema.json` 校验清单格式。仓库已配置 CI,在 Pull Request 上会自动校验 `marketplace.json`:

1. 校验 `marketplace.json` 是合法 JSON。
2. 校验 `schemaVersion` 与必填字段。
3. 校验插件 `id` 唯一。
4. 校验 URL 符合 GitHub / GitLab HTTPS 约束。

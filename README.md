# AgentHub Marketplace

AgentHub 官方插件市场索引仓库。本仓库是 AgentHub 插件宿主的**远端数据源**,只提供插件列表清单,不运行任何服务端逻辑,也不托管用户状态或插件代码。

## 用途

AgentHub 客户端通过用户级 / 项目级设置项 `agenthub.marketplace.sources` 配置市场源地址,从本仓库读取 `marketplace.json`,再根据其中的插件条目展示插件列表、README、安装来源与插件 manifest。

## 维护团队

由 AgentHub 维护。插件收录范围:与 AgentHub 宿主兼容、提供 `agenthub.plugin.json` manifest 的公开插件。

## 如何配置为市场源

在 AgentHub 设置中心的 `agenthub.marketplace.sources` 中加入一条:

```json
{
  "id": "official",
  "name": "AgentHub Official Marketplace",
  "type": "github",
  "url": "https://github.com/<owner>/AgentHubMarket",
  "manifestPath": "marketplace.json",
  "ref": "main",
  "enabled": true
}
```

也可以直接指向清单文件原始 URL(`type: "url"`):

```json
{
  "id": "official",
  "name": "AgentHub Official Marketplace",
  "type": "url",
  "url": "https://raw.githubusercontent.com/<owner>/AgentHubMarket/main/marketplace.json",
  "enabled": true
}
```

## 如何提交插件

通过 Pull Request 修改 `marketplace.json`,在 `plugins` 数组中追加你的插件条目。提交流程与字段要求见 [docs/publishing.md](docs/publishing.md)。

每个插件条目至少需要:

| 字段 | 说明 |
| --- | --- |
| `id` | 插件全局唯一 id,只能包含小写字母、数字、`.`、`-`、`_`,建议使用发布者前缀 |
| `name` | 插件展示名称 |
| `version` | 语义化版本 |
| `repository` | 插件仓库地址,必须是 GitHub / GitLab HTTPS 仓库地址 |
| `readme` | README 原始文件 URL,必须是 HTTPS |

完整字段说明见本仓库 `schemas/marketplace.schema.json` 与 AgentHub 文档 `docs/M1-4-remote-marketplace-format.md`。

## 可信边界与安全声明

- 本市场源**只提供插件索引**,不对插件代码做安全审查或背书。
- 安装插件即信任对应的插件仓库与发布者。请在安装前自行确认插件仓库来源可信。
- AgentHub 客户端只读取 JSON 清单,不执行远端代码;插件 README 中的 HTML 与脚本不会被执行。
- 本仓库不收集账号、评分、评论或下载量数据。

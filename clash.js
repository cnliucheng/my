// Clash 配置文件覆写脚本
// 适配: Clash Verge (Rev) / Mihomo / Clash for Windows (Parsers)

function main(config) {
  // --- 1. 定义测速参数 (您指定的参数) ---
  const testUrl = "http://www.gstatic.com/generate_204";
  const testInterval = 180;
  const testTolerance = 50;

  // --- 2. 定义规则集提供者 (Rule Providers) ---
  // 使用 Blackmatrix7 规则源
  const providers = {
    "GitHub": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GitHub/GitHub.list",
    "OpenAI": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/OpenAI/OpenAI.list",
    "Gemini": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Gemini/Gemini.list",
    "Claude": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Claude/Claude.list",
    "Bing": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Bing/Bing.list",
    "Copilot": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Copilot/Copilot.list",
    "YouTube": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/YouTube/YouTube.list",
    "Netflix": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Netflix/Netflix.list",
    "Disney": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Disney/Disney.list",
    "GlobalMedia": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GlobalMedia/GlobalMedia.list",
    "Telegram": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Telegram/Telegram.list",
    "Google": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Google/Google.list",
    "Apple": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Apple/Apple.list",
    "Microsoft": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Microsoft/Microsoft.list",
    "Advertising": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Advertising/Advertising.list",
    "Hijacking": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Hijacking/Hijacking.list",
    "Privacy": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Privacy/Privacy.list",
    "Lan": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Lan/Lan.list",
    "ChinaMax": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/ChinaMax/ChinaMax_Classical.list"
  };

  // 写入 rule-providers 到配置
  config["rule-providers"] = {};
  for (const [key, url] of Object.entries(providers)) {
    config["rule-providers"][key] = {
      type: "http",
      behavior: "classical",
      url: url,
      path: `./ruleset/${key}.yaml`,
      interval: 86400
    };
  }

  // --- 3. 定义策略组逻辑 ---
  
  // 核心子节点列表 (用于填充到各个功能分组中)
  const coreSubProxies = [
    "🚀 节点选择",
    "♻️ 自动选择",
    "🇭🇰 香港节点",
    "🇹🇼 台湾节点",
    "🇯🇵 日本节点",
    "🇸🇬 新加坡节点",
    "🇺🇸 美国节点",
    "🌍 其他地区",
    "🤏 手动选择"
  ];

  // 基础地区/功能分组定义
  // 注意：include-all: true 配合 filter 使用，实现正则筛选
  const groups = [
    {
      // 1. 核心入口
      name: "🚀 节点选择",
      type: "select",
      proxies: ["♻️ 自动选择", "🤏 手动选择", "🇭🇰 香港节点", "🇹🇼 台湾节点", "🇯🇵 日本节点", "🇸🇬 新加坡节点", "🇺🇸 美国节点", "🌍 其他地区", "🎯 全球直连"]
    },
    {
      // 2. 手动选择 (包含所有节点)
      name: "🤏 手动选择",
      type: "select",
      "include-all": true
    },
    {
      // 3. 自动选择 (全节点测速)
      name: "♻️ 自动选择",
      type: "url-test",
      url: testUrl,
      interval: testInterval,
      tolerance: testTolerance,
      "include-all": true
    },
    // --- 国家/地区自动分组 (使用 filter 正则) ---
    {
      name: "🇭🇰 香港节点",
      type: "url-test",
      url: testUrl,
      interval: testInterval,
      tolerance: testTolerance,
      "include-all": true,
      filter: "(?i)港|HK|Hong"
    },
    {
      name: "🇹🇼 台湾节点",
      type: "url-test",
      url: testUrl,
      interval: testInterval,
      tolerance: testTolerance,
      "include-all": true,
      filter: "(?i)台|TW|Tai"
    },
    {
      name: "🇯🇵 日本节点",
      type: "url-test",
      url: testUrl,
      interval: testInterval,
      tolerance: testTolerance,
      "include-all": true,
      filter: "(?i)日|JP|Japan"
    },
    {
      name: "🇸🇬 新加坡节点", // 关键修改：严格正则
      type: "url-test",
      url: testUrl,
      interval: testInterval,
      tolerance: testTolerance,
      "include-all": true,
      filter: "(?i)新加坡|狮城|SG|Singapore" 
    },
    {
      name: "🇺🇸 美国节点",
      type: "url-test",
      url: testUrl,
      interval: testInterval,
      tolerance: testTolerance,
      "include-all": true,
      filter: "(?i)美|US|States|United"
    },
    {
      name: "🌍 其他地区", // 排除上述所有关键字
      type: "url-test",
      url: testUrl,
      interval: testInterval,
      tolerance: testTolerance,
      "include-all": true,
      filter: "(?i)^(?!.*(?:港|HK|Hong|台|TW|Tai|日|JP|Japan|新加坡|狮城|SG|Singapore|美|US|States|中|CN|China|回国)).*"
    },
    // --- 功能性分组 (AI, 流媒体等) ---
    // 这里的 proxies 我们使用展开运算符 ...coreSubProxies 来填充
    {
      name: "🐱 GitHub",
      type: "select",
      proxies: [...coreSubProxies, "🎯 全球直连"]
    },
    {
      name: "💬 ChatGPT",
      type: "select",
      // AI 优先推荐美/新/日
      proxies: ["🇺🇸 美国节点", "🇸🇬 新加坡节点", "🇯🇵 日本节点", "🇹🇼 台湾节点", "🚀 节点选择", "♻️ 自动选择", "🇭🇰 香港节点", "🌍 其他地区", "🤏 手动选择"]
    },
    {
      name: "💎 Gemini",
      type: "select",
      proxies: ["🇺🇸 美国节点", "🇸🇬 新加坡节点", "🇯🇵 日本节点", "🇹🇼 台湾节点", "🚀 节点选择", "♻️ 自动选择", "🇭🇰 香港节点", "🌍 其他地区", "🤏 手动选择"]
    },
    {
      name: "🤖 其他AI",
      type: "select",
      proxies: ["🇺🇸 美国节点", "🇸🇬 新加坡节点", "🇯🇵 日本节点", "🇹🇼 台湾节点", "🚀 节点选择", "♻️ 自动选择", "🇭🇰 香港节点", "🌍 其他地区", "🤏 手动选择"]
    },
    {
      name: "📹 油管视频",
      type: "select",
      proxies: coreSubProxies
    },
    {
      name: "🎬 奈飞视频",
      type: "select",
      proxies: coreSubProxies
    },
    {
      name: "🐭 迪士尼+",
      type: "select",
      proxies: coreSubProxies
    },
    {
      name: "📲 电报消息",
      type: "select",
      proxies: coreSubProxies
    },
    {
      name: "☁️ 谷歌服务",
      type: "select",
      proxies: coreSubProxies
    },
    {
      name: "🍎 苹果服务",
      type: "select",
      proxies: ["🎯 全球直连", ...coreSubProxies]
    },
    {
      name: "🎯 全球直连",
      type: "select",
      proxies: ["DIRECT"]
    },
    {
      name: "🛑 全球拦截",
      type: "select",
      proxies: ["REJECT", "DIRECT"]
    },
    {
      name: "🐟 漏网之鱼",
      type: "select",
      proxies: ["🎯 全球直连", ...coreSubProxies]
    }
  ];

  // 覆盖配置中的 proxy-groups
  config["proxy-groups"] = groups;

  // --- 4. 定义规则 (Rules) ---
  // 注意顺序：GitHub > AI > 流媒体 > 微软 > 拦截 > 直连 > 兜底
  const rules = [
    // 1. GitHub (必须在 Microsoft 之前)
    "RULE-SET,GitHub,🐱 GitHub",
    
    // 2. AI
    "RULE-SET,OpenAI,💬 ChatGPT",
    "RULE-SET,Gemini,💎 Gemini",
    "RULE-SET,Claude,🤖 其他AI",
    "RULE-SET,Bing,🤖 其他AI",
    "RULE-SET,Copilot,🤖 其他AI",

    // 3. 流媒体
    "RULE-SET,YouTube,📹 油管视频",
    "RULE-SET,Netflix,🎬 奈飞视频",
    "RULE-SET,Disney,🐭 迪士尼+",
    "RULE-SET,GlobalMedia,🚀 节点选择",

    // 4. 常用
    "RULE-SET,Telegram,📲 电报消息",
    "RULE-SET,Google,☁️ 谷歌服务",
    "RULE-SET,Apple,🍎 苹果服务",

    // 5. 微软 (GitHub 之后)
    "RULE-SET,Microsoft,🎯 全球直连",

    // 6. 拦截
    "RULE-SET,Advertising,🛑 全球拦截",
    "RULE-SET,Hijacking,🛑 全球拦截",
    "RULE-SET,Privacy,🛑 全球拦截",

    // 7. 直连
    "RULE-SET,Lan,🎯 全球直连",
    "RULE-SET,ChinaMax,🎯 全球直连",
    "GEOIP,CN,🎯 全球直连",

    // 8. 兜底
    "MATCH,🐟 漏网之鱼"
  ];

  // 覆盖配置中的 rules
  config["rules"] = rules;

  // 返回修改后的配置
  return config;
}

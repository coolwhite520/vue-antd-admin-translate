const {pinyin} = require("pinyin-pro") ;

const str11 = "常 邢 胥 宿 商 巢 终 剪 绍 崇 祥 晨 众 紫 旋 彩 悦 珠 问 爽 责 做 扎 专 族 祭 组 胙 敞 处 唱 匙 钗 钏 啜 产 蛇 赦 率 参 设 副 寂 雀 勘 捏 粘 羞 剩 阡 侧 偷 讼 徜 得 徙 奘 奢 庶 啐 啥 唼 售 唰 狻 挫 捎 捅 绌 绅 细 圊 悚 孰 斜 旌 觋 栀 氢 欷 瓷 悫 悉 胂 胗 胝 钓 钒 钕 钎 钐 钍 锎 疵 砦 袖 蚺 蚱 蛀 舂 粗 衅 船 舷 舴 豉 酗 趾 馗 许 崔 康 梅 强 符 苻 苑 国 茅 寇 区 卿 英 苟 笪 第 健 乾 茂 坚 彬 启 若 苛 悟 顷 婧 婕 寄 笛 皎 梧 术 梓 笮 笠 苦 茬 庾 偕 狭 笙 崧 苫 珙 梗 笱 蛊 贯 茆 茉 梵 苔 竟 近 教 假 圈 茄 朐 苞 偶 苒 厣 厢 匦 偈 芾 苣 苡 苎 茇 苯 苷 苴 苓 苠 苜 苤 苕 茚 茁 御 啃 啉 啬 唷 婪 娶 捍 捐 捃 捆 挹 绀 堇 圉 悍 悝 悃 悄 悛 悒 轭 旎 戛 规 枧 梃 桴 梏 桷 梢 梳 桫 梭 梯 桶 械 牿 救 氪 晤 祛 胍 胛 胩 胤 秸 盔 眷 眶 眼 痊 窑 疑 蛄 蛆 蚯 蛱 舸 袈 笨 笞 笳 笸 筇 笥 笤 翊 趁 趄 趼 毕 苗 麦 班 麻 习 扈 海 浦 鱼 浮 邦 望 雪 浩 浪 浚 曼 觅 敏 务 晚 浴 货 唿 患 婚 毫 浣 消 涉 够 密 邡 偏 被 徘 胖 涓 闭 彪 胞 斌 捌 匏 匐 匾 邪 凰 冕 偎 讹 访 返 庳 彗 啡 唪 唬 啤 妇 婢 婊 婆 狈 狴 挟 捕 泾 涎 洚 浜 涔 浸 浼 涑 涕 浯 浠 浙 浞 绊 绂 绋 悖 悔 败 贬 贩 贫 烹 殍 旆 晦 瓶 珩 背 胚 脬 盒 眯 眸 痕 票 袍 蚵 粕 艴 舶 袤 麸 酚 趺 雩 张 梁 章 从 娄 鹿 戚 那 朗 振 翎 晟 梨 甜 将 斩 狼 略 累 狸 粒 聊 勒 敕 珧 斛 晗 贪 条 啖 带 动 讷 软 您 卤 剔 侦 停 偬 诀 徕 帐 啶 唳 啕 唾 啁 啄 狷 猁 屉 执 挺 捋 挽 捉 捭 绐 囵 悌 烃 烽 焓 焊 烷 焐 烯 晡 珥 珞 胎 胄 眵 眦 痔 窒 袜 蛋 蛉 聃 聆 粜 胬 顶 羝 羚 舵 舳 袋 觖 豚 酞 胡 闫 敖 尉 焉 野 伟 基 悠 唯 庸 婉 娅 迎 胃 帷 寅 移 崖 欲 庵 眭 堂 岗 培 牵 勖 偃 讶 茔 迕 迓 哑 啪 媪 狺 狳 岽 峥 崃 崩 崮 崞 崛 崆 崎 崤 崦 挨 捂 揶 垭 埯 埠 埭 堆 堀 埝 堋 埤 埽 埸 域 埴 牾 琊 恿 眺 痒 痍 痖 鸟 硐 硌 硅 硭 硒 硎 畦 窕 蚰 蚴 蛭 粤 翌";
const str15 = "闾 驷 赏 锐 锋 挚 婵 趣 皱 踪 着 陟 摧 锄 醋 嘬 厂 腺 线 审 琐 谁 数 锅 刽 犊 节 剑 靓 剧 缄 请 厨 劈 刳 陉 陬 傻 儇 谄 谂 谇 谆 诼 诹 廛 帜 幢 咝 哓 嘟 噙 嘶 嘻 嘱 噪 驶 驵 摔 缌 惭 赐 熟 殇 毵 敷 璁 怂 肠 腮 腧 腥 稍 稹 钡 铤 铗 锕 锉 锇 锆 锔 锒 锂 锍 锊 铺 锓 锑 销 锌 锃 锞 疮 瘛 磉 罚 署 蚀 螋 糍 糅 糌 艏 艘 翥 鋈 髯 郭 樊 葛 巩 楼 毅 翦 颉 广 妫 庆 贤 标 啸 萱 醉 娇 莹 葵 樟 篆 箴 葳 郴 枞 样 媵 仪 葫 稽 箱 葸 葭 赓 模 稻 荻 僵 赍 踞 脚 箭 桨 驾 贱 穷 葆 宽 靠 课 篇 价 侉 俭 诳 谊 苇 茕 荭 荮 著 葱 蒂 葑 蒈 葡 葜 葚 葶 葙 葬 叽 噔 噍 驹 阄 阃 妩 獍 屦 抠 掴 缂 缃 悭 慷 枢 椠 概 槽 樘 樗 槲 槿 槭 瑰 腱 腭 稿 稷 稼 竖 瞌 瞎 瘠 窳 耦 蝗 蝌 蝤 蝎 糇 颏 羯 筑 箸 篌 篁 酵 醌 范 万 漆 缑 满 慕 撖 虢 盘 暴 墨 辉 霄 复 震 兴 漾 漫 慧 漳 涨 履 落 漓 漏 漕 演 颍 缗 汉 虾 写 滚 庙 漠 闽 摩 缈 摸 暮 玛 鲂 霈 浆 渐 部 漪 凛 陛 陴 勰 卖 诽 菏 蒎 逭 逶 弊 币 幡 幞 哗 嘭 噗 驸 嬉 饼 饷 搏 沪 沤 浒 涟 渗 渔 渍 漭 滴 澉 滹 漶 漤 漉 漂 漱 漩 编 缏 缅 慢 赋 赔 辈 憋 腹 盥 瞑 瘢 鸨 码 褓 褙 褊 褐 蝙 蝽 蝠 蝮 蝥 颌 频 褒 翩 醇 醅 踣 踝 霆 霉 鞔 魃 魄 魅 麾 刘 董 黎 鲁 练 褚 谈 厉 乐 禚 逯 德 进 彻 论 质 蝶 瑶 阵 账 虑 搂 谅 寮 层 腰 齿 除 郯 驼 陡 逮 调 热 侬 辇 闹 熬 儋 僻 诤 奖 弹 叹 唠 噌 噘 嘹 噢 骀 驻 獐 饵 馁 抟 挪 撂 摘 缔 缎 缓 缇 缒 赉 赕 轮 辍 辋 辎 戮 熳 熵 熠 熨 敌 暂 瑭 肿 脑 脶 腠 腩 腽 皑 铽 瘤 瘫 鸩 褡 蝻 粼 羰 觯 躺 践 踟 踔 踮 踏 踢 骶 髫 鼐 叶 欧 卫 殴 养 磊 逸 影 缘 慰 增 鸦 亿 院 蝴 堕 坟 废 确 逵 娴 邮 诿 谀 徵 庑 嘿 噎 阅 嬲 峤 嶝 嶙 纬 垅 墀 墩 怄 忧 惯 慵 牖 磁 磋 磅 磙 磕 碾 磐 磔 蝰 蝣 糊 糈 颐 豌 鱿 鞍 鞋 靥";

function findWordByPinyin(str, pyTone) {
    let arr = str.split(" ")
    for (let item of arr) {
        item = item.trim()
        let py_name = pinyin(item, {toneType: "none"});
        if (pyTone === py_name) {
            console.log( item + ":" + pinyin(item))
        }
    }
}

findWordByPinyin(str11, "ruo")
findWordByPinyin(str15, "xi")

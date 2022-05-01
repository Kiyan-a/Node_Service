/* mongoose为mongodb的进化版，相当于原生JS和jQuery的关系 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/* 创建一个Schema实例,规定数据的结构和规则 */
const ArticleSchema = new Schema({
    content: {
        type: String,
    },
    updateTime: {
        type: Date,
        default: Date.now,
    },
    type: {
        type: String,
    },
});

module.exports = Article = mongoose.model("articles", ArticleSchema);

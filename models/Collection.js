/* mongoose为mongodb的进化版，相当于原生JS和jQuery的关系 */
const mongoose = require("mongoose");
/* mongoose 中任何任何事物都是从 Schema 开始的。每一个 Schema 对应 MongoDB 中的一个集合（collection）。Schema 中定义了集合中文档（document）的样式 */
const Schema = mongoose.Schema;
const dayjs = require('dayjs')
/* 创建一个Schema实例,规定数据的结构和规则 */
const CollectionSchema = new Schema({
  type: {
    //类型
    type: String,
  },
  title: {
    //文章标题
    type: String,
    required: true,
  },
  address: {
    //文章地址
    type: String,
    required: true,
  },
  createDate: {
    //创建时间
    type: String
  },
  remark: {
    //备注
    type: String,
  },
  upDate: {
    // 更新时间
    type: String,
    default: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
  },
});

// 创建一个类，相当于一个集合
// 其中"profile",则为创建的集合，无论大小写，都默认小写的集合名；外加一个s;即：profiles；
module.exports = Collection = mongoose.model("collection", CollectionSchema);

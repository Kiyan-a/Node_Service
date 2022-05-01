/* 文章网站收藏 */
/* 功能： @增删改查 */
const express = require("express");
const router = express.Router();
const Collection = require("../../models/Collection");
let passport = require("passport");
const dayjs = require('dayjs')

/**
 * @method: 添加数据  POST /api/collection/add
 * @param: { Object } 
 * @return: { Object }
*/
router.post(
  "/add",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    let { type = null, title = null, address = null, remark = null, _id = null } = req.body;
    let upDate = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    let CollectionFields = { type, title, address, remark, upDate };
    try {
      if (_id) {
        Collection.findOneAndUpdate({ _id: _id }, { $set: CollectionFields }, { new: true, })
          .then((proflie) => {
            return res.json({
              code: 200,
              succMsg: '修改成功！',
              errMsg: '',
              data: proflie,
            });
          });
      }
      if (!_id) {
        CollectionFields = { createDate: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'), ...CollectionFields };
        new Collection(CollectionFields).save().then((Collection) => {
          res.json({
            code: 200,
            succMsg: '添加成功！',
            errMsg: '',
            data: Collection,
          });
        });
      }
    } catch (error) {
      res.json({
        code: 400,
        succMsg: '操作失败！',
        errMsg: '',
        data: Collection,
      });
    }
  }
);

/**
 * @method: 获取文章数据列表 GET /api/Collections 实现分页与模糊查询功能
 * @param: { Object } 
 * @return: {Object}
*/
router.get(
  "/",
  (req, res) => {
    let { pageSize, pageNum, type = '', title = '' } = req.query
    let regType = new RegExp(type, 'i')
    let regTitle = new RegExp(title, 'i')
    const newData = { title: regTitle, type: regType }
    Collection.find(newData).sort({ _id: -1 }).limit(parseInt(pageSize) || 10).skip(pageSize * (pageNum - 1)).then(collections => {
      Collection.find(newData).countDocuments().then((total) => {
        if (total < 1) {
          res.json({
            code: 200,
            succMsg: '',
            errMsg: '暂无数据！',
            data: {},
          });
        }
        return res.json({
          code: 200,
          succMsg: 'Yes莫拉！',
          errMsg: '',
          data: {
            list: collections,
            total
          },
        });
      })

    }).catch(() => {
      return res.json({
        code: 200,
        succMsg: '',
        errMsg: '查询失败！',
        data: {
          list: [],
          total: 0
        },
      });
    });
  }
);

/**
 * @method: 获取一条数据 GET /api/collection/getOneData
 * @param: { Object } 
 * @return: { Boolean }
*/
router.get(
  "/getOneData",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    let { _id = null } = req.query;
    Collection.findOne({
      _id: _id,
    })
      .then((Collection) => {
        if (!Collection) return res.json("没有数据!");
        return res.json({
          code: 200,
          succMsg: '',
          errMsg: '',
          data: {
            list: [Collection],
            total: 0
          },
        });
      })
      .catch((err) => {
        res.status(404).json(err);
      });
  }
);


/**
 * @method: 删除数据  DELETE /api/collection/delete
 * @param: { Object } 
 * @return: {}
*/
router.delete(
  "/delete",
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let { id } = req.query
    Collection.findOneAndRemove({
      _id: id,
    })
      .then((Collection) => {
        res.json({
          code: 200,
          succMsg: '删除成功！',
          errMsg: '',
          data: Collection,
        });
      })
      .catch((err) => {
        res.json({
          code: 200,
          succMsg: '',
          errMsg: '数据删除失败！',
          data: {},
        });
      });
  }
);
module.exports = router;

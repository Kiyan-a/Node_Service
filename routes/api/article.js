/* 功能： @增删改查 */
const express = require("express");
const router = express.Router();
const Article = require("../../models/Article");
let passport = require("passport");

/**
 * @method: 添加数据 
 * @param: { Object } 
 * @return: { Object }
*/
router.post(
    "/addArticle",
    passport.authenticate("jwt", {
        session: false,
    }),
    (req, res) => {
        let { content, updateTime = '', type } = req.body
        const profileFields = {
            content,
            updateTime,
            type,
        };
        new Article(profileFields).save().then((profile) => {
            res.json(profile);
        });
    }
);

/**
 * @method: 获取文章数据
 * @param: { Object } 
 * @return: { Object }
*/
router.get(
    "/getArticleData",
    passport.authenticate("jwt", {
        session: false,
    }),
    (req, res) => {
        Article.find()
            .then((data) => {
                if (!data) return res.json("没有任何数据!");
                res.json(data);
            })
            .catch((err) => {
                res.status(404).json(err);
            });
    }
);

/**
 * @method: 获取单条文章数据
 * @param: { String } 
 * @return: { Object }
*/
router.get(
    "/:id",
    passport.authenticate("jwt", {
        session: false,
    }),
    (req, res) => {
        Article.findOne({
            _id: req.params.id,
        })
            .then((data) => {
                if (!data) return res.json("没有数据!");
                res.json(data);
            })
            .catch((err) => {
                res.status(404).json(err);
            });
    }
);

/**
 * @method: 编辑文章
 * @param: { String } 
 * @return: {  }
*/
router.post(
    "/editArticle/:id",
    passport.authenticate("jwt", {
        session: false,
    }),
    (req, res) => {
        let { content, updateTime = '', type } = req.body
        const profileFields = {
            content,
            updateTime,
            type,
        };
        Article.findOneAndUpdate(
            {
                _id: req.params.id,
            },
            {
                $set: profileFields,
            },
            {
                new: true,
            }
        ).then((proflie) => {
            res.json(proflie);
        });
    }
);

/**
 * @method: 删除数据
 * @param: { String } 
 * @return: { Object }
*/
router.delete(
    "/delete/:id",
    passport.authenticate("jwt", {
        session: false,
    }),
    (req, res) => {
        Article.findOneAndRemove({
            _id: req.params.id,
        })
            .then((profile) => {
                res.json("删除成功!");
            })
            .catch((err) => {
                res.status(404).json("删除失败!");
            });
    }
);
module.exports = router;

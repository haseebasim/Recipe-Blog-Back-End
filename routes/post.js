const express = require("express");
const Post = require("../models/post");
const router = new express.Router();
const multer = require("multer");
const auth = require("../middlewear/auth");

router.post("/add_post", async (req, res) => {
  console.log(req.body);

  const post = new Post(req.body);
  try {
    await post.save();

    res.send(post);
  } catch (error) {
    res.send(error);
  }
});

router.get("/posts_count", async (req, res) => {
  try {
    const count = await Post.estimatedDocumentCount();
    if (!count) {
      res.send("-1");
    }

    res.send({ count });
  } catch (error) {
    res.send(error);
  }
});

router.post("/save", auth, async (req, res) => {
  const user_id = req.user._id;
  const post_id = req.body.post_id;

  try {
    const post = await Post.findOne({ _id: post_id });
    if (post.savedBy.includes(user_id)) {
      res.send("-1");
    } else {
      post.savedBy.push(user_id);
      await post.save();
    }
    res.send("1");
  } catch (error) {
    res.send("error");
  }
});

router.get("/saved_posts/:limit/:skip", auth, async (req, res) => {
  const limit = parseInt(req.params.limit);
  const skip = parseInt(req.params.skip);
  try {
    const posts = await Post.find({ savedBy: req.user._id })
      .limit(limit)
      .skip(skip)
      .sort({ _id: -1 });

    res.send(posts);
  } catch (error) {
    res.send(error);
  }
});

router.get("/cat_posts/:limit/:skip/:cat", async (req, res) => {
  const limit = parseInt(req.params.limit);
  const skip = parseInt(req.params.skip);
  const cat = req.params.cat;

  try {
    const posts = await Post.find({ tags: cat })
      .limit(limit)
      .skip(skip)
      .sort({ _id: -1 });

    res.send(posts);
  } catch (error) {
    res.send(error);
  }
});

router.get("/posts/:limit/:skip", async (req, res) => {
  const limit = parseInt(req.params.limit);
  const skip = parseInt(req.params.skip);
  try {
    const posts = await Post.find({}).limit(limit).skip(skip).sort({ _id: -1 });

    res.send(posts);
  } catch (error) {
    res.send(error);
  }
});

router.get("/post/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const post = await Post.findOne({ _id });
    if (!post) {
      res.status(404).send();
    }

    res.send(post);
  } catch (error) {
    res.send(error);
  }
});

router.patch("/update/post/:id", async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);

  const post = await Post.findOne({ _id });
  if (!post) {
    res.send(-1);
  }
  updates.forEach((update) => {
    post[update] = req.body[update];
  });

  try {
    await post.save();
    res.send(post);
  } catch (error) {
    res.send(error);
  }
});

router.delete("/post/:id", async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id });
    if (!post) {
      res.status(404).send();
    }

    res.send(post);
  } catch (error) {
    res.send(error);
  }
});

const upload = multer({
  limits: {
    fileSize: 5000000,
  },

  fileFilter(req, file, cb) {
    // if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    //   return new Error("Please provide the right file.");
    // }

    cb(undefined, true);
  },
});

router.post(
  "/upload_img/:id",
  upload.single("image"),
  async (req, res) => {
    const food_img = new Buffer.from(req.file.buffer).toString("base64");
    const _id = req.params.id;

    const post = await Post.findOne({ _id });
    try {
      post.recipeImg = food_img;
      await post.save();

      res.send(post);
    } catch (error) {
      res.send(error);
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;

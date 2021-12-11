## Getting Started

To begin, you'll need to install `fragmentation-files`:

```console
npm install fragmentation-files
```

Then add the plugin to your `node` server. For example(`koa`):

```js
const { Fragmentation } = require("fragmentation-files");
const fragmentation = new Fragmentation();
router.post("/upload", async (ctx, next) => {
  const files = ctx.request.files ? ctx.request.files.f1 : [];
  const { token, index } = ctx.request.body;
  let msg = "ok";
  msg = fragmentation.upload({ token, index, files });
  if (ctx.request.body.type === "merge") {
    const { filename, chunkCount } = ctx.request.body;
    const upLoadFolder = path.resolve(__dirname, "../../static/uploads") + "/";
    const fileFolder = path.resolve(__dirname, "../../static/files") + "/";
    msg = fragmentation.merge({
      token,
      filename,
      chunkCount,
      upLoadFolder,
      fileFolder,
    });
  }
  ctx.body = msg;
});
```

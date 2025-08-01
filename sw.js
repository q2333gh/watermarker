const t = "akarin-watermarker-1663406213972";
(self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(t)
      .then((t) =>
        t.addAll([
          ".",
          "app.js",
          "sample.avif",
          "sample.webp",
          "watermark.webp",
          "icon-256px.png",
          "icon-1024px.png",
          "iconr-256px.png",
          "iconr-1024px.png",
          "https://cdn.jsdelivr.net/npm/mdui@1/dist/css/mdui.min.css",
          "https://cdn.jsdelivr.net/combine/npm/petite-vue@0.4/dist/petite-vue.iife.js,npm/mdui@1/dist/js/mdui.min.js",
          "https://cdn.jsdelivr.net/npm/mdui@1/dist/icons/material-icons/MaterialIcons-Regular.woff2",
          "https://cdn.jsdelivr.net/npm/mdui@1/dist/fonts/roboto/Roboto-Regular.woff2",
          "https://cdn.jsdelivr.net/npm/mdui@1/dist/fonts/roboto/Roboto-RegularItalic.woff2",
          "https://cdn.jsdelivr.net/npm/mdui@1/dist/fonts/roboto/Roboto-Medium.woff2",
        ]),
      ),
  );
}),
  self.addEventListener("activate", (e) => {
    e.waitUntil(
      caches
        .keys()
        .then((e) => Promise.all(e.map((e) => e !== t && caches.delete(e)))),
    );
  }),
  self.addEventListener("fetch", (t) => {
    t.respondWith(caches.match(t.request).then((e) => e || fetch(t.request)));
  }));

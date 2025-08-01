(async () => {
  navigator.serviceWorker &&
    navigator.serviceWorker
      .register("sw.js")
      .then((e) =>
        e.addEventListener("updatefound", () =>
          mdui.snackbar("检测到更新，刷新以应用更改", {
            buttonText: "刷新",
            onButtonClick: () => location.reload(),
          }),
        ),
      );
  let e = !1;
  document.addEventListener("WeixinJSBridgeReady", () => (e = !0));
  const t = (e) =>
      new Promise((t, a) => {
        const i = new Image();
        ((i.onload = () => t(i)), (i.onerror = a), (i.src = e));
      }),
    a = (e) =>
      new Promise((a, i) => {
        const o = new FileReader();
        ((o.onload = (e) =>
          t(URL.createObjectURL(new Blob([e.target.result])))
            .then(a)
            .catch(i)),
          (o.onerror = i),
          o.readAsArrayBuffer(e));
      }),
    i = (e) =>
      new Promise((t, a) => {
        const i = new Image();
        let o;
        ((i.onload = () => {
          (t(i), URL.revokeObjectURL(o));
        }),
          (i.onerror = a),
          e.toBlob((e) => (i.src = o = URL.createObjectURL(e))));
      }),
    o = document.createElement("canvas"),
    n = o.getContext("2d"),
    s = document.createElement("canvas"),
    r = s.getContext("2d"),
    h = document.getElementById("wm-canvas"),
    d = h.getContext("2d");
  PetiteVue.createApp({
    mode: "text",
    bgImage: await t("sample.avif").catch(() => t("sample.webp")),
    wmImage: await t("watermark.webp"),
    wmText:
      "仅用于演示水印功能\n其他用途无效\n" +
      (() => {
        const e = new Date(),
          t = (e) => `${e}`.padStart(2, 0);
        return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())} ${t(e.getHours())}:${t(e.getMinutes())}:${t(e.getSeconds())}`;
      })(),
    wmTextColor: "#ffffff",
    wmTextShadowColor: "#000000",
    fontSize: 24,
    fontWeight: 500,
    useStroke: !1,
    useItalic: !1,
    useShadow: !1,
    useCenter: !0,
    opacity: 75,
    angle: 30,
    scale: 100,
    offsetX: Math.round(100 * Math.random()),
    offsetY: Math.round(100 * Math.random()),
    paddingX: 0,
    paddingY: 0,
    saveFormat: "image/jpeg|.jpg",
    saveQuality: 80,
    bgFileElement: document.getElementById("bg-file"),
    wmFileElement: document.getElementById("wm-file"),
    wmTextColorElement: document.getElementById("wm-textcolor"),
    wmTextShadowColorElement: document.getElementById("wm-textshadowcolor"),
    mounted() {
      (mdui.updateSliders(),
        this.render(),
        addEventListener("drop", (e) => {
          (e.preventDefault(), e.stopPropagation());
          const t = Array.from(e.dataTransfer.files).find((e) =>
            e.type.startsWith("image/"),
          );
          t && this.bgFileChange({ target: { files: [t] } });
        }));
    },
    wmTextChange() {
      mdui.prompt(
        "",
        "水印文字",
        (e) => {
          ((this.wmText = e), "text" === this.mode && this.render());
        },
        () => {},
        { type: "textarea", defaultValue: this.wmText },
      );
    },
    async bgFileChange(e) {
      ((this.bgImage = await a(e.target.files[0])), this.render());
    },
    async wmFileChange(e) {
      ((this.wmImage = await a(e.target.files[0])),
        "image" === this.mode && this.render());
    },
    async render() {
      (async (e, t, a, s, r, l, m, c, g) => {
        ((h.width = e.width),
          (h.height = e.height),
          d.drawImage(e, 0, 0),
          (d.globalAlpha = a),
          s &&
            (t = await ((e, t) => (
              (o.width =
                e.width * Math.abs(Math.cos(t)) +
                e.height * Math.abs(Math.sin(t))),
              (o.height =
                e.width * Math.abs(Math.sin(t)) +
                e.height * Math.abs(Math.cos(t))),
              n.clearRect(0, 0, o.width, o.height),
              n.save(),
              n.translate(o.width / 2, o.height / 2),
              n.rotate(t),
              n.drawImage(e, -e.width / 2, -e.height / 2),
              n.restore(),
              i(o)
            ))(t, s)));
        for (let e = t.width * r; e < h.width; e += t.width * (g + m))
          for (let a = t.height * l; a < h.height; a += t.height * (g + c))
            d.drawImage(t, e, a, t.width * g, t.height * g);
      })(
        this.bgImage,
        "text" === this.mode
          ? await ((e, t, a, o, n, h, d = !1, l = !1, m = "") => {
              r.font = `${m} ${a}pt "${t}"`;
              const c = e.split("\n"),
                g = c.map((e) => r.measureText(e).width);
              ((s.width = Math.max(...g) + 1.5 * n),
                (s.height = (c.length + 0.25) * a * 1.5 + 1.5 * n),
                r.clearRect(0, 0, s.width, s.height),
                (r.font = `${m} ${a}pt "${t}"`),
                (r.fillStyle = o),
                (r.strokeStyle = o),
                (r.shadowColor = h),
                (r.shadowBlur = n));
              for (let e = 0; e < c.length; e++)
                for (let t = 0; t < (n ? (l ? 4 : 2) : 1); t++)
                  (l ? r.strokeText : r.fillText).call(
                    r,
                    c[e],
                    d ? (s.width - g[e]) / 2 : 0.75 * n,
                    (e + 1) * a * 1.5 + 0.75 * n,
                  );
              return i(s);
            })(
              this.wmText,
              "sans-serif",
              this.fontSize,
              this.wmTextColor,
              this.useShadow && this.fontSize / 1.5,
              this.wmTextShadowColor,
              this.useCenter,
              this.useStroke,
              [this.useItalic ? "italic" : "", this.fontWeight].join(" "),
            )
          : this.wmImage,
        this.opacity / 100,
        (this.angle * Math.PI) / 180,
        -this.offsetX / 100,
        -this.offsetY / 100,
        this.paddingX / 100,
        this.paddingY / 100,
        this.scale / 100,
      );
    },
    saveResult() {
      const [a, i] = this.saveFormat.split("|");
      if (e) {
        const e = h.toDataURL(a, this.saveQuality / 100);
        t(e).then(() =>
          mdui.alert(
            `<img src="${e}" class="mdui-center mdui-img-fluid mdui-img-rounded"><div class="mdui-typo-caption-opacity mdui-m-t-2 mdui-text-center">请长按图片进行另存为操作</div>`,
            "保存图片",
          ),
        );
      } else
        h.toBlob(
          (e) => {
            const t = URL.createObjectURL(e),
              a = document.createElement("a");
            ((a.href = t),
              (a.download =
                Array(16)
                  .fill()
                  .map(
                    () =>
                      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"[
                        Math.floor(62 * Math.random())
                      ],
                  )
                  .join("") + i),
              document.body.appendChild(a),
              a.click(),
              document.body.removeChild(a),
              URL.revokeObjectURL(t));
          },
          a,
          this.saveQuality / 100,
        );
    },
  }).mount();
})();

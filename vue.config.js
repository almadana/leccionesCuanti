module.exports = {
  publicPath: "/",
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/variables.scss";`
      }
    }
  }
}

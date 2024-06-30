module.exports = {
  content: ["./index.html", "./src/**/*.{gleam,mjs}"],
  theme: {
    colors: ({ colors }) => ({
      primary: colors.blue['100'],
      ...colors,
    }),
    extend: {},
  },
  plugins: [],
}

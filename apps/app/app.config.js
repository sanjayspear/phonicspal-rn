// Dynamic wrapper around app.json: only adds experiments.baseUrl when
// WEB_BASE_PATH is set (the GitHub Pages deploy workflow sets it to
// "/phonicspal-rn", matching the repo-name subpath Pages serves project
// sites from — see .github/workflows/deploy-pages.yml). Scoped to an env
// var rather than baked into app.json directly because
// experiments.baseUrl isn't web-specific in Metro's config resolution —
// setting it unconditionally would also prefix native (iOS/Android)
// bundle asset paths, which don't need or want it. Local dev
// (`npm run app:web`, `app:ios`, `app:android`) never sets this var, so
// behavior there is unchanged.
module.exports = ({ config }) => {
  if (process.env.WEB_BASE_PATH) {
    config.experiments = {
      ...config.experiments,
      baseUrl: process.env.WEB_BASE_PATH,
    };
  }
  return config;
};

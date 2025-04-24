module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": () => {
      const scopes = ["api", "backend", "frontend"];
      //we can use this when we work with microservices or when we have frontend and backend in one git repository
      //To activate scope-enum just switch 0 to 2
      return [0, "always", scopes];
    },
    "type-enum": () => {
      const types = [
        "build",
        "chore",
        "ci",
        "docs",
        "feature",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ];
      return [2, "always", types];
    },
    "header-max-length": () => [2, "always", 100],
    "type-case": () => [2, "always", "lower-case"],
  },
};

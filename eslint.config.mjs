import nextCore from "eslint-config-next/core-web-vitals";

const config = [
  { ignores: [".next/**", "node_modules/**", "out/**"] },
  ...nextCore,
  {
    files: ["src/components/sections/**/*.{tsx,jsx}", "src/components/layout/SiteHeader.tsx"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;

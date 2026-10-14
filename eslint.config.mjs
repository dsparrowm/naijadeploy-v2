import nextConfig from "eslint-config-next"

const eslintConfig = [
  ...nextConfig,
  {
    // These files predate react-hooks v7 purity / set-state rules.
    files: [
      "app/(flow)/checkout/page.tsx",
      "app/(flow)/payment/success/page.tsx",
      "components/_quarantine/**",
      "components/ui/carousel.tsx",
      "components/ui/sidebar.tsx",
      "components/ui/use-mobile.tsx",
      "hooks/use-mobile.ts",
    ],
    rules: {
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
]

export default eslintConfig

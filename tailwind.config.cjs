/** @type {import('tailwindcss').Config}*/
const config = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    require('path').join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
    )
  ],

  theme: {
    extend: {},
  },

  plugins: [
    // 3. Append the Skeleton plugin to the end of this list
		...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()
  ],
};

module.exports = config;

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    theme: {
      extend: {
        fontFamily: {
          montserrat: ['Montserrat', 'sans-serif'],
          sora: ['Sora', 'sans-serif'],
          'playwrite-vn': ['Playwrite VN Guides', 'cursive'],
        },
        keyframes: {
          laser: {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(200%)' },
          }
        },
        animation: {
          'laser': 'laser 3s linear infinite',
        }
      }
    }
  },
  plugins: [],
};

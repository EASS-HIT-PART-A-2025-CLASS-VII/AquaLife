import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,tsx}",
		"./src/components/**/*.{js,ts,tsx}",
		"./src/app/**/*.{js,ts,tsx}",
		"./src/**/*.{js,ts,tsx}",
	  ],

	  safelist: [
		'animate-bubble-rise',
		'animate-float-up-down',
		'animate-swim-left-right',
		'animate-swim-right-left',
		'animation-duration-[8s]',
		'animation-duration-[10s]',
		'animation-duration-[15s]',
		'animation-duration-[25s]',
	  ],
	
	  
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				marine: {
					light: '#0EA5E9',
					DEFAULT: '#0284C7',
					dark: '#0C4A6E',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			animationDuration: {
				'8s': '8s',
				'10s': '10s',
				'15s': '15s',
				'25s': '25s',
			  },
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'swim-left-right': {
					'0%, 100%': {
						transform: 'translateX(0) scaleX(1)'
					},
					'50%': {
						transform: 'translateX(100px) scaleX(1)'
					},
					'51%': {
						transform: 'translateX(100px) scaleX(-1)'
					},
					'99%': {
						transform: 'translateX(0) scaleX(-1)'
					},
				},
				'swim-right-left': {
					'0%, 100%': {
						transform: 'translateX(0) scaleX(-1)'
					},
					'50%': {
						transform: 'translateX(-100px) scaleX(-1)'
					},
					'51%': {
						transform: 'translateX(-100px) scaleX(1)'
					},
					'99%': {
						transform: 'translateX(0) scaleX(1)'
					},
				},
				'float-up-down': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-20px)'
					}
				},
				'bubble-rise': {
					'0%': {
						transform: 'translateY(100vh) scale(0)',
						opacity: '0'
					},
					'50%': {
						opacity: '0.8'
					},
					'100%': {
						transform: 'translateY(-20vh) scale(1.5)',
						opacity: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'swim-left-right': 'swim-left-right 15s infinite ease-in-out',
				'swim-right-left': 'swim-right-left 20s infinite ease-in-out',
				'float-up-down': 'float-up-down 8s infinite ease-in-out',
				'bubble-rise': 'bubble-rise 15s infinite ease-in-out',
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;

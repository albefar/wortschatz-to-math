import { type SVGProps } from 'react'

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle 
        cx="250" 
        cy="250" 
        r="200" 
        className="stroke-current" 
        strokeWidth="40" 
        strokeDasharray="30 15"
      />
      <path
        d="M200 180 L300 180 L250 140 Z"
        className="fill-current"
      />
      <path
        d="M180 220 L320 220 Q330 220 330 230 L330 340 Q330 350 320 350 L180 350 Q170 350 170 340 L170 230 Q170 220 180 220 Z"
        className="fill-current"
      />
      <path
        d="M210 260 L290 260 M210 300 L270 300"
        className="stroke-white dark:stroke-gray-900"
        strokeWidth="20"
        strokeLinecap="round"
      />
    </svg>
  )
}
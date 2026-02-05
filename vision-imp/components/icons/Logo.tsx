import React from 'react';

const Logo = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 100" 
        className={className} 
        fill="currentColor"
    >
        <defs>
            <filter id="vision-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        <style>
            {`
                .logo-sparkle {
                    transform-origin: center;
                    animation: sparkle-anim 4s ease-in-out infinite;
                    opacity: 0;
                }
                .logo-main {
                     transform-origin: 50% 80%;
                     animation: feather-sway 8s ease-in-out infinite alternate;
                }
                @keyframes sparkle-anim {
                    0%, 100% { transform: scale(0.6) rotate(-10deg); opacity: 0.3; }
                    50% { transform: scale(1.1) rotate(10deg); opacity: 1; }
                    75% { transform: scale(0.6) rotate(20deg); opacity: 0.3; }
                }
                @keyframes feather-sway {
                    from { transform: rotate(-2.5deg); }
                    to { transform: rotate(2.5deg); }
                }
            `}
        </style>

        <g filter="url(#vision-glow)" className="opacity-95">
            
            <g className="logo-main">
                {/* Swirls */}
                <path 
                    d="M14.6,76.5c22.5,13.2,50,9.9,68-6.1"
                    fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round"
                />
                 <path 
                    d="M27.6,84.5c18.5,8.2,39.5,6.9,55-3.1"
                    fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round"
                />

                {/* Feather */}
                <path d="M48.2,16.2c-2.4,12.9,0.3,26,7.5,37.3c1,1.6,2.2,3.1,3.4,4.5c-4.4-1.9-8.4-4.8-11.6-8.5 c-9.9-11.2-13-27.1-8.5-41.9C36.9,11.8,43.3,12.3,48.2,16.2z M41.8,61.1c2.8,4.7,6.5,8.8,10.8,12.2c3.4,2.7,7.2,4.8,11.2,6.2 c-1.2-5.4-1.2-11,0.2-16.4c1.8-7.1,5.1-13.6,9.6-19.4c0.8-1,1.7-2,2.6-2.9c-10,9.1-19.2,20.4-25.2,33 C49.2,74,45,68.4,41.8,61.1z"/>
            </g>

            {/* Sparkles (4-pointed thin diamonds) */}
            <path d="M70,23 L73,20 L76,23 L73,26 Z" className="logo-sparkle" style={{animationDelay: '0.5s'}}/>
            <path d="M33,31 L35,29 L37,31 L35,33 Z" className="logo-sparkle" style={{animationDelay: '0s'}}/>
            <path d="M29,55 L31,53 L33,55 L31,57 Z" className="logo-sparkle" style={{animationDelay: '1s'}}/>
        </g>
    </svg>
);

export default Logo;

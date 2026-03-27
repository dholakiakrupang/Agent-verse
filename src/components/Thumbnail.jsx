import React from 'react';
import Logo from './Logo';

export default function Thumbnail() {
  return (
    <div style={{
      position: 'relative',
      width: '1200px',
      height: '900px',
      background: '#07F258',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Background SVG Pattern */}
      <svg 
        style={{ position: 'absolute', top: 0, left: 0 }} 
        width="1200" 
        height="900" 
        viewBox="0 0 1200 900" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.015">
          <path fillRule="evenodd" clipRule="evenodd" d="M266.015 1044.27L581.94 488.243L897.867 1044.27C799.651 971.593 539.446 869.842 266.015 1044.27ZM581.941 682.451L468.207 872.007C468.207 872.007 506.118 846.732 581.941 846.732C657.763 846.732 695.674 872.007 695.674 872.007L581.941 682.451Z" fill="#062617"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M266.015 -143.612L581.94 412.418L897.867 -143.612C799.651 -70.9326 539.446 30.8185 266.015 -143.612ZM581.941 218.208L468.207 28.6523C468.207 28.6523 506.118 53.9264 581.941 53.9264C657.763 53.9264 695.674 28.6523 695.674 28.6523L581.941 218.208Z" fill="#062617"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M1204.82 134.404L648.795 450.33L1204.82 766.256C1132.14 668.041 1030.39 407.836 1204.82 134.404ZM842.992 450.331L1032.55 336.598C1032.55 336.598 1007.27 374.509 1007.27 450.331C1007.27 526.154 1032.55 564.065 1032.55 564.065L842.992 450.331Z" fill="#062617"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M-37.2732 134.404L518.756 450.33L-37.2732 766.256C35.4062 668.041 137.157 407.836 -37.2732 134.404ZM324.556 450.331L135 336.598C135 336.598 160.274 374.509 160.274 450.331C160.274 526.154 135 564.065 135 564.065L324.556 450.331Z" fill="#062617"/>
        </g>
      </svg>
      
      {/* Foreground Main Logo */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Logo />
      </div>
    </div>
  );
}

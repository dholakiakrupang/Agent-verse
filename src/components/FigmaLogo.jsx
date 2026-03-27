import React from 'react';
import './FigmaLogo.css';

export default function FigmaLogo({ scale = 1 }) {
  // Using scale to resize the 1200x900 thumbnail if used elsewhere
  return (
    <div 
      className="logo-thumbnail" 
      style={{ transform: `scale(${scale})`, width: 1200, height: 900 }}
    >
      {/* Background Frame 9 Opacity 0.01 */}
      <div style={{
        position: 'absolute', width: 1274.27, height: 1187.88, opacity: 0.01,
        left: 'calc(50% - 1274.27px/2 - 0.14px)', top: 'calc(50% - 1187.88px/2 + 0.33px)'
      }}>
        {/* We can omit the 12 background vectors for brevity or add them as divs */}
        {/* ... */}
      </div>

      <div className="logo-frame-15">
        
        {/* Icon Frame */}
        <div className="logo-frame-9">
          <div className="vector-node subtract-1"></div>
          <div className="vector-node vector-19-1"></div>
          <div className="vector-node vector-20-1"></div>

          <div className="vector-node subtract-2"></div>
          <div className="vector-node vector-19-2"></div>
          <div className="vector-node vector-20-2"></div>

          <div className="vector-node subtract-3"></div>
          <div className="vector-node vector-19-3"></div>
          <div className="vector-node vector-20-3"></div>

          <div className="vector-node subtract-4"></div>
          <div className="vector-node vector-19-4"></div>
          <div className="vector-node vector-20-4"></div>
        </div>

        {/* Text Area */}
        <div className="agentverse-text">
          {/* Agentverse Vector characters using absolute box positioning from your provided CSS */}
          <div className="vector-node" style={{width: 42.85, height: 66.95, left: 774.31 - 404.18, top: 51.52 - 50.57, background: '#003700'}}></div>
          <div className="vector-node" style={{width: 50.22, height: 68.87, left: 713.95 - 404.18, top: 50.57 - 50.57, background: '#003700'}}></div>
          <div className="vector-node" style={{width: 51.65, height: 66.95, left: 655.97 - 404.18, top: 51.52 - 50.57, background: '#003700'}}></div>
          <div className="vector-node" style={{width: 42.85, height: 66.95, left: 603.19 - 404.18, top: 51.52 - 50.57, background: '#003700'}}></div>
          <div className="vector-node" style={{width: 64.85, height: 66.95, left: 531.81 - 404.18, top: 51.52 - 50.57, background: '#003700'}}></div>
          <div className="vector-node" style={{width: 53.75, height: 66.95, left: 475.21 - 404.18, top: 51.52 - 50.57, background: '#003700'}}></div>
          <div className="vector-node" style={{width: 58.15, height: 66.95, left: 410.5 - 404.18, top: 51.52 - 50.57, background: '#003700'}}></div>
          <div className="vector-node" style={{width: 42.85, height: 66.95, left: 357.72 - 404.18, top: 51.52 - 50.57, background: '#003700'}}></div>
          <div className="vector-node" style={{width: 69.11, height: 68.87, left: 279.22 - 404.18, top: 50.57 - 50.57, background: '#003700'}}></div>
          <div className="vector-node" style={{width: 67.72, height: 66.95, left: 212.36 - 404.18, top: 51.52 - 50.57, background: '#003700'}}></div>
        </div>

      </div>
    </div>
  );
}

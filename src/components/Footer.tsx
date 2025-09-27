// src/components/layout/Footer.tsx
import React from "react";

const Footer: React.FC = () => (
    <footer style={{
        padding: '20px',
        textAlign: 'center',
        color: '#6b7280',
        borderTop: '1px solid #e5e7eb',
        marginTop: '40px',
        fontSize: '0.9rem'
    }}>
        <p>
            &copy; 2025 🗳️ Pollify -
            <span style={{
                display: 'inline-block',
                padding: '2px 8px',
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                borderRadius: '12px',
                fontSize: '0.8rem',
                marginLeft: '8px'
            }}>
                PWA Ready
            </span>
        </p>
        <p style={{ marginTop: '8px', fontSize: '0.8rem' }}>
            Works offline • Fast loading • Installable
        </p>
        
    </footer>
);

export default Footer;
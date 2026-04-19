'use client';

import { useState, useEffect } from 'react';

export default function BrandSystemFlow() {
    const [activeOutput, setActiveOutput] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);

    const outputs = [
        { id: 'website', label: 'Website' },
        { id: 'blog', label: 'Blog' },
        { id: 'social', label: 'Social Media' },
        { id: 'onesheet', label: 'One Sheeter' },
        { id: 'slides', label: 'Slide Show' },
    ];

    useEffect(() => {
        if (!isAnimating) return;

        const interval = setInterval(() => {
            setActiveOutput((prev) => (prev + 1) % outputs.length);
        }, 2500);

        return () => clearInterval(interval);
    }, [isAnimating, outputs.length]);

    // Render different output mockups based on type - Desktop version (positioned for horizontal layout)
    const renderOutputDesktop = (type: string, isActive: boolean) => {
        const opacity = isActive ? 1 : 0;
        const style = { transition: 'opacity 0.5s ease-in-out' };

        switch (type) {
            case 'website':
                return (
                    <g opacity={opacity} style={style}>
                        <rect x="710" y="100" width="160" height="100" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="1" />
                        <rect x="710" y="100" width="160" height="12" fill="var(--card-border)" />
                        <circle cx="718" cy="106" r="2" fill="var(--muted)" />
                        <circle cx="726" cy="106" r="2" fill="var(--muted)" />
                        <circle cx="734" cy="106" r="2" fill="var(--muted)" />
                        <polygon points="720,122 726,132 714,132" fill="none" stroke="var(--accent)" strokeWidth="1" />
                        <rect x="730" y="124" width="24" height="4" fill="var(--foreground)" />
                        <rect x="820" y="124" width="12" height="3" fill="var(--muted)" opacity="0.5" />
                        <rect x="836" y="124" width="12" height="3" fill="var(--muted)" opacity="0.5" />
                        <rect x="852" y="124" width="12" height="3" fill="var(--muted)" opacity="0.5" />
                        <rect x="720" y="145" width="80" height="6" fill="var(--foreground)" />
                        <rect x="720" y="155" width="60" height="4" fill="var(--muted)" opacity="0.4" />
                        <rect x="720" y="165" width="32" height="10" fill="var(--accent)" />
                        <rect x="720" y="182" width="40" height="12" fill="none" stroke="var(--card-border)" strokeWidth="0.5" />
                        <rect x="764" y="182" width="40" height="12" fill="none" stroke="var(--card-border)" strokeWidth="0.5" />
                        <rect x="808" y="182" width="40" height="12" fill="none" stroke="var(--card-border)" strokeWidth="0.5" />
                        <text x="790" y="230" fill="var(--foreground)" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Website</text>
                        <text x="790" y="244" fill="var(--muted)" fontSize="8" fontFamily="monospace" textAnchor="middle">16:9 Landscape</text>
                    </g>
                );

            case 'blog':
                return (
                    <g opacity={opacity} style={style}>
                        <rect x="730" y="95" width="120" height="150" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="1" />
                        <rect x="738" y="103" width="104" height="40" fill="var(--muted)" opacity="0.2" />
                        <polygon points="746,112 752,122 740,122" fill="none" stroke="var(--accent)" strokeWidth="1" />
                        <rect x="738" y="150" width="90" height="6" fill="var(--foreground)" />
                        <rect x="738" y="160" width="70" height="4" fill="var(--muted)" opacity="0.5" />
                        <rect x="738" y="175" width="104" height="3" fill="var(--muted)" opacity="0.3" />
                        <rect x="738" y="182" width="100" height="3" fill="var(--muted)" opacity="0.3" />
                        <rect x="738" y="189" width="90" height="3" fill="var(--muted)" opacity="0.3" />
                        <rect x="738" y="196" width="104" height="3" fill="var(--muted)" opacity="0.3" />
                        <rect x="738" y="203" width="80" height="3" fill="var(--muted)" opacity="0.3" />
                        <rect x="738" y="215" width="3" height="20" fill="var(--accent)" />
                        <rect x="746" y="218" width="80" height="4" fill="var(--foreground)" opacity="0.7" />
                        <rect x="746" y="226" width="60" height="4" fill="var(--foreground)" opacity="0.7" />
                        <text x="790" y="264" fill="var(--foreground)" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Blog</text>
                        <text x="790" y="278" fill="var(--muted)" fontSize="8" fontFamily="monospace" textAnchor="middle">Article Format</text>
                    </g>
                );

            case 'social':
                return (
                    <g opacity={opacity} style={style}>
                        <rect x="720" y="95" width="140" height="140" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="1" />
                        <rect x="720" y="95" width="140" height="50" fill="var(--accent)" opacity="0.1" />
                        <polygon points="790,115 810,150 770,150" fill="none" stroke="var(--accent)" strokeWidth="2" />
                        <rect x="740" y="165" width="100" height="8" fill="var(--foreground)" />
                        <rect x="750" y="178" width="80" height="5" fill="var(--muted)" opacity="0.5" />
                        <rect x="745" y="200" width="28" height="12" fill="none" stroke="var(--accent)" strokeWidth="1" />
                        <rect x="778" y="200" width="28" height="12" fill="none" stroke="var(--accent)" strokeWidth="1" />
                        <rect x="811" y="200" width="28" height="12" fill="none" stroke="var(--card-border)" strokeWidth="1" />
                        <text x="790" y="256" fill="var(--foreground)" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Social Media</text>
                        <text x="790" y="270" fill="var(--muted)" fontSize="8" fontFamily="monospace" textAnchor="middle">1:1 Square</text>
                    </g>
                );

            case 'onesheet':
                return (
                    <g opacity={opacity} style={style}>
                        <rect x="740" y="90" width="100" height="140" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="1" />
                        <polygon points="752,105 760,118 744,118" fill="none" stroke="var(--accent)" strokeWidth="1" />
                        <rect x="765" y="108" width="40" height="5" fill="var(--foreground)" />
                        <rect x="750" y="130" width="80" height="6" fill="var(--foreground)" />
                        <text x="752" y="152" fill="var(--accent)" fontSize="7" fontFamily="monospace">01</text>
                        <rect x="765" y="146" width="65" height="4" fill="var(--muted)" opacity="0.5" />
                        <text x="752" y="166" fill="var(--accent)" fontSize="7" fontFamily="monospace">02</text>
                        <rect x="765" y="160" width="55" height="4" fill="var(--muted)" opacity="0.5" />
                        <text x="752" y="180" fill="var(--accent)" fontSize="7" fontFamily="monospace">03</text>
                        <rect x="765" y="174" width="60" height="4" fill="var(--muted)" opacity="0.5" />
                        <rect x="760" y="195" width="60" height="14" fill="var(--accent)" />
                        <rect x="750" y="218" width="80" height="3" fill="var(--muted)" opacity="0.3" />
                        <text x="790" y="252" fill="var(--foreground)" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">One Sheeter</text>
                        <text x="790" y="266" fill="var(--muted)" fontSize="8" fontFamily="monospace" textAnchor="middle">8.5x11 Portrait</text>
                    </g>
                );

            case 'slides':
                return (
                    <g opacity={opacity} style={style}>
                        <rect x="705" y="110" width="170" height="96" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="1" />
                        <rect x="715" y="125" width="70" height="8" fill="var(--foreground)" />
                        <rect x="715" y="138" width="60" height="4" fill="var(--muted)" opacity="0.4" />
                        <rect x="715" y="148" width="65" height="4" fill="var(--muted)" opacity="0.4" />
                        <circle cx="720" cy="165" r="2" fill="var(--accent)" />
                        <rect x="728" y="163" width="50" height="3" fill="var(--muted)" opacity="0.5" />
                        <circle cx="720" cy="175" r="2" fill="var(--accent)" />
                        <rect x="728" y="173" width="45" height="3" fill="var(--muted)" opacity="0.5" />
                        <circle cx="720" cy="185" r="2" fill="var(--accent)" />
                        <rect x="728" y="183" width="55" height="3" fill="var(--muted)" opacity="0.5" />
                        <rect x="795" y="120" width="70" height="76" fill="var(--muted)" opacity="0.1" />
                        <polygon points="830,145 850,175 810,175" fill="none" stroke="var(--accent)" strokeWidth="2" />
                        <text x="860" y="200" fill="var(--muted)" fontSize="7" fontFamily="monospace">01</text>
                        <text x="790" y="232" fill="var(--foreground)" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Slide Show</text>
                        <text x="790" y="246" fill="var(--muted)" fontSize="8" fontFamily="monospace" textAnchor="middle">16:9 Wide</text>
                    </g>
                );

            default:
                return null;
        }
    };

    // Render output for mobile (centered in its container)
    const renderOutputMobile = (type: string, isActive: boolean) => {
        const opacity = isActive ? 1 : 0;
        const style = { transition: 'opacity 0.5s ease-in-out' };

        switch (type) {
            case 'website':
                return (
                    <g opacity={opacity} style={style}>
                        <rect x="60" y="60" width="160" height="100" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="1" />
                        <rect x="60" y="60" width="160" height="12" fill="var(--card-border)" />
                        <circle cx="68" cy="66" r="2" fill="var(--muted)" />
                        <circle cx="76" cy="66" r="2" fill="var(--muted)" />
                        <circle cx="84" cy="66" r="2" fill="var(--muted)" />
                        <polygon points="70,82 76,92 64,92" fill="none" stroke="var(--accent)" strokeWidth="1" />
                        <rect x="80" y="84" width="24" height="4" fill="var(--foreground)" />
                        <rect x="170" y="84" width="12" height="3" fill="var(--muted)" opacity="0.5" />
                        <rect x="186" y="84" width="12" height="3" fill="var(--muted)" opacity="0.5" />
                        <rect x="202" y="84" width="12" height="3" fill="var(--muted)" opacity="0.5" />
                        <rect x="70" y="105" width="80" height="6" fill="var(--foreground)" />
                        <rect x="70" y="115" width="60" height="4" fill="var(--muted)" opacity="0.4" />
                        <rect x="70" y="125" width="32" height="10" fill="var(--accent)" />
                        <rect x="70" y="142" width="40" height="12" fill="none" stroke="var(--card-border)" strokeWidth="0.5" />
                        <rect x="114" y="142" width="40" height="12" fill="none" stroke="var(--card-border)" strokeWidth="0.5" />
                        <rect x="158" y="142" width="40" height="12" fill="none" stroke="var(--card-border)" strokeWidth="0.5" />
                        <text x="140" y="185" fill="var(--foreground)" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Website</text>
                        <text x="140" y="199" fill="var(--muted)" fontSize="8" fontFamily="monospace" textAnchor="middle">16:9 Landscape</text>
                    </g>
                );

            case 'blog':
                return (
                    <g opacity={opacity} style={style}>
                        <rect x="80" y="55" width="120" height="150" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="1" />
                        <rect x="88" y="63" width="104" height="40" fill="var(--muted)" opacity="0.2" />
                        <polygon points="96,72 102,82 90,82" fill="none" stroke="var(--accent)" strokeWidth="1" />
                        <rect x="88" y="110" width="90" height="6" fill="var(--foreground)" />
                        <rect x="88" y="120" width="70" height="4" fill="var(--muted)" opacity="0.5" />
                        <rect x="88" y="135" width="104" height="3" fill="var(--muted)" opacity="0.3" />
                        <rect x="88" y="142" width="100" height="3" fill="var(--muted)" opacity="0.3" />
                        <rect x="88" y="149" width="90" height="3" fill="var(--muted)" opacity="0.3" />
                        <rect x="88" y="156" width="104" height="3" fill="var(--muted)" opacity="0.3" />
                        <rect x="88" y="163" width="80" height="3" fill="var(--muted)" opacity="0.3" />
                        <rect x="88" y="175" width="3" height="20" fill="var(--accent)" />
                        <rect x="96" y="178" width="80" height="4" fill="var(--foreground)" opacity="0.7" />
                        <rect x="96" y="186" width="60" height="4" fill="var(--foreground)" opacity="0.7" />
                        <text x="140" y="222" fill="var(--foreground)" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Blog</text>
                        <text x="140" y="236" fill="var(--muted)" fontSize="8" fontFamily="monospace" textAnchor="middle">Article Format</text>
                    </g>
                );

            case 'social':
                return (
                    <g opacity={opacity} style={style}>
                        <rect x="70" y="55" width="140" height="140" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="1" />
                        <rect x="70" y="55" width="140" height="50" fill="var(--accent)" opacity="0.1" />
                        <polygon points="140,75 160,110 120,110" fill="none" stroke="var(--accent)" strokeWidth="2" />
                        <rect x="90" y="125" width="100" height="8" fill="var(--foreground)" />
                        <rect x="100" y="138" width="80" height="5" fill="var(--muted)" opacity="0.5" />
                        <rect x="95" y="160" width="28" height="12" fill="none" stroke="var(--accent)" strokeWidth="1" />
                        <rect x="128" y="160" width="28" height="12" fill="none" stroke="var(--accent)" strokeWidth="1" />
                        <rect x="161" y="160" width="28" height="12" fill="none" stroke="var(--card-border)" strokeWidth="1" />
                        <text x="140" y="212" fill="var(--foreground)" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Social Media</text>
                        <text x="140" y="226" fill="var(--muted)" fontSize="8" fontFamily="monospace" textAnchor="middle">1:1 Square</text>
                    </g>
                );

            case 'onesheet':
                return (
                    <g opacity={opacity} style={style}>
                        <rect x="90" y="50" width="100" height="140" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="1" />
                        <polygon points="102,65 110,78 94,78" fill="none" stroke="var(--accent)" strokeWidth="1" />
                        <rect x="115" y="68" width="40" height="5" fill="var(--foreground)" />
                        <rect x="100" y="90" width="80" height="6" fill="var(--foreground)" />
                        <text x="102" y="112" fill="var(--accent)" fontSize="7" fontFamily="monospace">01</text>
                        <rect x="115" y="106" width="65" height="4" fill="var(--muted)" opacity="0.5" />
                        <text x="102" y="126" fill="var(--accent)" fontSize="7" fontFamily="monospace">02</text>
                        <rect x="115" y="120" width="55" height="4" fill="var(--muted)" opacity="0.5" />
                        <text x="102" y="140" fill="var(--accent)" fontSize="7" fontFamily="monospace">03</text>
                        <rect x="115" y="134" width="60" height="4" fill="var(--muted)" opacity="0.5" />
                        <rect x="110" y="155" width="60" height="14" fill="var(--accent)" />
                        <rect x="100" y="178" width="80" height="3" fill="var(--muted)" opacity="0.3" />
                        <text x="140" y="210" fill="var(--foreground)" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">One Sheeter</text>
                        <text x="140" y="224" fill="var(--muted)" fontSize="8" fontFamily="monospace" textAnchor="middle">8.5x11 Portrait</text>
                    </g>
                );

            case 'slides':
                return (
                    <g opacity={opacity} style={style}>
                        <rect x="55" y="70" width="170" height="96" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="1" />
                        <rect x="65" y="85" width="70" height="8" fill="var(--foreground)" />
                        <rect x="65" y="98" width="60" height="4" fill="var(--muted)" opacity="0.4" />
                        <rect x="65" y="108" width="65" height="4" fill="var(--muted)" opacity="0.4" />
                        <circle cx="70" cy="125" r="2" fill="var(--accent)" />
                        <rect x="78" y="123" width="50" height="3" fill="var(--muted)" opacity="0.5" />
                        <circle cx="70" cy="135" r="2" fill="var(--accent)" />
                        <rect x="78" y="133" width="45" height="3" fill="var(--muted)" opacity="0.5" />
                        <circle cx="70" cy="145" r="2" fill="var(--accent)" />
                        <rect x="78" y="143" width="55" height="3" fill="var(--muted)" opacity="0.5" />
                        <rect x="145" y="80" width="70" height="76" fill="var(--muted)" opacity="0.1" />
                        <polygon points="180,105 200,135 160,135" fill="none" stroke="var(--accent)" strokeWidth="2" />
                        <text x="210" y="160" fill="var(--muted)" fontSize="7" fontFamily="monospace">01</text>
                        <text x="140" y="188" fill="var(--foreground)" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Slide Show</text>
                        <text x="140" y="202" fill="var(--muted)" fontSize="8" fontFamily="monospace" textAnchor="middle">16:9 Wide</text>
                    </g>
                );

            default:
                return null;
        }
    };

    return (
        <div className="w-full py-8 md:py-12">
            {/* Desktop SVG - horizontal layout */}
            <div className="hidden md:block px-8 lg:px-12">
                <svg
                    viewBox="0 0 900 320"
                    className="w-full h-auto"
                    xmlns="http://www.w3.org/2000/svg"
                >
                {/* 01 Basic Styles */}
                <g>
                    <rect x="20" y="40" width="180" height="240" fill="var(--background)" stroke="var(--card-border)" strokeWidth="1" />
                    <text x="36" y="68" fill="var(--muted)" fontSize="9" fontFamily="monospace" letterSpacing="0.15em">01 BASIC STYLES</text>
                    <line x1="36" y1="80" x2="184" y2="80" stroke="var(--card-border)" strokeWidth="1" />
                    <text x="36" y="100" fill="var(--muted)" fontSize="8" fontFamily="monospace">Logo</text>
                    <polygon points="70,130 90,160 50,160" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
                    <rect x="100" y="138" width="60" height="6" fill="var(--foreground)" />
                    <rect x="100" y="148" width="40" height="4" fill="var(--muted)" opacity="0.4" />
                    <text x="36" y="188" fill="var(--muted)" fontSize="8" fontFamily="monospace">Colors</text>
                    <rect x="36" y="198" width="32" height="32" fill="var(--foreground)" />
                    <rect x="72" y="198" width="32" height="32" fill="var(--accent)" />
                    <rect x="108" y="198" width="32" height="32" fill="var(--muted)" />
                    <rect x="144" y="198" width="32" height="32" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="1" />
                    <text x="36" y="252" fill="var(--muted)" fontSize="8" fontFamily="monospace">Type</text>
                    <text x="70" y="254" fill="var(--foreground)" fontSize="14" fontWeight="bold" fontFamily="system-ui">Aa</text>
                    <text x="95" y="254" fill="var(--foreground)" fontSize="10" fontFamily="monospace">Aa</text>
                </g>

                {/* 02 Components */}
                <g>
                    <rect x="220" y="40" width="180" height="240" fill="var(--background)" stroke="var(--card-border)" strokeWidth="1" />
                    <text x="236" y="68" fill="var(--muted)" fontSize="9" fontFamily="monospace" letterSpacing="0.15em">02 COMPONENTS</text>
                    <line x1="236" y1="80" x2="384" y2="80" stroke="var(--card-border)" strokeWidth="1" />
                    <text x="236" y="100" fill="var(--muted)" fontSize="8" fontFamily="monospace">Buttons</text>
                    <rect x="236" y="110" width="56" height="20" fill="var(--accent)" />
                    <text x="248" y="124" fill="white" fontSize="7" fontFamily="monospace">Primary</text>
                    <rect x="300" y="110" width="56" height="20" fill="none" stroke="var(--card-border)" strokeWidth="1" />
                    <text x="308" y="124" fill="var(--foreground)" fontSize="7" fontFamily="monospace">Secondary</text>
                    <text x="236" y="152" fill="var(--muted)" fontSize="8" fontFamily="monospace">Cards</text>
                    <rect x="236" y="162" width="120" height="48" fill="none" stroke="var(--card-border)" strokeWidth="1" />
                    <rect x="246" y="172" width="16" height="16" fill="none" stroke="var(--card-border)" strokeWidth="1" />
                    <rect x="250" y="176" width="8" height="8" fill="var(--muted)" />
                    <rect x="270" y="174" width="50" height="5" fill="var(--foreground)" />
                    <rect x="270" y="184" width="70" height="3" fill="var(--muted)" opacity="0.3" />
                    <rect x="270" y="192" width="56" height="3" fill="var(--muted)" opacity="0.3" />
                    <text x="236" y="230" fill="var(--muted)" fontSize="8" fontFamily="monospace">Forms</text>
                    <rect x="236" y="240" width="80" height="18" fill="none" stroke="var(--card-border)" strokeWidth="1" />
                    <text x="244" y="252" fill="var(--muted)" fontSize="7" fontFamily="monospace">Input...</text>
                    <rect x="324" y="240" width="32" height="14" fill="none" stroke="var(--accent)" strokeWidth="1" />
                    <text x="330" y="250" fill="var(--accent)" fontSize="6" fontFamily="monospace">Tag</text>
                </g>

                {/* 03 Messaging */}
                <g>
                    <rect x="420" y="40" width="180" height="240" fill="var(--background)" stroke="var(--card-border)" strokeWidth="1" />
                    <text x="436" y="68" fill="var(--muted)" fontSize="9" fontFamily="monospace" letterSpacing="0.15em">03 MESSAGING</text>
                    <line x1="436" y1="80" x2="584" y2="80" stroke="var(--card-border)" strokeWidth="1" />
                    <text x="436" y="100" fill="var(--muted)" fontSize="8" fontFamily="monospace">Positioning</text>
                    <text x="436" y="118" fill="var(--foreground)" fontSize="9" fontFamily="system-ui">We help [audience]</text>
                    <text x="436" y="132" fill="var(--accent)" fontSize="9" fontFamily="system-ui" fontWeight="bold">achieve [outcome]</text>
                    <text x="436" y="146" fill="var(--foreground)" fontSize="9" fontFamily="system-ui">through [method].</text>
                    <text x="436" y="170" fill="var(--muted)" fontSize="8" fontFamily="monospace">Value Props</text>
                    <text x="436" y="188" fill="var(--accent)" fontSize="8" fontFamily="monospace">01</text>
                    <rect x="456" y="180" width="60" height="4" fill="var(--foreground)" />
                    <text x="436" y="206" fill="var(--accent)" fontSize="8" fontFamily="monospace">02</text>
                    <rect x="456" y="198" width="52" height="4" fill="var(--foreground)" />
                    <text x="436" y="224" fill="var(--accent)" fontSize="8" fontFamily="monospace">03</text>
                    <rect x="456" y="216" width="68" height="4" fill="var(--foreground)" />
                    <text x="436" y="248" fill="var(--muted)" fontSize="8" fontFamily="monospace">Voice</text>
                    <rect x="476" y="236" width="40" height="16" fill="none" stroke="var(--accent)" strokeWidth="1" />
                    <text x="482" y="248" fill="var(--accent)" fontSize="6" fontFamily="monospace">Direct</text>
                    <rect x="522" y="236" width="48" height="16" fill="none" stroke="var(--accent)" strokeWidth="1" />
                    <text x="526" y="248" fill="var(--accent)" fontSize="6" fontFamily="monospace">Technical</text>
                </g>

                {/* Dashed lines */}
                <g stroke="var(--accent)" strokeWidth="1" fill="none" strokeDasharray="4 4" opacity="0.4">
                    <path d="M200 160 C 450 160, 450 160, 700 160" />
                    <path d="M400 160 C 550 160, 550 160, 700 160" />
                    <path d="M600 160 L 700 160" />
                </g>

                {/* Plus signs and equals */}
                <text x="205" y="166" fill="var(--accent)" fontSize="24" fontFamily="system-ui">+</text>
                <text x="405" y="166" fill="var(--accent)" fontSize="24" fontFamily="system-ui">+</text>
                <text x="608" y="166" fill="var(--muted)" fontSize="20" fontFamily="system-ui">=</text>

                {/* Arrow */}
                <g stroke="var(--accent)" strokeWidth="2" fill="none">
                    <line x1="640" y1="160" x2="695" y2="160" />
                    <polygon points="700,160 690,154 690,166" fill="var(--accent)" stroke="none" />
                </g>

                {/* Output container */}
                <rect x="700" y="40" width="180" height="240" fill="var(--background)" stroke="var(--accent)" strokeWidth="2" />
                <text x="716" y="68" fill="var(--accent)" fontSize="9" fontFamily="monospace" letterSpacing="0.15em">OUTPUT</text>
                <line x1="716" y1="80" x2="864" y2="80" stroke="var(--card-border)" strokeWidth="1" />

                {outputs.map((output, index) => renderOutputDesktop(output.id, activeOutput === index))}
                </svg>
            </div>

            {/* Mobile SVG - vertical stacked layout */}
            <div className="md:hidden space-y-4 px-4">
                {/* Ingredient cards in a column */}
                <div className="grid grid-cols-1 gap-4 max-w-[333px] mx-auto">
                    {/* Basic Styles - Mobile */}
                    <svg viewBox="0 0 280 180" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="279" height="179" fill="var(--background)" stroke="var(--card-border)" strokeWidth="1" />
                        <text x="16" y="24" fill="var(--muted)" fontSize="9" fontFamily="monospace" letterSpacing="0.15em">01 BASIC STYLES</text>
                        <line x1="16" y1="36" x2="264" y2="36" stroke="var(--card-border)" strokeWidth="1" />
                        <text x="16" y="56" fill="var(--muted)" fontSize="8" fontFamily="monospace">Logo</text>
                        <polygon points="50,70 66,95 34,95" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
                        <rect x="76" y="76" width="50" height="6" fill="var(--foreground)" />
                        <rect x="76" y="86" width="35" height="4" fill="var(--muted)" opacity="0.4" />
                        <text x="150" y="56" fill="var(--muted)" fontSize="8" fontFamily="monospace">Colors</text>
                        <rect x="150" y="66" width="24" height="24" fill="var(--foreground)" />
                        <rect x="178" y="66" width="24" height="24" fill="var(--accent)" />
                        <rect x="206" y="66" width="24" height="24" fill="var(--muted)" />
                        <rect x="234" y="66" width="24" height="24" fill="var(--card-bg)" stroke="var(--card-border)" strokeWidth="1" />
                        <text x="16" y="120" fill="var(--muted)" fontSize="8" fontFamily="monospace">Type</text>
                        <text x="50" y="150" fill="var(--foreground)" fontSize="18" fontWeight="bold" fontFamily="system-ui">Aa</text>
                        <text x="80" y="150" fill="var(--foreground)" fontSize="12" fontFamily="monospace">Aa</text>
                    </svg>

                    {/* Plus */}
                    <div className="flex justify-center">
                        <span className="text-[var(--accent)] text-2xl">+</span>
                    </div>

                    {/* Components - Mobile */}
                    <svg viewBox="0 0 280 180" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="279" height="179" fill="var(--background)" stroke="var(--card-border)" strokeWidth="1" />
                        <text x="16" y="24" fill="var(--muted)" fontSize="9" fontFamily="monospace" letterSpacing="0.15em">02 COMPONENTS</text>
                        <line x1="16" y1="36" x2="264" y2="36" stroke="var(--card-border)" strokeWidth="1" />
                        <text x="16" y="56" fill="var(--muted)" fontSize="8" fontFamily="monospace">Buttons</text>
                        <rect x="16" y="66" width="56" height="20" fill="var(--accent)" />
                        <text x="28" y="80" fill="white" fontSize="7" fontFamily="monospace">Primary</text>
                        <rect x="80" y="66" width="56" height="20" fill="none" stroke="var(--card-border)" strokeWidth="1" />
                        <text x="88" y="80" fill="var(--foreground)" fontSize="7" fontFamily="monospace">Secondary</text>
                        <text x="150" y="56" fill="var(--muted)" fontSize="8" fontFamily="monospace">Cards</text>
                        <rect x="150" y="66" width="110" height="40" fill="none" stroke="var(--card-border)" strokeWidth="1" />
                        <rect x="158" y="74" width="14" height="14" fill="none" stroke="var(--card-border)" strokeWidth="1" />
                        <rect x="161" y="77" width="8" height="8" fill="var(--muted)" />
                        <rect x="180" y="76" width="45" height="5" fill="var(--foreground)" />
                        <rect x="180" y="86" width="65" height="3" fill="var(--muted)" opacity="0.3" />
                        <rect x="180" y="94" width="50" height="3" fill="var(--muted)" opacity="0.3" />
                        <text x="16" y="110" fill="var(--muted)" fontSize="8" fontFamily="monospace">Forms</text>
                        <rect x="16" y="120" width="100" height="20" fill="none" stroke="var(--card-border)" strokeWidth="1" />
                        <text x="24" y="134" fill="var(--muted)" fontSize="8" fontFamily="monospace">Input...</text>
                        <rect x="124" y="122" width="40" height="16" fill="none" stroke="var(--accent)" strokeWidth="1" />
                        <text x="132" y="133" fill="var(--accent)" fontSize="7" fontFamily="monospace">Tag</text>
                    </svg>

                    {/* Plus */}
                    <div className="flex justify-center">
                        <span className="text-[var(--accent)] text-2xl">+</span>
                    </div>

                    {/* Messaging - Mobile */}
                    <svg viewBox="0 0 280 180" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="279" height="179" fill="var(--background)" stroke="var(--card-border)" strokeWidth="1" />
                        <text x="16" y="24" fill="var(--muted)" fontSize="9" fontFamily="monospace" letterSpacing="0.15em">03 MESSAGING</text>
                        <line x1="16" y1="36" x2="264" y2="36" stroke="var(--card-border)" strokeWidth="1" />
                        <text x="16" y="56" fill="var(--muted)" fontSize="8" fontFamily="monospace">Positioning</text>
                        <text x="16" y="74" fill="var(--foreground)" fontSize="9" fontFamily="system-ui">We help [audience]</text>
                        <text x="16" y="88" fill="var(--accent)" fontSize="9" fontFamily="system-ui" fontWeight="bold">achieve [outcome]</text>
                        <text x="16" y="102" fill="var(--foreground)" fontSize="9" fontFamily="system-ui">through [method].</text>
                        <text x="150" y="56" fill="var(--muted)" fontSize="8" fontFamily="monospace">Value Props</text>
                        <text x="150" y="74" fill="var(--accent)" fontSize="8" fontFamily="monospace">01</text>
                        <rect x="170" y="66" width="60" height="4" fill="var(--foreground)" />
                        <text x="150" y="92" fill="var(--accent)" fontSize="8" fontFamily="monospace">02</text>
                        <rect x="170" y="84" width="52" height="4" fill="var(--foreground)" />
                        <text x="150" y="110" fill="var(--accent)" fontSize="8" fontFamily="monospace">03</text>
                        <rect x="170" y="102" width="68" height="4" fill="var(--foreground)" />
                        <text x="16" y="130" fill="var(--muted)" fontSize="8" fontFamily="monospace">Voice</text>
                        <rect x="56" y="118" width="44" height="18" fill="none" stroke="var(--accent)" strokeWidth="1" />
                        <text x="62" y="131" fill="var(--accent)" fontSize="7" fontFamily="monospace">Direct</text>
                        <rect x="106" y="118" width="52" height="18" fill="none" stroke="var(--accent)" strokeWidth="1" />
                        <text x="110" y="131" fill="var(--accent)" fontSize="7" fontFamily="monospace">Technical</text>
                    </svg>

                    {/* Arrow down */}
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[var(--muted)] text-lg">=</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <polyline points="19,12 12,19 5,12" />
                        </svg>
                    </div>

                    {/* Output - Mobile */}
                    <svg viewBox="0 0 280 240" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="279" height="239" fill="var(--background)" stroke="var(--accent)" strokeWidth="2" />
                        <text x="16" y="24" fill="var(--accent)" fontSize="9" fontFamily="monospace" letterSpacing="0.15em">OUTPUT</text>
                        <line x1="16" y1="36" x2="264" y2="36" stroke="var(--card-border)" strokeWidth="1" />
                        {outputs.map((output, index) => renderOutputMobile(output.id, activeOutput === index))}
                    </svg>
                </div>
            </div>

            {/* Output selector */}
            <div className="flex items-center justify-center gap-2 md:gap-3 mt-6 md:mt-8 flex-wrap px-4">
                {outputs.map((output, index) => (
                    <button
                        key={output.id}
                        onClick={() => {
                            setActiveOutput(index);
                            setIsAnimating(false);
                        }}
                        className={`px-2 md:px-3 py-1 md:py-1.5 text-xs font-mono transition-all duration-300 border ${
                            activeOutput === index
                                ? 'border-[var(--accent)] text-[var(--accent)]'
                                : 'border-[var(--card-border)] text-muted hover:border-[var(--foreground)] hover:text-[var(--foreground)]'
                        }`}
                    >
                        {output.label}
                    </button>
                ))}
            </div>

            {/* Play/Pause */}
            <div className="text-center mt-3 md:mt-4">
                <button
                    onClick={() => setIsAnimating(!isAnimating)}
                    className="text-xs text-muted hover:text-[var(--accent)] transition-colors"
                >
                    {isAnimating ? '⏸ Pause' : '▶ Auto-cycle'}
                </button>
            </div>
        </div>
    );
}

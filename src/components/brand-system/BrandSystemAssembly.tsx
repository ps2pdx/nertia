'use client';

import { useState } from 'react';
import BasicStylesMockup from './BasicStylesMockup';
import ComponentsMockup from './ComponentsMockup';
import MessagingMockup from './MessagingMockup';

export default function BrandSystemAssembly() {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const steps = [
        { id: 0, label: 'Ingredients', description: 'The three core elements of a brand system' },
        { id: 1, label: 'Combine', description: 'Mix styles, components, and messaging' },
        { id: 2, label: 'Output', description: 'Create any marketing asset' },
    ];

    const outputs = [
        { name: 'Website', icon: '◻' },
        { name: 'Pitch Deck', icon: '▭' },
        { name: 'One-Pager', icon: '▯' },
        { name: 'Social', icon: '◫' },
    ];

    const handleAnimate = () => {
        setIsAnimating(true);
        setActiveStep(0);

        setTimeout(() => setActiveStep(1), 1000);
        setTimeout(() => setActiveStep(2), 2500);
        setTimeout(() => setIsAnimating(false), 4000);
    };

    return (
        <div className="w-full">
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-8 mb-12">
                {steps.map((step, i) => (
                    <div key={step.id} className="flex items-center gap-4">
                        <div className={`flex items-center gap-3 transition-all duration-500 ${
                            activeStep >= step.id ? 'opacity-100' : 'opacity-30'
                        }`}>
                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm transition-all duration-500 ${
                                activeStep >= step.id
                                    ? 'border-[var(--accent)] text-[var(--accent)]'
                                    : 'border-[var(--card-border)] text-muted'
                            }`}>
                                {step.id + 1}
                            </div>
                            <div>
                                <div className="text-sm font-medium">{step.label}</div>
                                <div className="text-xs text-muted">{step.description}</div>
                            </div>
                        </div>
                        {i < steps.length - 1 && (
                            <div className={`w-16 h-px transition-all duration-500 ${
                                activeStep > step.id ? 'bg-[var(--accent)]' : 'bg-[var(--card-border)]'
                            }`}></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Main Visualization */}
            <div className="relative min-h-[500px]">
                {/* Step 0 & 1: Show three ingredients */}
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ${
                    activeStep === 2 ? 'opacity-0 scale-95 absolute inset-0' : 'opacity-100 scale-100'
                }`}>
                    <div className={`transition-all duration-500 ${
                        activeStep >= 1 ? 'md:translate-x-4 md:translate-y-2' : ''
                    }`}>
                        <BasicStylesMockup />
                    </div>
                    <div className={`transition-all duration-500 delay-100 ${
                        activeStep >= 1 ? 'md:scale-110 z-10' : ''
                    }`}>
                        <ComponentsMockup />
                    </div>
                    <div className={`transition-all duration-500 delay-200 ${
                        activeStep >= 1 ? 'md:-translate-x-4 md:translate-y-2' : ''
                    }`}>
                        <MessagingMockup />
                    </div>
                </div>

                {/* Step 2: Show outputs */}
                <div className={`transition-all duration-700 delay-300 ${
                    activeStep === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-105 absolute inset-0 pointer-events-none'
                }`}>
                    <div className="text-center mb-8">
                        <div className="text-xs tracking-[0.2em] uppercase text-muted mb-2">Result</div>
                        <div className="text-2xl font-bold">Every Marketing Asset</div>
                        <div className="text-muted mt-2">Built from the same ingredients</div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                        {outputs.map((output, i) => (
                            <div
                                key={output.name}
                                className="border border-[var(--card-border)] p-6 text-center hover:border-[var(--accent)] transition-all duration-300"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <div className="text-4xl mb-3 text-[var(--accent)]">{output.icon}</div>
                                <div className="text-sm font-medium">{output.name}</div>
                            </div>
                        ))}
                    </div>

                    {/* Formula */}
                    <div className="mt-12 text-center">
                        <div className="inline-flex items-center gap-4 p-6 border border-[var(--card-border)]">
                            <span className="text-sm">Styles</span>
                            <span className="text-[var(--accent)]">+</span>
                            <span className="text-sm">Components</span>
                            <span className="text-[var(--accent)]">+</span>
                            <span className="text-sm">Messaging</span>
                            <span className="text-muted">=</span>
                            <span className="text-sm font-bold text-[var(--accent)]">Any Output</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Play Button */}
            <div className="text-center mt-12">
                <button
                    onClick={handleAnimate}
                    disabled={isAnimating}
                    className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
                        isAnimating
                            ? 'bg-[var(--card-bg)] border border-[var(--card-border)] text-muted cursor-not-allowed'
                            : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
                    }`}
                >
                    {isAnimating ? 'Animating...' : 'Play Animation'}
                </button>

                {/* Manual Step Controls */}
                <div className="flex items-center justify-center gap-2 mt-4">
                    {steps.map((step) => (
                        <button
                            key={step.id}
                            onClick={() => setActiveStep(step.id)}
                            disabled={isAnimating}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                activeStep === step.id
                                    ? 'bg-[var(--accent)]'
                                    : 'bg-[var(--card-border)] hover:bg-[var(--muted)]'
                            } ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

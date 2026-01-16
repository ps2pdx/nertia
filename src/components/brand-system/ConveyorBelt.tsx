'use client';

import { useEffect, useState, useRef, ReactNode } from 'react';

// Input icons as mini graphics
const InputIcon = ({ type, className = '' }: { type: string; className?: string }) => {
    const baseClass = `w-6 h-6 ${className}`;

    switch (type) {
        case 'Logo':
            // Triangle logo shape
            return (
                <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="12,4 22,20 2,20" />
                </svg>
            );
        case 'Colors':
            // Color palette / swatches
            return (
                <svg className={baseClass} viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" opacity="0.6" />
                    <rect x="3" y="14" width="7" height="7" rx="1" opacity="0.4" />
                    <rect x="14" y="14" width="7" height="7" rx="1" opacity="0.2" />
                </svg>
            );
        case 'Typography':
            // Aa typography symbol
            return (
                <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 18L8 6h2l4 12" />
                    <path d="M5 14h6" />
                    <path d="M15 18l2.5-6h1l2.5 6" />
                    <path d="M15.5 15h4" />
                </svg>
            );
        case 'Voice':
            // Speech/voice waves
            return (
                <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 4v16" />
                    <path d="M8 8v8" />
                    <path d="M16 8v8" />
                    <path d="M4 10v4" />
                    <path d="M20 10v4" />
                </svg>
            );
        default:
            return null;
    }
};

const inputs = ['Logo', 'Colors', 'Typography', 'Voice'];
const outputs = ['Website', 'Social', 'One-Pagers', 'Slides'];

type Phase =
    | 'idle'
    | 'input0-step1' | 'input0-step2' | 'input0-step3' | 'input0-enter'
    | 'input1-step1' | 'input1-step2' | 'input1-step3' | 'input1-enter'
    | 'input2-step1' | 'input2-step2' | 'input2-step3' | 'input2-enter'
    | 'input3-step1' | 'input3-step2' | 'input3-step3' | 'input3-enter'
    | 'processing'
    | 'output0-exit' | 'output0-step1' | 'output0-step2' | 'output0-done'
    | 'output1-exit' | 'output1-step1' | 'output1-step2' | 'output1-done'
    | 'output2-exit' | 'output2-step1' | 'output2-step2' | 'output2-done'
    | 'output3-exit' | 'output3-step1' | 'output3-step2' | 'output3-done'
    | 'complete';

export default function ConveyorBelt() {
    const [phase, setPhase] = useState<Phase>('idle');
    const [isVisible, setIsVisible] = useState(false);
    const [enteredInputs, setEnteredInputs] = useState<number[]>([]);
    const [completedOutputs, setCompletedOutputs] = useState<number[]>([]);
    const [isResetting, setIsResetting] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Start animation when visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Start animation
    useEffect(() => {
        if (!isVisible) return;

        const startTimer = setTimeout(() => {
            setPhase('input0-step1');
        }, 1000);

        return () => clearTimeout(startTimer);
    }, [isVisible]);

    // Phase progression - all inputs go in, then all outputs come out
    useEffect(() => {
        if (isResetting) return;

        let timer: NodeJS.Timeout;
        const stepDuration = 400;
        const processDuration = 1200;

        const phaseMap: Record<Phase, { next: Phase; duration: number; action?: () => void }> = {
            'idle': { next: 'idle', duration: 0 },
            // Input 0
            'input0-step1': { next: 'input0-step2', duration: stepDuration },
            'input0-step2': { next: 'input0-step3', duration: stepDuration },
            'input0-step3': { next: 'input0-enter', duration: stepDuration },
            'input0-enter': { next: 'input1-step1', duration: stepDuration, action: () => setEnteredInputs(prev => [...prev, 0]) },
            // Input 1
            'input1-step1': { next: 'input1-step2', duration: stepDuration },
            'input1-step2': { next: 'input1-step3', duration: stepDuration },
            'input1-step3': { next: 'input1-enter', duration: stepDuration },
            'input1-enter': { next: 'input2-step1', duration: stepDuration, action: () => setEnteredInputs(prev => [...prev, 1]) },
            // Input 2
            'input2-step1': { next: 'input2-step2', duration: stepDuration },
            'input2-step2': { next: 'input2-step3', duration: stepDuration },
            'input2-step3': { next: 'input2-enter', duration: stepDuration },
            'input2-enter': { next: 'input3-step1', duration: stepDuration, action: () => setEnteredInputs(prev => [...prev, 2]) },
            // Input 3
            'input3-step1': { next: 'input3-step2', duration: stepDuration },
            'input3-step2': { next: 'input3-step3', duration: stepDuration },
            'input3-step3': { next: 'input3-enter', duration: stepDuration },
            'input3-enter': { next: 'processing', duration: stepDuration, action: () => setEnteredInputs(prev => [...prev, 3]) },
            // Processing
            'processing': { next: 'output0-exit', duration: processDuration },
            // Output 0
            'output0-exit': { next: 'output0-step1', duration: stepDuration },
            'output0-step1': { next: 'output0-step2', duration: stepDuration },
            'output0-step2': { next: 'output0-done', duration: stepDuration },
            'output0-done': { next: 'output1-exit', duration: stepDuration, action: () => setCompletedOutputs(prev => [...prev, 0]) },
            // Output 1
            'output1-exit': { next: 'output1-step1', duration: stepDuration },
            'output1-step1': { next: 'output1-step2', duration: stepDuration },
            'output1-step2': { next: 'output1-done', duration: stepDuration },
            'output1-done': { next: 'output2-exit', duration: stepDuration, action: () => setCompletedOutputs(prev => [...prev, 1]) },
            // Output 2
            'output2-exit': { next: 'output2-step1', duration: stepDuration },
            'output2-step1': { next: 'output2-step2', duration: stepDuration },
            'output2-step2': { next: 'output2-done', duration: stepDuration },
            'output2-done': { next: 'output3-exit', duration: stepDuration, action: () => setCompletedOutputs(prev => [...prev, 2]) },
            // Output 3
            'output3-exit': { next: 'output3-step1', duration: stepDuration },
            'output3-step1': { next: 'output3-step2', duration: stepDuration },
            'output3-step2': { next: 'output3-done', duration: stepDuration },
            'output3-done': { next: 'complete', duration: stepDuration, action: () => setCompletedOutputs(prev => [...prev, 3]) },
            // Complete
            'complete': { next: 'idle', duration: 3000 },
        };

        const current = phaseMap[phase];
        if (!current || phase === 'idle') return;

        timer = setTimeout(() => {
            current.action?.();

            if (phase === 'complete') {
                // Reset everything invisibly
                setIsResetting(true);
                setEnteredInputs([]);
                setCompletedOutputs([]);
                setPhase('idle');

                setTimeout(() => {
                    setIsResetting(false);
                    setPhase('input0-step1');
                }, 100);
            } else {
                setPhase(current.next);
            }
        }, current.duration);

        return () => clearTimeout(timer);
    }, [phase, isResetting]);

    // Get position for each input item
    const getInputPosition = (index: number) => {
        if (isResetting) return 'left-[140px] opacity-0';

        const inputPhases = [
            ['input0-step1', 'input0-step2', 'input0-step3', 'input0-enter'],
            ['input1-step1', 'input1-step2', 'input1-step3', 'input1-enter'],
            ['input2-step1', 'input2-step2', 'input2-step3', 'input2-enter'],
            ['input3-step1', 'input3-step2', 'input3-step3', 'input3-enter'],
        ];

        const myPhases = inputPhases[index];
        if (!myPhases) return 'left-[140px] opacity-0';

        if (enteredInputs.includes(index)) return 'left-1/2 -translate-x-1/2 opacity-0 scale-0';

        if (phase === myPhases[0]) return 'left-[180px] opacity-100';
        if (phase === myPhases[1]) return 'left-[280px] opacity-100';
        if (phase === myPhases[2]) return 'left-[380px] opacity-100';
        if (phase === myPhases[3]) return 'left-1/2 -translate-x-1/2 scale-75 opacity-50';

        return 'left-[140px] opacity-0';
    };

    // Get position for each output item
    const getOutputPosition = (index: number) => {
        if (isResetting) return 'right-[500px] opacity-0';

        const outputPhases = [
            ['output0-exit', 'output0-step1', 'output0-step2', 'output0-done'],
            ['output1-exit', 'output1-step1', 'output1-step2', 'output1-done'],
            ['output2-exit', 'output2-step1', 'output2-step2', 'output2-done'],
            ['output3-exit', 'output3-step1', 'output3-step2', 'output3-done'],
        ];

        const myPhases = outputPhases[index];
        if (!myPhases) return 'right-[500px] opacity-0';

        if (completedOutputs.includes(index)) return 'right-[140px] opacity-0';

        if (phase === myPhases[0]) return 'right-1/2 translate-x-1/2 scale-75 opacity-50';
        if (phase === myPhases[1]) return 'right-[380px] opacity-100';
        if (phase === myPhases[2]) return 'right-[280px] opacity-100';
        if (phase === myPhases[3]) return 'right-[180px] opacity-100';

        return 'right-[500px] opacity-0';
    };

    // Check if input is currently animating
    const isInputAnimating = (index: number) => {
        const inputPhases = [
            ['input0-step1', 'input0-step2', 'input0-step3', 'input0-enter'],
            ['input1-step1', 'input1-step2', 'input1-step3', 'input1-enter'],
            ['input2-step1', 'input2-step2', 'input2-step3', 'input2-enter'],
            ['input3-step1', 'input3-step2', 'input3-step3', 'input3-enter'],
        ];
        return inputPhases[index]?.includes(phase) && !enteredInputs.includes(index);
    };

    // Check if output is currently animating
    const isOutputAnimating = (index: number) => {
        const outputPhases = [
            ['output0-exit', 'output0-step1', 'output0-step2', 'output0-done'],
            ['output1-exit', 'output1-step1', 'output1-step2', 'output1-done'],
            ['output2-exit', 'output2-step1', 'output2-step2', 'output2-done'],
            ['output3-exit', 'output3-step1', 'output3-step2', 'output3-done'],
        ];
        return outputPhases[index]?.includes(phase) && !completedOutputs.includes(index);
    };

    const isProcessing = phase === 'processing';

    return (
        <div ref={containerRef} className="w-full py-8 overflow-hidden">
            {/* Desktop Version */}
            <div className="hidden md:block px-8 lg:px-12">
                <div className="relative w-[666px] h-48">
                    {/* Conveyor belt line */}
                    <div className="absolute top-1/2 left-[140px] right-[140px] h-px bg-[var(--card-border)] -translate-y-1/2" />

                    {/* Conveyor belt segments */}
                    <div className="absolute top-1/2 left-[140px] right-[140px] -translate-y-1/2 flex">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 h-px border-r border-[var(--card-border)]"
                                style={{ borderRightWidth: '2px' }}
                            />
                        ))}
                    </div>

                    {/* Input basket (left side) */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-28">
                        <div className="text-xs tracking-[0.15em] uppercase text-muted mb-3 text-center">
                            Inputs
                        </div>
                        <div className="border border-[var(--card-border)] bg-[var(--background)] p-2 grid grid-cols-2 gap-2">
                            {inputs.map((item, index) => {
                                const isAnimating = isInputAnimating(index);
                                const hasEntered = enteredInputs.includes(index);

                                return (
                                    <div
                                        key={item}
                                        className={`border p-2 flex items-center justify-center transition-all duration-200 ${
                                            isAnimating
                                                ? 'border-[var(--accent)] text-[var(--accent)] opacity-40'
                                                : hasEntered
                                                ? 'border-[var(--card-border)] text-muted opacity-20'
                                                : 'border-[var(--card-border)] text-muted opacity-100'
                                        }`}
                                        title={item}
                                    >
                                        <InputIcon type={item} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Center processing box */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className={`border-2 border-dashed px-8 py-6 bg-[var(--background)] transition-all duration-200 ${
                            isProcessing ? 'border-[var(--accent)] scale-110' : 'border-[var(--card-border)]'
                        }`}>
                            <div className="text-sm tracking-[0.2em] uppercase text-center">
                                <span className={`transition-colors duration-200 ${isProcessing ? 'text-[var(--accent)]' : 'text-muted'}`}>
                                    Nertia
                                </span>
                            </div>
                            <div className="text-[10px] tracking-[0.1em] uppercase text-muted text-center mt-1">
                                Process
                            </div>
                            {/* Show count of entered inputs */}
                            {enteredInputs.length > 0 && !isProcessing && phase.startsWith('input') && (
                                <div className="text-[10px] text-[var(--accent)] text-center mt-2">
                                    {enteredInputs.length}/4
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Moving input items */}
                    {inputs.map((item, index) => (
                        isInputAnimating(index) && (
                            <div
                                key={`input-${index}`}
                                className={`absolute top-1/2 -translate-y-1/2 z-20 transition-all duration-300 ease-linear ${getInputPosition(index)}`}
                            >
                                <div className="border border-[var(--accent)] bg-[var(--background)] p-2 text-[var(--accent)]">
                                    <InputIcon type={item} className="w-5 h-5" />
                                </div>
                            </div>
                        )
                    ))}

                    {/* Moving output items */}
                    {outputs.map((item, index) => (
                        isOutputAnimating(index) && (
                            <div
                                key={`output-${index}`}
                                className={`absolute top-1/2 -translate-y-1/2 z-20 transition-all duration-300 ease-linear ${getOutputPosition(index)}`}
                            >
                                <div className="border-2 border-[var(--accent)] bg-[var(--background)] px-4 py-2 text-xs font-mono text-[var(--accent)] whitespace-nowrap">
                                    {item}
                                </div>
                            </div>
                        )
                    ))}

                    {/* Output basket (right side) */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32">
                        <div className="text-xs tracking-[0.15em] uppercase text-[var(--accent)] mb-3 text-center">
                            Outputs
                        </div>
                        <div className="border border-[var(--accent)] bg-[var(--background)] p-3 space-y-2 min-h-[140px]">
                            {outputs.map((item, index) => {
                                const isCompleted = completedOutputs.includes(index);

                                return (
                                    <div
                                        key={item}
                                        className={`border border-[var(--accent)] px-3 py-1.5 text-xs font-mono text-center transition-opacity duration-200 ${
                                            isCompleted
                                                ? 'opacity-100 text-[var(--accent)]'
                                                : 'opacity-0 text-transparent border-transparent'
                                        }`}
                                    >
                                        {item}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Version */}
            <div className="md:hidden px-4">
                <div className="max-w-[300px] mx-auto">
                    {/* Input basket */}
                    <div className="mb-4">
                        <div className="text-xs tracking-[0.15em] uppercase text-muted mb-2 text-center">Inputs</div>
                        <div className="border border-[var(--card-border)] p-3 grid grid-cols-4 gap-2">
                            {inputs.map((item, index) => {
                                const hasEntered = enteredInputs.includes(index);

                                return (
                                    <div
                                        key={item}
                                        className={`border p-2 flex items-center justify-center transition-opacity duration-200 ${
                                            hasEntered
                                                ? 'border-[var(--card-border)] text-muted opacity-20'
                                                : 'border-[var(--card-border)] text-muted'
                                        }`}
                                        title={item}
                                    >
                                        <InputIcon type={item} className="w-5 h-5" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Arrow down */}
                    <div className="flex justify-center my-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--card-border)" strokeWidth="2">
                            <line x1="12" y1="4" x2="12" y2="20" />
                            <polyline points="18,14 12,20 6,14" />
                        </svg>
                    </div>

                    {/* Process box */}
                    <div className="flex justify-center my-4">
                        <div
                            className={`border-2 border-dashed px-6 py-4 transition-all duration-200 ${
                                isProcessing
                                    ? 'border-[var(--accent)] scale-105'
                                    : 'border-[var(--card-border)]'
                            }`}
                        >
                            <span className={`text-xs tracking-[0.15em] uppercase transition-colors duration-200 ${
                                isProcessing ? 'text-[var(--accent)]' : 'text-muted'
                            }`}>
                                Nertia Process
                            </span>
                            {enteredInputs.length > 0 && !isProcessing && (
                                <span className="text-[10px] text-[var(--accent)] ml-2">
                                    {enteredInputs.length}/4
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Arrow down */}
                    <div className="flex justify-center my-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                            <line x1="12" y1="4" x2="12" y2="20" />
                            <polyline points="18,14 12,20 6,14" />
                        </svg>
                    </div>

                    {/* Output basket */}
                    <div className="mt-4">
                        <div className="text-xs tracking-[0.15em] uppercase text-[var(--accent)] mb-2 text-center">Outputs</div>
                        <div className="border border-[var(--accent)] p-3 grid grid-cols-2 gap-2 min-h-[80px]">
                            {outputs.map((item, index) => {
                                const isCompleted = completedOutputs.includes(index);

                                return (
                                    <div
                                        key={item}
                                        className={`border border-[var(--accent)] px-2 py-1.5 text-xs font-mono text-center transition-opacity duration-200 ${
                                            isCompleted
                                                ? 'opacity-100 text-[var(--accent)]'
                                                : 'opacity-0 text-transparent border-transparent'
                                        }`}
                                    >
                                        {item}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

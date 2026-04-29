'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'nertia-dashboard-checklist';

type Checks = Record<string, boolean>;

function readStorage(): Checks {
    if (typeof window === 'undefined') return {};
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw) as unknown;
        if (parsed && typeof parsed === 'object') {
            return parsed as Checks;
        }
        return {};
    } catch {
        return {};
    }
}

function writeStorage(checks: Checks) {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checks));
    } catch {
        // ignore quota / disabled storage
    }
}

export function useChecklistState() {
    const [checks, setChecks] = useState<Checks>({});
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setChecks(readStorage());
        setHydrated(true);
    }, []);

    function toggle(id: string) {
        setChecks((prev) => {
            const next = { ...prev, [id]: !prev[id] };
            writeStorage(next);
            return next;
        });
    }

    function reset() {
        setChecks({});
        writeStorage({});
    }

    function isChecked(id: string): boolean {
        return Boolean(checks[id]);
    }

    function countChecked(ids: string[]): number {
        return ids.reduce((acc, id) => (checks[id] ? acc + 1 : acc), 0);
    }

    return { isChecked, toggle, reset, countChecked, hydrated };
}

export interface LeafStep {
    id: string;
    title: string;
    info?: string;
}

export interface MidStep {
    id: string;
    title?: string;
    leaves: LeafStep[];
}

export interface MacroStep {
    id: string;
    title: string;
    mids: MidStep[];
}

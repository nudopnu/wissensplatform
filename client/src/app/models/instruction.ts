export interface LeafInfo {
    title?: string;
    content: string;
}

export interface LeafStep {
    id: string;
    description: string;
    info?: LeafInfo;
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

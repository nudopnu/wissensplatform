import { TreadmillState } from "./treadmill-state";

export class Sequence {
    startTime: number = 0;
    hasEnded: boolean = false;
    keyframes: Keyframe[];

    constructor(
        public name: string,
        public condition: string,
        public commands: Command[],
    ) {
        this.keyframes = parseKeyframes(commands);
        console.log(this.keyframes);
    }

    public start() {
        this.startTime = Date.now();
        this.hasEnded = false;
    }

    public update(oldState: TreadmillState): TreadmillState {
        const elapsedTime = Date.now() - this.startTime;

        const newState = { ...oldState };
        this.keyframes.forEach(keyframe => {
            const { startTime, endTime, commands } = keyframe;
            if (elapsedTime < startTime) return;
            if (elapsedTime > endTime) return;
            commands.forEach(cmd => {
                newState[cmd.command] = cmd.value;
            });
        });
        this.hasEnded = this.keyframes.length === 0 || elapsedTime > this.keyframes.at(-1)!.endTime;
        return newState;
    }

}

export type SetLeftBeltSpeedCommand = {
    command: "lbs";
    value: number;
}

export type SetRightBeltSpeedCommand = {
    command: "rbs";
    value: number;
}

export type SetPitchCommand = {
    command: "pitch";
    value: number;
}

export type SetSwayCommand = {
    command: "sway";
    value: number;
}

export type WaitCommand = {
    command: "wait";
    value: number;
}

export type Command =
    | SetLeftBeltSpeedCommand
    | SetRightBeltSpeedCommand
    | SetPitchCommand
    | SetSwayCommand
    | WaitCommand
    ;

export type ControlCommand = Exclude<Command, WaitCommand>;

export function parseCommands(text: string): Command[] {
    const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    return lines.map((line, idx) => {
        const split = line.split(" ");
        if (split.length !== 2) throw new Error(`Error in line ${idx}: Unknown syntax '${line}'`);
        const [str_cmd, str_val] = split;
        const raw = parseFloat(str_val);
        const command = str_cmd as Command["command"];
        switch (command) {
            case "lbs":
            case "rbs":
            case "pitch":
            case "sway":
            case "wait":
                return { command, value: raw };
            default:
                throw new Error(`Unknown command in line ${idx}: '${str_cmd}'`);
        }
    });
}

export type Keyframe = {
    startTime: number;
    endTime: number;
    commands: ControlCommand[];
};

export function parseKeyframes(commands: Command[]): Keyframe[] {
    let startTime = 0;
    let currentKeyframe: Keyframe = { startTime, endTime: startTime, commands: [] };
    const keyframes: Keyframe[] = [currentKeyframe];

    commands.forEach(cmd => {
        switch (cmd.command) {
            case "wait":
                startTime += cmd.value;
                currentKeyframe.endTime = startTime;
                currentKeyframe = { startTime, endTime: startTime, commands: [] };
                keyframes.push(currentKeyframe);
                break;
            default:
                currentKeyframe.commands.push(cmd);
        }
    });
    currentKeyframe.endTime = startTime;
    return keyframes
}
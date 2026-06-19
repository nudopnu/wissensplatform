import { computed, Injectable, signal } from "@angular/core";
import { DEFAULT_SCENE_CONFIG, SceneConfig } from "../models/scene-config.model";


@Injectable({
    providedIn: 'root'
})
export class UserConfigService {

    userConfig = signal<Partial<SceneConfig>>({});
    config = computed(() => ({
        ...DEFAULT_SCENE_CONFIG,
        ...this.userConfig(),
    }));

    setAntialiasing(enabled: boolean) {
        this.userConfig.update(cfg => ({ ...cfg, antialiasing: enabled }));
    }
}

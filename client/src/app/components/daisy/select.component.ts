import { Component, computed, input, model } from "@angular/core";

@Component({
    selector: "daisy-select",
    template: `
<fieldset class="fieldset">
  <legend class="fieldset-legend">{{title()}}</legend>
  <select [value]="selectedIndex()" (change)="onChange($any($event.target).value)" class="select">
      <option value="" disabled [selected]="value() === undefined">{{placeholder()}}</option>
      @for (option of options(); track $index) {
          <option [value]="$index">{{display()(option)}}</option>
        }
    </select>
</fieldset>
`,
})
export class SelectComponent<T> {
    value = model<T>();
    options = input.required<T[]>();
    title = input("Options")
    placeholder = input("Pick a color");
    display = input((option: T) => `${option}`);

    selectedIndex = computed(() => {
        const index = this.options().indexOf(this.value() as T);
        return index === -1 ? "" : `${index}`;
    });

    onChange(value: string) {
        if (value === "") {
            return;
        }
        this.value.set(this.options()[+value]);
    }
}

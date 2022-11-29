import { Component, OnInit, OnDestroy, Input, Output, SimpleChanges, EventEmitter, forwardRef, ElementRef, ViewChild, OnChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-control-value-accessor',
  template: `
    <input 
      style="text-align:right;"
      class="form-control"
      type="text"
      #inputText 
      [(ngModel)]="valueInputText" 
      (focus)="onFocus($event);" 
      (change)="onChange($event)" 
      (blur)="onBlur($event)"
      (click)="onClick($event)"
      (mouseup)="$event.preventDefault()"
      (ngModelChange)="onChangeModel($event)"
      (keydown)="onKeydown($event)"
      (paste)="onPaste($event)"
      [disabled]="isDisabled" >

    <p>Modelo del componente input: {{value}}</p>
  `,
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ControlValueAccesorComponent),
        multi: true
    },
]
})
export class ControlValueAccesorComponent implements OnInit, OnDestroy, OnChanges, ControlValueAccessor {
    @Input('value') value: number;
  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('inputText') inputText: ElementRef;

  public valueInputText: string;
      
  private propagateChange = (_: any) => { };
  private propagateTouch = (_: any) => { };
  public isDisabled: boolean = false;

  private regexNumber: RegExp = new RegExp(/\d$/g);

  private copyPasteKeys: Array<string> = ['Control','Shift','c','x','v','Insert'];
  private copyPastePreviousKey: string;
  private InitialcopyPastePreviousKey: any = false;
  private specialKeys: Array<string> = ['Enter','Backspace','Tab','End','Home','ArrowRight','ArrowLeft','Delete',','];
  private firstClick: boolean = false;

  constructor() {  }

  ngOnInit(): void {
    // if (this.valueInputText == null || this.valueInputText == undefined) {
    //   this.valueInputText = '0,00';
    //   this.value = 0;
    // }
    this.copyPastePreviousKey = '';
    this.InitialcopyPastePreviousKey = setInterval(() => {
      this.copyPastePreviousKey = ''; 
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.InitialcopyPastePreviousKey) {
      clearInterval(this.InitialcopyPastePreviousKey);
    }
  }

  onFocus(event: any): void {
    if (this.valueInputText == null){
      this.valueInputText = '0,00';
      //this.valueInputText = '';
      event.target.select();
    }
    // Elimino todos los puntos ('.') del string
    let regex = /\./g;
    this.valueInputText = this.valueInputText.replace(regex, '');    
    event.target.select();
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.specialKeys.indexOf(event.key) != -1 || String(event.key).match(this.regexNumber) || event.key == ',') {
      if (event.key == ',') {
        if(this.valueInputText.search(',') >= 0) {
          event.preventDefault();        
        }
      }
      if (event.key == 'Enter') {
        this.inputText.nativeElement.blur();
      }
      return;
    } else if (this.copyPasteKeys.indexOf(event.key) != -1) { // Control de Copy & Paste
      if (event.key == 'Control' || event.key == 'Shift') {
        this.copyPastePreviousKey = event.key;
      }
      if (this.copyPasteKeys.indexOf(event.key) != -1 && (this.copyPastePreviousKey == 'Control' || this.copyPastePreviousKey == 'Shift')) {
        return;
      }else {
        event.preventDefault();
      }
    } else {
      event.preventDefault();    
    }
  }

  onBlur(event: ClipboardEvent): void {
    let regex = /\./g;
    this.valueInputText = this.valueInputText.replace(regex, '');
    this.valueInputText = this.thousandsSeparator(this.valueInputText);
    this.value = this.parseStringNumber(this.valueInputText);
    this.valueChange.emit(this.value); 
  }

  onChange(event : any): void {
    // this.propagateChange(this.valueInputText);
    // this.valueInputText = this.thousandsSeparator(this.valueInputText);
    // this.value = this.parseStringNumber(this.valueInputText);
    // this.valueChange.emit(this.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (this.valueInputText == null ){
    //   this.valueChange.emit(0);
    // }else {
    //   this.valueChange.emit(this.value);
    // }
    if (isNaN(changes.value.currentValue)) {
      this.valueInputText = this.thousandsSeparator(changes.value.currentValue);
    }else {
      this.valueInputText = this.thousandsSeparator(changes.value.currentValue.toString());
    }
    
    
    this.value = this.parseStringNumber(this.valueInputText);
    this.valueChange.emit(this.value);
    
    this.valueChange.emit(changes.value.currentValue);
  }

  onClick(event: any): void {
    if (!this.firstClick) {
      event.target.select();
      this.firstClick = true;
    }
  }

  onPaste(event: any): void {
    let result: string = '';
    let numComma = this.counterString(',',this.valueInputText);
    
    let patternNumber: any = /\d/;
    let patternChar: any = /\D/;
    let dirtyStringArray:string [] = event.target.value.split('');
    for (let cont = 0; cont <= dirtyStringArray.length; cont++){
      if (patternNumber.test(dirtyStringArray[cont])){
        result = result + dirtyStringArray[cont];
      }else if (patternChar.test(dirtyStringArray[cont])){
        if (dirtyStringArray[cont] == ',' && numComma == 0){
          result = result + ',';
        }
      }
    }
    this.valueInputText = result;
  }

  writeValue(value: any): void {
    if (value) {
      this.valueInputText = value;
    }
  }

  registerOnChange(fn: (_: any) => void): void {
      this.propagateChange = fn;      
  }

  registerOnTouched(fn: () => void): void {
      this.propagateTouch = fn;
  }

  onChangeModel(value: any) {
  }

  onTouch(event : any){
    this.propagateTouch(event);
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  private counterString (stringToSearch: string, search: string): number{
    let i: number = 0;
    let counter: number = 0;
    while (i != -1) {
      i = stringToSearch.indexOf(search,i);
      if (i != -1) {
        i++;
        counter++;
      }
    }
    return counter;
  }

  private thousandsSeparator (stringNumber: string): string {
    let resultado: string;
    if (stringNumber != undefined && stringNumber!=null && stringNumber!='' ) {
      stringNumber = stringNumber.replace(',','.');
      let flotante: number = parseFloat(stringNumber);
      let flotanteString = flotante.toFixed(2);
      resultado = flotanteString.replace('.', ',');
      let pos = resultado.indexOf(",");
      // string.substr(<desde>, <longitud>);
      while (pos > 3) {
        resultado = resultado.substr(0, pos-3)+'.'+resultado.substr(pos-3, 3)+resultado.substr(pos);
        pos=pos-3;
      }
    }
    if (resultado == 'NaN') {
      return '0,00';
    }else {
      return resultado;    
    }
  }

  private parseStringNumber (stringNumber: string): number {
    let resultado: string;
    resultado = stringNumber;
    resultado = resultado.replace(/\./g, '');
    resultado = resultado.replace(',', '.');
    return parseFloat(resultado);
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sentenceCase'
})
export class SentenceCasePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let input = ( value === undefined || value === null ) ? '' : value;
    input = input.toLowerCase();
    return input.toString().replace( /(^|\. * |\- *)([a-z])/g, function(match, separator, char) {
        // return separator + char.toUpperCase();
        return match.toUpperCase();
      });
  }

}

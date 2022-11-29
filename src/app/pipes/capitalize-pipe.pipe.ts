import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizePipe'
})
export class CapitalizePipePipe implements PipeTransform {

  transform(input: any, args?: any): any {

    
    input = ( input === undefined || input === null ) ? '' : input;

    input = input.toLowerCase();

    //if (lowercaseBefore) { input = input.toLowerCase(); }
    return input.toString().replace( /(^|\. * |\- *)([a-z])/g, function(match, separator, char) {
        // return separator + char.toUpperCase();
      return match.toUpperCase();
    });
    
  }

}

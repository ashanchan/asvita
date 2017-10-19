import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MessageService } from './../services/message.service';

function _window(): any {
  return window;
}

@Injectable()
export class WindowService {
  constructor(private messageService: MessageService) {
    Observable.fromEvent(window, 'resize')
      .debounceTime(500)
      .subscribe((event) => {
        this.messageService.sendMessage({ event: 'onResize' });
      });

  }

  get nativeWindow(): any {
    return _window();
  }

  setThemeStyle() {
    let cssId = ''; // you could encode the css path itself to generate id..
    let theme = localStorage.getItem('theme'); //'w3-theme-blue';
    theme = theme ? theme : 'w3-theme-grey';
    if (!document.getElementById(cssId)) {
      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = 'https://www.w3schools.com/lib/' + theme + '.css';
      link.media = 'all';
      head.appendChild(link);
    }
  }
}

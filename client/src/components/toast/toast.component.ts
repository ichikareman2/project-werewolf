import { Component, AfterContentInit } from '@angular/core';
import { tap, map, delay } from 'rxjs/operators';
import { Subject } from 'rxjs';
declare var $: any;
interface ToastModel {
  id?: string,
  title: string,
  message: string
}
@Component({
  selector: 'toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements AfterContentInit {
  /** queue gateway(?) for toast */
  private toast$ = new Subject<ToastModel>();
  /** view's model of toasts */
  toasts: ToastModel[] = [];

  ngAfterContentInit() {
    this.toast$.pipe(
      map(x => ({ ...x, id: '' + Math.random().toString(36).substr(2, 9) })),
      tap(x => this.toasts = [...this.toasts, x]),
      delay(0),
      tap(x => $(`#${x.id}`).toast('show')),
      delay(5000),
      tap(x => $(`#${x.id}`).toast('hide')),
      delay(1000),
      tap(toastEntry => this.toasts = this.toasts.filter(toast => toast.id !== toastEntry.id))
    ).subscribe()
  }
  /** show toast message. */
  show(toast: ToastModel) {
    this.toast$.next({ title: toast.title, message: toast.message });
  }

  /** trackby for toast items. list optimization */
  trackByFn(_: number, toast: ToastModel) {
    return toast.id;
  }
}

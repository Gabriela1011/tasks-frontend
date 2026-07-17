import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { Header } from "./header/header";
import { Toasts } from "./components/toasts/toasts";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Toasts],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tasks-frontend');

  private router = inject(Router);

  protected readonly showHeader = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => !event.urlAfterRedirects.startsWith('/login'))
    ),
    { initialValue: !this.router.url.startsWith('/login') }
  );
}

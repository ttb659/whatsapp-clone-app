import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'WhatsApp Clone';
  
  constructor(
    private authService: AuthService,
    private websocketService: WebsocketService
  ) {}
  
  ngOnInit(): void {
    // Initialize authentication state
    this.authService.initAuth();
    
    // Connect to websocket if authenticated
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.websocketService.connect();
      } else {
        this.websocketService.disconnect();
      }
    });
  }
}

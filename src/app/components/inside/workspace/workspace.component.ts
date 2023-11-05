import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css'],
})
export class WorkspaceComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {}
  boards: any[] = [];
  user = this.authService.currentUser;

  async ngOnInit() {
    this.boards = await this.dataService.getBoards();
    console.log(this.boards);
  }

  async startNewBoard() {
    const data = await this.dataService.startBoard();

    this.boards = await this.dataService.getBoards();

    if (this.boards.length > 0) {
      const latestBoard = this.boards.pop();
      if (latestBoard.boards) {
        console.log('Board inserted', latestBoard.boards);
        this.router.navigateByUrl(`/workspace/${latestBoard.boards.id}`);
      }
    }
  }
}

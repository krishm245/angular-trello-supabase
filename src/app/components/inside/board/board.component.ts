import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  boardInfo: any = {};
  lists: any[] = [];
  boardId: string | null = null;
  editTitle: any = {};
  editCard: any = {};
  titleChanged: boolean = false;
  listCards: any = {};
  addUserEmail: string = '';

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.boardId = this.route.snapshot.paramMap.get('id');

    if (this.boardId) {
      this.boardInfo = (await this.dataService.getBoardInfo(this.boardId)).data;

      this.lists = await this.dataService.getBoardLists(this.boardId);

      for (let list of this.lists) {
        this.listCards[list.id] = await this.dataService.getListCards(list.id);
      }
      this.handleRealtimeUpdates();
    }
  }

  async saveBoardTitle() {
    await this.dataService.updateBoard(this.boardInfo);
    this.titleChanged = false;
  }

  async deleteBoard() {
    await this.dataService.deleteBoard(this.boardInfo);
    this.router.navigateByUrl('/workspace');
  }

  // List operations
  async addList() {
    const newList = await this.dataService.addBoardList(
      this.boardId!,
      this.lists.length
    );
  }

  editingTitle(list: any, edit = false) {
    this.editTitle[list.id] = edit;
  }

  async updateListTitle(list: any) {
    await this.dataService.updateBoardList(list);
    this.editingTitle(list, false);
  }

  async deleteBoardList(list: any) {
    await this.dataService.deleteBoardList(list);
  }

  //
  // CARDS logic
  //
  async addCard(list: any) {
    await this.dataService.addListCard(
      list.id,
      this.boardId!,
      this.listCards[list.id].length
    );
  }

  editingCard(card: any, edit = false) {
    this.editCard[card.id] = edit;
  }

  async updateCard(card: any) {
    await this.dataService.updateCard(card);
    this.editingCard(card, false);
  }

  async deleteCard(card: any) {
    await this.dataService.deleteCard(card);
  }

  // Invites
  async addUser() {
    await this.dataService.addUserToBoard(this.boardId!, this.addUserEmail);
    this.addUserEmail = '';
  }

  handleRealtimeUpdates() {
    // TODO
  }
}

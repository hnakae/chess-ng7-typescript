import { Component, OnInit } from '@angular/core';

import { Board, State, Color, Position, Piece, PieceKind } from './chess.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  board: Board;
  color: Color;

  //state: State;
  // simulator: OthelloSimulator = null;
  //audio = null;

  constructor() {
    this.board = new Board();
  }
    // this.audio = new Audio('../../assets/sound/POL-air-ducts-short.wav');
    // if (typeof this.audio.loop == 'boolean') {
    //   this.audio.loop = true;
    // } else {
    //     this.audio.addEventListener('ended', function () {
    //     this.currentTime = 0;
    //     this.play();
    //   }, false);
    // }


  ngOnInit() {
    this.reset();
  }

  reset() {
    this.board.init();
    this.color = 'black';
    // this.simulator = null;
    // this.audio.pause();
    // this.audio.currentTime = 0;
  }

  isWhite(rowIdx, colIdx) {
    const state = this.board.getState0(rowIdx, colIdx);
    if (!state) {
      return false;
    }
    return state.color === 'white';
  }
  isBlack(rowIdx, colIdx) {
    const state = this.board.getState0(rowIdx, colIdx);
    if (!state) {
      return false;
    }
    return state.color === 'black';
  }
  isEmpty(rowIdx, colIdx) {
    const state = this.board.getState0(rowIdx, colIdx);
    return state === null;
  }

  userPickUpPiece(color: Color, piece: Piece, currentPos: Position, nextPos: Position) {
     const state = this.board.getState(currentPos);
    if (state === null || state.color !== color) {
      alert('invalid move!');
      return;
    }
    try {
      let found = false;
      for (const newPos of this.board.nextMoves(color, piece, currentPos)) {
        if (newPos[0] === nextPos[0] && newPos[1] === nextPos[1]) {
          found = true;
          break;
        }
      }
      if (!found) {
        alert('invalid move!');
        return;
      }
      const w = this.board.put(color, piece.kind, nextPos);
      this.board.setState(currentPos, null);

      if (w === null) {
        this.nextColor();
      } else {
        alert('Game over: player '+w+' wins.');
      }
    } catch (err) {
      alert('invalid location! ' + err);
    }
  }

  private nextColor() {
    this.color = (this.color === 'white') ? 'black' : 'white';
  }
}


/* CHESS PSEUDOCODE
     ----- game.component.html pseudocode -----
  When clicked {
    // CALLS GAME LOGIC
    instantiate piece when you create board.

    if there is a piece here
      check piece type.
        if piece.type==rook-etc
          pick up piece (create temp and remove from board) (click)="pickUpPiece"
          highlight possible moves and enemy pieces u can capture
          wait for valid click
            take temp and place on board.
              if location has enemy piece,
                remove enemy piece and add to captured pile
  }

     ------ game.component.ts pseudocode-----------
     // GAME LOGIC
     this.board = new Board();
      pickUpPiece() { 
        piece = new Piece();
        pick up; 
        this.board.putDown(piece)
        if(xyz){
          capture();
        }
      }
      capture() {  }

   ------ chess.component.ts pseudocode-----------
   // OBJECTS FOR GAME LOGIC
   export state //black or white
   export pieces
   export board with pieces initialized?
   export stuff


*/


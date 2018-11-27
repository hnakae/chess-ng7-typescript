//
// chess.component.ts

export type Color = 'black' | 'white';

export type PieceKind = 'pawn' | 'rook' | 'knight' | 'bishop' | 'king' | 'queen';

export class State {
    constructor(public color: Color, public pieceKind: PieceKind) {}
}

export type Result = -1 | 0 | 1;

export type Delta = [number, number];
export type Position = [number, number];

export abstract class Piece {
    constructor(public kind: PieceKind) {}

    abstract moves(pos: Position): Position[];

    isValidPosition(pos: Position): boolean {
        const x = pos[0];
        const y = pos[1];
        return ((x >= 0 && x <= 7) && (y >= 0 && y <= 7));
    }

    pos_add(pos: Position, delta: Delta): Position {
        const next_pos: Position = [pos[0] + delta[0], pos[1] + delta[1]];
        if (this.isValidPosition(next_pos)) {
            return next_pos;
        }
        return null;
    }
    add(pos: Position, delta: Delta, positions: Position[]) {
        const new_pos = this.pos_add(pos, delta);
        if (new_pos) {
            positions.push(new_pos);
        }
    }
}

export class King extends Piece {
    constructor() { 
        super('king');
    }
    moves(pos: Position): Position[] {
        const positions = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) {
                    continue;
                }
                this.add(pos, [i, j], positions);
            }
        }
        return positions;
    }
}

export class Queen extends Piece {
    constructor() {
        super('queen');
    }
    moves(pos: Position): Position[] {
        const positions = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) {
                    continue;
                }
                for (let n = 1; n <= 7; n++) {
                    const x = n * i;
                    const y = n * j;
                    this.add(pos, [x, y], positions);
                }
            }
        }
        return positions;
    }
}

export class Pawn extends Piece {
    constructor() {
        super('pawn');
    }
    moves(pos: Position): Position[] {
        const positions = [];
        this.add(pos, [0, 1], positions);
        return positions;
    }
}

export class Rook extends Piece {
    constructor() {
        super('rook');
    }
    moves(pos: Position): Position[] {
        const positions = [];
        // for (let i = -1; i <= 1; i++) {
        //     const js = (i === 0) ? [1, -1] : [0];
        //     for (const j of js) {
        //         for (let n = 1; n <= 7; n++) {
        //             const x = n * i;
        //             const y = n * j;
        //             this.add(pos, [x, y], positions);
        //         }
        //     }
        // }
        return positions;
    }
}

export class Bishop extends Piece {
    constructor() {
        super('bishop');
    }
    moves(pos: Position): Position[] {
        const positions = [];
        for (let i = -1; i <= 1; i += 2) {
            for (let j = -1; j <= 1; j += 2) {
                for (let n = 1; n <= 7; n++) {
                    const x = n * i;
                    const y = n * j;
                    this.add(pos, [x, y], positions);
                }
            }
        }
        return positions;
    }
}

export class Knight extends Piece {
    constructor() {
        super('knight');
    }
    moves(pos: Position): Position[] {
        const positions = [];
        for (let i = -1; i <= 1; i++) {
            const js = (i === 0) ? [1, -1] : [0];
            for (const j of js) {
                for (let n = 1; n <= 7; n++) {
                    const x = n * i;
                    const y = n * j;
                    this.add(pos, [x, y], positions);
                }
            }
        }
        return positions;
    }
}

class PiecePosition {
    constructor(public color: Color, public kind: PieceKind, public pos: Position) {
    }
}

export class Board {

    board: State[][];

    constructor() {
        const board = [];
        function createRow(rowIdx) {
            const row = [];
            for (let colIdx = 0; colIdx < 8; colIdx++) {
                row.push(null);
            }
            return row;
        }
        for (let rowIdx = 0; rowIdx < 8; rowIdx++) {
            const row = createRow(rowIdx);
            board.push(row);
        }
        this.board = board;
        this.init();
    }

    // put0(pp: PiecePosition) {
    //     const state = new State(color, piece.kind);
    //     this.setState(pos, state);
    // }

    put(color: Color, pieceKind: PieceKind, pos: Position): Color {
        const oldState = this.getState(pos);
        if (oldState !== null && oldState.color === color) {
            throw new Error('invalid move!');
        }
        if (oldState.pieceKind === 'king') {
            return color; // return winner's color.
        }
        const state = new State(color, pieceKind);
        this.setState(pos, state);
        return null;
    }

    getState0(rowIdx: number, colIdx: number): State {
        return this.board[rowIdx][colIdx];
    }

    getState(pos: Position): State {
        return this.board[pos[0]][pos[1]];
    }

    setState(pos: Position, state: State) {
        this.board[pos[0]][pos[1]] = state;
    }

    nextMoves(color: Color, piece: Piece, pos: Position): Position[] {
        const nextPositions = [];
        for (const new_pos of piece.moves(pos)) {
            if (this.validBoardPosition(color, new_pos)) {
                nextPositions.push(new_pos);
            }
        }
        return nextPositions;
    }

    validBoardPosition(color: Color, pos: Position) {
        const state = this.getState(pos);
        return state.color === null || state.color !== color;
    }

    init() {
        this.setInitPositions('white');
        this.setInitPositions('black');
    }

    setInitPositions(color: Color) {
        const x = ((color === 'white') ? 0 : 7);
        this.put(color, new Rook(), [0, x]);
        this.put(color, new Rook(), [7, x]);
        this.put(color, new Knight(), [1, x]);
        this.put(color, new Knight(), [6, x]);
        this.put(color, new Bishop(), [2, x]);
        this.put(color, new Bishop(), [5, x]);
        this.put(color, new Queen(), [3, x]);
        this.put(color, new King(), [4, x]);

        const y = (color === 'white') ? 1 : 7;
        for (let i = 0; i < 8; i++) {
            this.put(color, new Pawn(), [i, y]);
        }
    }
}

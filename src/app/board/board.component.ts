import {
  ChangeDetectionStrategy,
  Component,
  TrackByFunction,
} from '@angular/core';
import { BoardStateService, TileValue } from './board-state.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BoardStateService],
})
export class BoardComponent {
  constructor(public stateService: BoardStateService) {}

  trackByIdx: TrackByFunction<TileValue> = (i, _) => i;
}

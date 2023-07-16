import {
  ChangeDetectionStrategy,
  Component,
  TrackByFunction,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  BoardStateService,
  DEFAULT_SIZE,
  TileValue,
} from './board-state.service';

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

  settingsForm = new FormGroup({
    size: new FormControl(DEFAULT_SIZE, { nonNullable: true }),
  });

  selectableSizes = Array.from({ length: 5 }).map((_, i) => i + 3);
}

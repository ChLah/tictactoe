import {
  ChangeDetectionStrategy,
  Component,
  TrackByFunction,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SettingsService } from '../settings.service';
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
  constructor(
    public stateService: BoardStateService,
    private settingsService: SettingsService
  ) {
    this.restoreSize();
  }

  trackByIdx: TrackByFunction<TileValue> = (i, _) => i;

  settingsForm = new FormGroup({
    size: new FormControl(DEFAULT_SIZE, { nonNullable: true }),
  });

  selectableSizes = Array.from({ length: 5 }).map((_, i) => i + 3);

  setSize(size: number) {
    this.stateService.setSize(size);
    this.settingsService.setBoardSize(size);
  }

  restoreSize() {
    const { boardSize } = this.settingsService.getSettings();
    this.settingsForm.setValue({ size: boardSize });
    this.stateService.setSize(boardSize);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { NbComponentOrCustomStatus } from '@nebular/theme';
import { TileValue } from '../board/board-state.service';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileComponent {
  @Input()
  value: TileValue = 'empty';

  @Output()
  clicked = new EventEmitter();

  get effectiveStatus(): NbComponentOrCustomStatus {
    if (this.value === 'empty') {
      return 'basic';
    }

    return this.value === 'X' ? 'primary' : 'success';
  }

  onClicked = () => this.clicked.emit();
}

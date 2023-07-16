import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
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

  onClicked = () => this.clicked.emit();
}

import { Component, Input, OnInit } from '@angular/core';
import { CupIcon } from 'src/shared/models/cup-icon';

@Component({
  selector: 'app-cup-icon',
  templateUrl: './cup-icon.component.html',
})
export class CupIconComponent implements OnInit {

  readonly cupIcon = CupIcon;

  constructor() { }

  ngOnInit(): void {
  }

  @Input() size!: string;
}

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.scss'
})
export class LightboxComponent {
  
  @Input() imageUrl:string = '';
  @Input() visible:boolean = false;

  close() {
    this.visible = false;
    
  }
}

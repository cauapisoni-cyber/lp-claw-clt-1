import { Component, OnInit, AfterViewInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-landing-two',
  standalone: true,
  templateUrl: './landing-two.component.html',
  imports: [DecimalPipe],
  styleUrls: ['./landing-two.component.css']
})
export class LandingTwoComponent implements OnInit, AfterViewInit {
  count1 = 0;
  count2 = 0;
  count3 = 0;
  count4 = 0;

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Nada aqui, a animação deve começar após o carregamento da view
  }

  ngAfterViewInit(): void {
    // Executa as animações apenas após o render da view
    this.ngZone.runOutsideAngular(() => {
      this.animateCount('count1', 100, 2000);
      this.animateCount('count2', 6000, 2000);
      this.animateCount('count3', 140, 2000);
      this.animateCount('count4', 100, 2000);
    });
  }

  private animateCount(property: keyof LandingTwoComponent, target: number, duration: number): void {
    const frameRate = 20;
    const totalFrames = duration / frameRate;
    const increment = target / totalFrames;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;

      if (current >= target) {
        current = target;
        clearInterval(interval);
      }

      // Atualiza dentro do Angular (garantindo atualização da view)
      this.ngZone.run(() => {
        (this as any)[property] = Math.floor(current);
        this.cdr.detectChanges();
      });
    }, frameRate);
  }
}

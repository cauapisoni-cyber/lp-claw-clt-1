import { Component, OnInit, AfterViewInit, NgZone, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DecimalPipe, CommonModule } from '@angular/common';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

interface Testimonial {
  name: string;
  text: string;
  stars: number;
}

@Component({
  selector: 'app-landing-two',
  standalone: true,
  templateUrl: './landing-two.component.html',
  imports: [DecimalPipe, CommonModule],
  styleUrls: ['./landing-two.component.css']
})
export class LandingTwoComponent implements OnInit, AfterViewInit, OnDestroy {
  count1 = 0;
  count2 = 0;
  count3 = 0;
  count4 = 0;
  currentIndex = 0;
  visibleCount = 3;
  autoSlideInterval: any;
  alias: string | null = null;
  variant: string | null = null;


  testimonials = [
    { name: 'Joao Victor', text: 'Empresa que realmente cumpre com o que promete. Podem confiar. Eu precisei deles e fui super bem atendido e tive o meu recebimento ok. todos sao muito atenciosos com você. Obg à equipe, forte abraço', stars: 5 },
    { name: 'Joaquim Santos', text: 'Fiquei impressionado com todo serviço, muito acima das minhas expectativas! O atendimento muito bom, foram bem pacientes e esclareceram muito minhas dúvidas (Atendente Márcio). Mesmo eu estando em um dia corrido e com demora para responder, tudo ocorreu bem.', stars: 5 },
    { name: 'Pab Pab', text: 'A melhor empresa do mundo que eu já vi rápido fácil prático esse pessoal é abençoado por Deus não tem como eu estou sem acreditar até agora fui sacar meu FGTS e no mesmo dia eu peguei o dinheiro que Deus abençoe vocês.', stars: 5 },
    { name: 'Antônionilson Nilson', text: 'No começo não confiei 100 por cento, mas quando o dinheiro caiu na minha conta em menos de 24 horas, percebi que é 100 por cento confiável. Recomendo Claw Express, e quem me atendeu foi o Gabriel, muito obrigado.', stars: 5 },
    { name: 'Nagela Micaele Ferreira Souza', text: 'Eles me ajudaram pela segunda vez! Serviço excelente, sem dúvidas. O que eu mais gostei foi a agilidade nos dois processos. Recebi o dinheiro em instantes. Conheci através de uma indicação no YouTube do canal "Você sabia?". Testei e aprovei, eu super indico!', stars: 5 },
    { name: 'Lorram Feliciano', text: 'Ótimo atendimento o melhor até hoje sem enrolação, bem eficiente, obrigado toda a equipe, estão de parabéns.', stars: 5 },
    { name: 'Fsbrício Santanana', text: 'Eu fui muito bem atendido, pode confirmar que dá tudo certo, eles são umas ótimas pessoas.', stars: 5 },
    { name: 'Nathalia Lino Silva', text: 'Entrei achando que não ia dar certo e em menos de 10 minutos o dinheiro caiu na conta, são super atenciosos, amei!', stars: 5 },
    { name: 'Taynara Furtado', text: 'Hoje fui atendida por um rapaz que se chama Rodrigo. Está de parabéns pelo atendimento, explica tudo certinho, e caiu certinho o FGTS. Não é a primeira vez que saco, já é a terceira vez e sempre deu certo. GRATIDÃO! DEUS ABENÇOE A TODOS!', stars: 5 },
    { name: 'Nelimar Guerrero', text: 'Bom dia, saudações. Muito obrigada pela sua gentileza e dedicação. Sou muito grata. Muitas bênçãos para você. Você pode usar 100% dos recursos que lhe foram confiados com confiança.', stars: 5 },
    { name: 'Alan Gomes Pereira', text: 'Deu tudo certo, excelente atendimento, no início fiquei meio receoso, mas confiei no trabalho deles e só alegria, caiu certinho. Muito obrigado!', stars: 5 },
    { name: 'Sarah Rodrigues', text: 'Só tenho a agradecer, sinceramente pensei que era golpe. Pois não é. É verdade, pode confiar, site confiável. A equipe maravilhosamente atenciosa. Caiu apenas em 15 minutos na minha conta. Agradecida.', stars: 5 },
    { name: 'Ruan Calitri', text: 'Foi uma indicação que vi em um vídeo do canal "Você Sabia". Muito boa, eles dão todo suporte até a finalização. Nada a reclamar.', stars: 5 },
    { name: 'Claudier Bueno', text: 'Não conhecia o serviço e acabei vindo por indicação. Fui muito bem atendido e o dinheiro caiu corretamente em minha conta.', stars: 5 },
    { name: 'Marcio Araújo Andrade', text: 'Eu vim aqui agradecer pelo carinho e atenção do nosso atendente, uma pessoa muito simpática e educada.', stars: 5 },
    { name: 'Davi Djs', text: 'Minha experiência foi ótima de verdade, é um ótimo atendimento e em menos de 10 minutos meu problema foi resolvido.', stars: 5 },
    { name: 'Tawana Reis', text: 'Estão de parabéns. Muito educados e resolveram meu problema, saquei meu FGTS rápido. Empresa de confiança, podem ir sem medo.', stars: 5 },
    { name: 'Joao Victor', text: 'Empresa que realmente cumpre com o que promete. Podem confiar. Eu precisei deles e fui super bem atendido e tive o meu recebimento ok. todos sao muito atenciosos com você. Obg à equipe, forte abraço', stars: 5 },
    { name: 'Joaquim Santos', text: 'Fiquei impressionado com todo serviço, muito acima das minhas expectativas! O atendimento muito bom, foram bem pacientes e esclareceram muito minhas dúvidas (Atendente Márcio). Mesmo eu estando em um dia corrido e com demora para responder, tudo ocorreu bem.', stars: 5 },
    { name: 'Pab Pab', text: 'A melhor empresa do mundo que eu já vi rápido fácil prático esse pessoal é abençoado por Deus não tem como eu estou sem acreditar até agora fui sacar meu FGTS e no mesmo dia eu peguei o dinheiro que Deus abençoe vocês.', stars: 5 },
    { name: 'Antônionilson Nilson', text: 'No começo não confiei 100 por cento, mas quando o dinheiro caiu na minha conta em menos de 24 horas, percebi que é 100 por cento confiável. Recomendo Claw Express, e quem me atendeu foi o Gabriel, muito obrigado.', stars: 5 },
    { name: 'Nagela Micaele Ferreira Souza', text: 'Eles me ajudaram pela segunda vez! Serviço excelente, sem dúvidas. O que eu mais gostei foi a agilidade nos dois processos. Recebi o dinheiro em instantes. Conheci através de uma indicação no YouTube do canal "Você sabia?". Testei e aprovei, eu super indico!', stars: 5 },
    { name: 'Lorram Feliciano', text: 'Ótimo atendimento o melhor até hoje sem enrolação, bem eficiente, obrigado toda a equipe, estão de parabéns.', stars: 5 },
    { name: 'Fsbrício Santanana', text: 'Eu fui muito bem atendido, pode confirmar que dá tudo certo, eles são umas ótimas pessoas.', stars: 5 },
    { name: 'Nathalia Lino Silva', text: 'Entrei achando que não ia dar certo e em menos de 10 minutos o dinheiro caiu na conta, são super atenciosos, amei!', stars: 5 },
    { name: 'Taynara Furtado', text: 'Hoje fui atendida por um rapaz que se chama Rodrigo. Está de parabéns pelo atendimento, explica tudo certinho, e caiu certinho o FGTS. Não é a primeira vez que saco, já é a terceira vez e sempre deu certo. GRATIDÃO! DEUS ABENÇOE A TODOS!', stars: 5 },
    { name: 'Nelimar Guerrero', text: 'Bom dia, saudações. Muito obrigada pela sua gentileza e dedicação. Sou muito grata. Muitas bênçãos para você. Você pode usar 100% dos recursos que lhe foram confiados com confiança.', stars: 5 },
    { name: 'Alan Gomes Pereira', text: 'Deu tudo certo, excelente atendimento, no início fiquei meio receoso, mas confiei no trabalho deles e só alegria, caiu certinho. Muito obrigado!', stars: 5 },
    { name: 'Sarah Rodrigues', text: 'Só tenho a agradecer, sinceramente pensei que era golpe. Pois não é. É verdade, pode confiar, site confiável. A equipe maravilhosamente atenciosa. Caiu apenas em 15 minutos na minha conta. Agradecida.', stars: 5 },
    { name: 'Ruan Calitri', text: 'Foi uma indicação que vi em um vídeo do canal "Você Sabia". Muito boa, eles dão todo suporte até a finalização. Nada a reclamar.', stars: 5 },
    { name: 'Claudier Bueno', text: 'Não conhecia o serviço e acabei vindo por indicação. Fui muito bem atendido e o dinheiro caiu corretamente em minha conta.', stars: 5 },
    { name: 'Marcio Araújo Andrade', text: 'Eu vim aqui agradecer pelo carinho e atenção do nosso atendente, uma pessoa muito simpática e educada.', stars: 5 },
    { name: 'Davi Djs', text: 'Minha experiência foi ótima de verdade, é um ótimo atendimento e em menos de 10 minutos meu problema foi resolvido.', stars: 5 },
    { name: 'Tawana Reis', text: 'Estão de parabéns. Muito educados e resolveram meu problema, saquei meu FGTS rápido. Empresa de confiança, podem ir sem medo.', stars: 5 }
  ];

  constructor(private router: Router, private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.extrairAliasEVariavel(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.extrairAliasEVariavel(e.urlAfterRedirects));
    this.ngZone.runOutsideAngular(() => {
      this.autoSlideInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.next();
          this.cdr.detectChanges();
        });
      }, 3000);
    });
  }

  private getFirstSegmentFromUrl(url: string): string | null {
    const clean = url.split('?')[0].split('#')[0]; // remove query e hash
    const first = clean.replace(/^\/+/, '').split('/')[0];
    return first || null;
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.animateCount('count1', 100, 2000);
      this.animateCount('count2', 6000, 2000);
      this.animateCount('count3', 140, 2000);
      this.animateCount('count4', 100, 2000);
    });
  }

  private extrairAliasEVariavel(url: string): void {
    const clean = url.split('?')[0].split('#')[0];
    const first = clean.replace(/^\/+/, '').split('/')[0];
    const [alias, variant] = first.split(':');
    this.alias = alias || null;
    this.variant = variant || null;
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

      this.ngZone.run(() => {
        (this as any)[property] = Math.floor(current);
        this.cdr.detectChanges();
      });
    }, frameRate);
  }

  get visibleTestimonials(): Testimonial[] {
    // garante que sempre exiba 3 depoimentos e reinicie corretamente
    const result = [];
    for (let i = 0; i < this.visibleCount; i++) {
      result.push(this.testimonials[(this.currentIndex + i) % this.testimonials.length]);
    }
    return result;
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  prev(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

  ngOnDestroy(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  abrirWhatsApp(): void {
    const prefix = `[${this.variant}]`;
    const text = `${prefix}Olá! Vim pelo site da Claw e gostaria de mais informações sobre o Crédito do Trabalhador!`;
    const url = `https://api.whatsapp.com/send/?phone=554830544121&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
    window.open(url, '_blank');
  }


}

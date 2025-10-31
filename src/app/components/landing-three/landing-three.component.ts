import { Component, OnInit, AfterViewInit, OnDestroy, NgZone, ChangeDetectorRef, inject } from '@angular/core';
import { DecimalPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { NgIf } from '@angular/common';

interface Testimonial {
  name: string;
  text: string;
  stars: number;
}

interface Credito {
  nome: string;
  cpf: string;
  whatsapp: string;
  carteira: string;
  tempoEmprego: string;
}

@Component({
  selector: 'app-landing-three',
  standalone: true,
  templateUrl: './landing-three.component.html',
  imports: [DecimalPipe, CommonModule, FormsModule, NgxMaskDirective, SpinnerComponent, NgIf],
  styleUrls: ['./landing-three.component.css']
})
export class LandingThreeComponent implements OnInit, AfterViewInit, OnDestroy {

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

  // ===== Lógica de crédito =====
  credito: Credito = {
    nome: '',
    cpf: '',
    whatsapp: '',
    carteira: 'Sim',
    tempoEmprego: '0 a 5 meses'
  };

  routeRedirect: string | null = null;
  loading = false;
  errors: any = {};
  submitting = false;
  errorMessage = '';
  elegivelMessage = '';
  mostrarBotaoZap = false;

  private apiService = inject(ApiService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  private naoElegivelTexto = `Verificamos sua consulta e, por enquanto, o seu CPF não se enquadra na política de crédito atual definida pelo banco parceiro.
Mas não se preocupe, em breve você poderá tentar novamente.
Enquanto isso, não fique de fora das novidades:
Acompanhe nossas redes sociais e fique por dentro de dicas, atualizações e oportunidades exclusivas sobre o Crédito do Trabalhador, e muito mais!
Não perca nenhuma novidade!💜`;

  constructor(private router: Router) {}

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

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.animateCount('count1', 100, 2000);
      this.animateCount('count2', 6000, 2000);
      this.animateCount('count3', 140, 2000);
      this.animateCount('count4', 100, 2000);
    });
  }

  ngOnDestroy(): void {
    if (this.autoSlideInterval) clearInterval(this.autoSlideInterval);
  }

  // ===== Helpers =====
  private animateCount(property: keyof LandingThreeComponent, target: number, duration: number): void {
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
    const result: Testimonial[] = [];
    for (let i = 0; i < this.visibleCount; i++) {
      result.push(this.testimonials[(this.currentIndex + i) % this.testimonials.length]);
    }
    return result;
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  prev(): void {
    this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

  private getFirstSegmentFromUrl(url: string): string | null {
    const clean = url.split('?')[0].split('#')[0];
    const first = clean.replace(/^\/+/, '').split('/')[0];
    return first || null;
  }

  // ===== Crédito =====
  validarCampos(): boolean {
    this.errors = {};
    let valido = true;

    const nome = (this.credito.nome || '').trim();
    const cpf = (this.credito.cpf || '').replace(/\D/g, '');
    const whats = (this.credito.whatsapp || '').replace(/\D/g, '');

    if (!nome || nome.length < 3) { this.errors.nome = 'Nome inválido'; valido = false; }
    if (!/^\d{11}$/.test(cpf)) { this.errors.cpf = 'CPF inválido (11 dígitos)'; valido = false; }
    if (!/^\d{10,11}$/.test(whats)) { this.errors.whatsapp = 'Número inválido'; valido = false; }

    this.credito.nome = nome;
    this.credito.cpf = cpf;
    this.credito.whatsapp = whats;

    return valido;
  }

  private mesesDeEmprego(): number {
    const t = (this.credito.tempoEmprego || '').toLowerCase();
    if (t.includes('mais de 1 ano')) return 12;
    if (t.includes('6 a 12 meses')) return 6;
    const m = t.match(/\d+/g);
    if (!m?.length) return 0;
    return Math.max(...m.map(n => parseInt(n, 10)));
  }

  enviarCredito(event?: Event): void {
    event?.preventDefault();
    if (!this.validarCampos()) return;

    this.loading = true;
    const meses = this.mesesDeEmprego();
    const temCarteira = this.credito.carteira === 'Sim';

    if (!temCarteira || meses < 6) {
      this.submitting = false;
      this.elegivelMessage = '';
      this.mostrarBotaoZap = false;
      this.errorMessage = this.naoElegivelTexto;
      this.loading = false;
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.elegivelMessage = '';
    this.mostrarBotaoZap = false;

    const body = {
      document: this.credito.cpf,
      phone: this.credito.whatsapp,
      originId: 2,
      code: '001',
      name: this.credito.nome,
      chatId: 'string',
      department: 68123
    };

    this.apiService.enviarCredito(body).subscribe({
      next: (res: any) => {
        this.ngZone.run(() => {
          if (res.elegivel) {
            this.elegivelMessage = ` 🎉 Parabéns! Seu crédito foi pré-aprovado!
Clique no botão abaixo e fale com nossa equipe pelo WhatsApp para concluir.`;
            this.mostrarBotaoZap = true;
            this.errorMessage = '';
          } else {
            this.errorMessage = this.naoElegivelTexto;
            this.elegivelMessage = '';
            this.mostrarBotaoZap = false;
            this.submitting = false;
          }

          this.credito = { nome: '', cpf: '', whatsapp: '', carteira: 'Sim', tempoEmprego: '0 a 5 meses' };
          this.loading = false;
          this.cdr.markForCheck();
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.submitting = false;
          this.errorMessage = 'Erro ao enviar. Tente novamente.';
          this.elegivelMessage = '';
          this.mostrarBotaoZap = false;
          this.cdr.markForCheck();
        });
      }
    });
  }

  private extrairAliasEVariavel(url: string): void {
    const clean = url.split('?')[0].split('#')[0];
    const first = clean.replace(/^\/+/, '').split('/')[0];
    const [alias, variant] = first.split(':');
    this.alias = alias || null;
    this.variant = variant || null;
  }

  abrirWhatsApp(): void {
    const prefix = `[${this.variant}]`;
    const text = `${prefix} Olá! Vim pelo site da Claw e gostaria de mais informações sobre o Crédito do Trabalhador!`;
    const url = `https://api.whatsapp.com/send/?phone=554830544121&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
    window.open(url, '_blank');
  }

}

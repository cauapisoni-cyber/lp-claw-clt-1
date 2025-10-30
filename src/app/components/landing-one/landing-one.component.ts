import {Component, inject, NgZone, ChangeDetectorRef, OnInit} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {NgxMaskDirective} from 'ngx-mask';

interface Credito {
  nome: string;
  cpf: string;
  whatsapp: string;
  carteira: string;
  tempoEmprego: string;
}

@Component({
  selector: 'app-landing-one',
  standalone: true,
  templateUrl: './landing-one.component.html',
  imports: [FormsModule, NgIf, NgxMaskDirective],
  styleUrls: ['./landing-one.component.css']
})
export class LandingOneComponent implements OnInit {

  credito: Credito = {
    nome: '',
    cpf: '',
    whatsapp: '',
    carteira: 'Sim',
    tempoEmprego: '0 a 5 meses'
  };

  routeRedirect: string | null = null;
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

  // pega o primeiro segmento da URL atual, ex.: "/L1/xyz" => "L1"; "/" => null
  private getFirstSegmentFromUrl(url: string): string | null {
    const clean = url.split('?')[0].split('#')[0]; // remove query e hash
    const first = clean.replace(/^\/+/, '').split('/')[0];
    return first || null;
  }

  ngOnInit(): void {
    // valor inicial ao carregar o componente
    this.routeRedirect = this.getFirstSegmentFromUrl(this.router.url);

    // atualiza quando a navegação termina
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.routeRedirect = this.getFirstSegmentFromUrl(this.router.url);
      });
  }

  validarCampos(): boolean {
    this.errors = {};
    let valido = true;

    const nome = (this.credito.nome || '').trim();
    const cpf = (this.credito.cpf || '').replace(/\D/g, '');
    const whats = (this.credito.whatsapp || '').replace(/\D/g, '');

    if (!nome || nome.length < 3) {
      this.errors.nome = 'Nome inválido';
      valido = false;
    }

    if (!/^\d{11}$/.test(cpf)) {
      this.errors.cpf = 'CPF inválido (somente números, 11 dígitos)';
      valido = false;
    }

    if (!/^\d{10,11}$/.test(whats)) {
      this.errors.whatsapp = 'Número inválido';
      valido = false;
    }

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

    const meses = this.mesesDeEmprego();
    const temCarteira = this.credito.carteira === 'Sim';
    if (!temCarteira || meses < 6) {
      this.submitting = false;
      this.elegivelMessage = '';
      this.mostrarBotaoZap = false;
      this.errorMessage = this.naoElegivelTexto;
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
        // Garante atualização do template mesmo se o callback vier fora da Angular Zone
        this.ngZone.run(() => {
          if (!!res.elegivel) {
            this.errorMessage = '';
            this.elegivelMessage = ` 🎉 Parabéns! Seu crédito foi pré-aprovado!
Você está muito perto de receber o valor na conta.
💬 Clique no botão abaixo e fale com nossa equipe pelo WhatsApp para concluir sua contratação agora mesmo.`;
            this.mostrarBotaoZap = true;
          } else {
            this.elegivelMessage = '';
            this.submitting = false;
            this.mostrarBotaoZap = false;
            this.errorMessage = this.naoElegivelTexto;
          }

          this.credito = {
            nome: '',
            cpf: '',
            whatsapp: '',
            carteira: 'Sim',
            tempoEmprego: '0 a 5 meses'
          };

          this.cdr.markForCheck();
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.submitting = false;
          this.elegivelMessage = '';
          this.mostrarBotaoZap = false;
          this.errorMessage = 'Erro ao enviar. Tente novamente.';
          this.cdr.markForCheck();
        });
      }
    });
  }

  abrirWhatsApp(): void {
    window.open(
      'https://api.whatsapp.com/send/?phone=554830544121&text=Ol%C3%A1%21+Vim+pelo+site+da+Claw+e+gostaria+de+mais+informa%C3%A7%C3%B5es+sobre+o+Cr%C3%A9dito+do+Trabalhador%21&type=phone_number&app_absent=0',
      '_blank'
    );
  }

  openWhatsappLink(): void {
    const prefix = this.routeRedirect ? `[${this.routeRedirect}] ` : '';
    const text = `${prefix}Olá! Vim pelo site da Claw e gostaria de mais informações sobre o Crédito do Trabalhador!`;
    const url =
      `https://api.whatsapp.com/send/?phone=554830544121&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;

    window.open(url, '_blank');
  }

}

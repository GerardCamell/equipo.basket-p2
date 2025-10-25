import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

type Match = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  quarter: string;
  timeSeconds: number;
  started: boolean;
  logoHome?: string;
  logoAway?: string;
  showDetail?: boolean;
  animateHome?: boolean;
  animateAway?: boolean;
  videoThumb?: string;
  videoUrl?: string;
  videoLocal?: string;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  // propiedades para el carrusel de highlights
  highlights: { thumb: string; title: string; match: Match }[] = [];
  activeHighlight = 0;
  private highlightInterval: any;

  // datos y estados principales
  matches: Match[] = [];
  private timers: Record<number, any> = {};
  private pulseTimeouts: Record<string, any> = {};
  heroExists = false;
  modalOpen = false;
  selectedVideo: { type: 'local' | 'youtube', src: string | SafeResourceUrl } | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    // comprueba si existe hero
    fetch('assets/hero-basket.jpg', { method: 'HEAD' })
      .then(resp => { this.heroExists = resp.ok; })
      .catch(() => { this.heroExists = false; });

    // datos de ejemplo
    this.matches = [
      {
        id: 1,
        homeTeam: 'Chicago Bulls',
        awayTeam: 'Washington Wizards',
        homeScore: 127,
        awayScore: 108,
        quarter: '3Q',
        timeSeconds: 540,
        started: true,
        logoHome: 'teamBadges/CHI.png',
        logoAway: 'teamBadges/WAS.svg',
        videoThumb: 'assets/chivswas.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=nGt3aVsNTAU'
      },
      {
        id: 2,
        homeTeam: 'Atlanta Hawks',
        awayTeam: 'Toronto Raptors',
        homeScore: 107,
        awayScore: 132,
        quarter: '1Q',
        timeSeconds: 600,
        started: false,
        logoHome: 'teamBadges/ATL.svg',
        logoAway: 'teamBadges/TOR.svg',
        videoThumb: 'assets/atlvstor.jpg',
        //videoLocal: 'assets/videos/highlight-bos-mia.mp4'
        videoUrl: 'https://www.youtube.com/watch?v=CfF7p0S2G2U'
      },
      {
        id: 3,
        homeTeam: 'Golden State Warriors',
        awayTeam: 'Brooklyn Nets',
        homeScore: 121,
        awayScore: 117,
        quarter: '1Q',
        timeSeconds: 720,
        started: false,
        logoHome: 'teamBadges/GSW.svg',
        logoAway: 'teamBadges/BKN.svg',
        videoThumb: 'assets/gswvsbkn.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=GubvfgQ0vSE'
      }
    ];

    // iniciar timers para matches que ya estaban en started
    this.matches.forEach(m => {
      if (m.started && !this.timers[m.id]) {
        this.timers[m.id] = setInterval(() => this.tick(m), 1000);
      }
    });

    // inicializar highlights a partir de los matches
    this.highlights = this.matches
      .filter(m => m.videoThumb || m.videoUrl || m.videoLocal)
      .map(m => ({
        thumb: m.videoThumb || 'assets/videos/placeholder-thumb.jpg',
        title: `${m.homeTeam} · ${m.awayTeam}`,
        match: m
      }));

    // autoplay del carrusel
    this.highlightInterval = setInterval(() => {
      if (this.highlights.length) {
        this.activeHighlight = (this.activeHighlight + 1) % this.highlights.length;
      }
    }, 4000);
  }

  // scroll suave hasta la grid de partidos
  scrollToMatches() {
    const el = document.querySelector('.row.g-3');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // destacar y desplazar al card del match
  focusMatch(m: Match) {
    const selector = `[data-match-id="${m.id}"]`;
    const el = document.querySelector(selector) as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('highlight-pulse');
      setTimeout(() => el.classList.remove('highlight-pulse'), 1400);
    }
  }

  startStop(m: Match) {
    if (m.started) {
      this.stopTimer(m);
      m.started = false;
    } else {
      if (!this.timers[m.id]) {
        this.timers[m.id] = setInterval(() => this.tick(m), 1000);
      }
      m.started = true;
    }
  }

  private stopTimer(m: Match) {
    const t = this.timers[m.id];
    if (t) {
      clearInterval(t);
      delete this.timers[m.id];
    }
  }

  private tick(m: Match) {
    if (m.quarter === 'FT') {
      this.stopTimer(m);
      m.started = false;
      return;
    }
    if (m.timeSeconds > 0) {
      m.timeSeconds--;
    } else {
      const next = this.nextQuarter(m.quarter);
      m.quarter = next;
      if (next === 'FT') {
        m.timeSeconds = 0;
        this.stopTimer(m);
        m.started = false;
      } else {
        m.timeSeconds = 720;
      }
    }
  }

  resetMatch(m: Match) {
    this.stopTimer(m);
    m.started = false;
    m.timeSeconds = 720;
    m.homeScore = 0;
    m.awayScore = 0;
    m.quarter = 'PREGAME';
  }

  nextQuarter(q: string) {
    const order = ['PREGAME','1Q','2Q','3Q','4Q','OT','FT'];
    const idx = order.indexOf(q);
    if (idx < 0) return '1Q';
    if (idx >= order.length - 1) return 'FT';
    return order[idx + 1];
  }

  formatTime(sec: number) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  addScore(m: Match, side: 'home' | 'away', pts: number) {
    if (side === 'home') {
      m.homeScore += pts;
      this.flash(m, 'home');
    } else {
      m.awayScore += pts;
      this.flash(m, 'away');
    }
  }

  flash(m: Match, side: 'home' | 'away') {
    const key = `${m.id}_${side}`;
    if (this.pulseTimeouts[key]) {
      clearTimeout(this.pulseTimeouts[key]);
      delete this.pulseTimeouts[key];
    }
    if (side === 'home') m.animateHome = true; else m.animateAway = true;
    this.pulseTimeouts[key] = setTimeout(() => {
      if (side === 'home') m.animateHome = false; else m.animateAway = false;
      delete this.pulseTimeouts[key];
    }, 350);
  }

  toggleDetail(m: Match) { m.showDetail = !m.showDetail; }

  openVideo(m: Match) {
    if (m.videoLocal) {
      this.selectedVideo = { type: 'local', src: m.videoLocal };
      this.modalOpen = true;
      return;
    }
    if (m.videoUrl) {
      const embed = this.normalizeYoutubeToEmbed(m.videoUrl);
      const safe: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embed);
      this.selectedVideo = { type: 'youtube', src: safe };
      this.modalOpen = true;
      return;
    }
  }

  private normalizeYoutubeToEmbed(url: string): string {
    if (url.includes('embed/')) return url + '?autoplay=1&rel=0';
    let id = '';
    try {
      if (url.includes('youtu.be/')) {
        id = url.split('youtu.be/')[1].split(/[?&]/)[0];
      } else if (url.includes('watch')) {
        const params = new URLSearchParams(url.split('?')[1] || '');
        id = params.get('v') || '';
      } else if (/^[A-Za-z0-9_-]{11}$/.test(url)) {
        id = url;
      } else {
        id = url.split('/').pop() || url;
      }
    } catch {
      id = url;
    }
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  }

  closeModal(e?: Event) {
    this.modalOpen = false;
    this.selectedVideo = null;
  }

  // handler para errores de carga de logos (fallback)
  onLogoError(e: Event, m: Match, side: 'home'|'away') {
    const img = e.target as HTMLImageElement;
    img.onerror = null;
    img.src = 'assets/teamBadges/placeholder.svg';
    if (side === 'home') m.logoHome = img.src; else m.logoAway = img.src;
  }

  trackById(_: number, m: Match) {
    return m.id;
  }

  ngOnDestroy() {
    Object.values(this.timers).forEach(t => clearInterval(t));
    Object.values(this.pulseTimeouts).forEach(t => clearTimeout(t));
    if (this.highlightInterval) {
      clearInterval(this.highlightInterval);
      this.highlightInterval = null;
    }
    this.timers = {};
    this.pulseTimeouts = {};
  }
}

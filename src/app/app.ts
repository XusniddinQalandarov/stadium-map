import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Stadium, District } from './models/stadium.interface';
import { StadiumService } from './services/stadium.service';
import { AuthService } from './services/auth.service';
import { appConfig } from './config/app.config';
import { appConfigLocal } from './config/app.config.local';

declare var ymaps: any;

interface StadiumPlacemark {
  geometry: [number, number];
  properties: {
    balloonContentHeader: string;
    // allow either balloonContentBody/footer OR balloonContent (full HTML)
    balloonContentBody?: string;
    balloonContentFooter?: string;
    balloonContent?: string;
    balloonInfo?: string;
    iconCaption: string;
  };
  options: {
    preset: string;
    iconColor: string;
  };
  images?: string[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  private stadiumService = inject(StadiumService);
  private authService = inject(AuthService);
  private router = inject(Router);

  mapCenter: [number, number] = [41.2866, 69.3107];
  map: any;
  private balloonContentLayout: any;

  stadiums: Stadium[] = [];
  filteredStadiums: Stadium[] = [];
  stadiumPlacemarks: StadiumPlacemark[] = [];

  selectedDistrict: string = 'ALL';
  districts: string[] = [];

  readonly District = District;
  totalFields = 0;

  ngOnInit() {
    this.loadYandexMapsScript();
    this.loadStadiums();
    this.setupDistrictFilter();
  }

  ngAfterViewInit() {
  }

  private loadYandexMapsScript() {
    if (typeof ymaps !== 'undefined') {
      this.initMap();
      return;
    }

    const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        this.initMap();
      });
      return;
    }

    const script = document.createElement('script');
    const config = appConfigLocal.yandexMapsApiKey ? appConfigLocal : appConfig;
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${config.yandexMapsApiKey}&lang=ru_RU`;
    script.onload = () => {
      this.initMap();
    };
    document.head.appendChild(script);
  }

  private loadStadiums() {
    this.stadiums = this.stadiumService.getStadiums();
    this.filteredStadiums = [...this.stadiums];
    this.totalFields = this.stadiumService.getTotalFieldCount();
    this.createPlacemarks();
  }

  private setupDistrictFilter() {
    this.districts = ['ALL', ...Object.values(District)];
  }

  private createPlacemarks() {
    const defaultImages = [
      '/assets/images/photo_1.jpg',
      '/assets/images/photo_2.jpg',
      '/assets/images/photo_3.jpg',
      '/assets/images/photo_4.jpg'
    ];

    this.stadiumPlacemarks = this.filteredStadiums.map((stadium, idx) => {
      // Use images only when provided by the stadium data. Other stadiums won't show a carousel.
      const images: string[] = (stadium as any).images ?? [];

      const infoHtml = `
        <div class="balloon-item">
          <span class="balloon-label">🏟️ Район</span>
          <span class="balloon-value">${stadium.district}</span>
        </div>
        <div class="balloon-item">
          <span class="balloon-label">⚽ Количество полей</span>
          <span class="balloon-value">${stadium.fieldCount}</span>
        </div>
        <div class="balloon-coordinates">
          <span class="balloon-label">📍 Координаты</span>
          <span class="balloon-value">${stadium.coordinates[0].toFixed(6)}, ${stadium.coordinates[1].toFixed(6)}</span>
        </div>
      `;

      // Build full balloon HTML (images + info) and put into a single property 'balloonContent'
      const imagesHtml = images.length ? images.map(src => `<img src="${src}" class="balloon-img" alt="Стадион" />`).join('') : '';
      const carouselHtml = images.length ? `
          <div class="balloon-carousel">
            <button class="balloon-prev" aria-label="Previous">‹</button>
            <div class="balloon-carousel-track">${imagesHtml}</div>
            <button class="balloon-next" aria-label="Next">›</button>
          </div>
      ` : '';

      const fullBalloon = `
        <div class="modern-balloon">
          ${carouselHtml}
          <div class="balloon-content">
            ${infoHtml}
          </div>
        </div>
      `;

      return {
        geometry: stadium.coordinates,
        properties: (() => {
          const p: any = {
            balloonContentHeader: stadium.address,
            balloonInfo: infoHtml,
            iconCaption: `${stadium.fieldCount}`
          };
          // For stadiums without images, also provide balloonContentBody so Yandex's default layout can render it
          if (images.length === 0) {
            p.balloonContentBody = infoHtml;
            // keep balloonContent too for safety, but body will be used by default layout
            p.balloonContent = fullBalloon;
          } else {
            p.balloonContent = fullBalloon;
          }
          return p;
        })(),
        images: images,
        options: {
          preset: 'islands#geolocationIcon',
          iconColor: '#4CAF50'
        }
      } as StadiumPlacemark;
    });
  }

  getDistrictFieldCount(district: string): number {
    if (district === 'ALL') {
      return this.totalFields;
    }
    return this.stadiumService.getDistrictFieldCount(district as District);
  }

  selectDistrict(district: string) {
    this.selectedDistrict = district;
    this.filterStadiums();
  }

  getTotalFilteredFields(): number {
    return this.filteredStadiums.reduce((sum, stadium) => sum + stadium.fieldCount, 0);
  }

  private filterStadiums() {
    if (this.selectedDistrict === 'ALL') {
      this.filteredStadiums = [...this.stadiums];
    } else {
      this.filteredStadiums = this.stadiums.filter(stadium =>
        stadium.district === this.selectedDistrict
      );
    }
    this.createPlacemarks();
    this.updateMap();
  }

  private updateMap() {
    if (this.map) {
      this.map.geoObjects.removeAll();
      this.addPlacemarksToMap();
    }
  }

  private addPlacemarksToMap() {
    this.stadiumPlacemarks.forEach(placemark => {
      // If this placemark has images we'll use the custom balloonContentLayout for full HTML
      const markOptions = Object.assign({}, placemark.options || {}, {
        balloonPanelMaxMapArea: 0,
        openBalloonOnClick: false
      });
      if (placemark.images && placemark.images.length) {
        (markOptions as any).balloonContentLayout = this.balloonContentLayout;
      }

      const mark = new ymaps.Placemark(
        placemark.geometry,
        // supply the properties directly (body/footer created in createPlacemarks)
        placemark.properties,
        markOptions
      );

      mark.events.add('click', () => {
        // center map
        this.map.setCenter(placemark.geometry, 16, {
          duration: 500
        });

        // If this placemark has images, open our custom overlay/modal (single modal).
        // Otherwise open the regular Yandex balloon which contains info only.
        if (placemark.images && placemark.images.length) {
          try {
            if (mark && mark.balloon && typeof mark.balloon.close === 'function') {
              mark.balloon.close();
            }
          } catch (e) {
            // ignore
          }
          this.openCarouselOverlay(placemark.images, placemark.properties.balloonInfo || '', placemark.properties.balloonContentHeader || '');
        } else {
          // open the lightweight Yandex balloon (info-only)
          try {
            if (mark && mark.balloon && typeof mark.balloon.open === 'function') {
              mark.balloon.open();
            }
          } catch (e) {
            console.warn('Failed to open placemark balloon', e);
          }
        }
      });

      this.map.geoObjects.add(mark);
    });
  }

  initMap() {
    ymaps.ready(() => {
      this.map = new ymaps.Map('map', {
        center: this.mapCenter,
        zoom: 11.5,
        controls: ['zoomControl', 'fullscreenControl']
      });

      // create content layout used to render `properties.balloonContent` safely
      this.createBalloonContentLayout();

      this.addPlacemarksToMap();

      // attach one global delegated listener for carousel controls inside balloons
      if (!(<any>window)._stadiumBalloonListenerAdded) {
        document.addEventListener('click', (ev: MouseEvent) => this.handleGlobalCarouselClick(ev as any));
        (<any>window)._stadiumBalloonListenerAdded = true;
      }
    });
  }



  private createBalloonContentLayout() {
    if (!ymaps || !ymaps.templateLayoutFactory) return;

    // Create a lightweight balloon layout and set its inner HTML in build()
    const layoutHtml = `<div class="modern-balloon"><div class="balloon-inner"></div></div>`;
    const self = this;
    this.balloonContentLayout = ymaps.templateLayoutFactory.createClass(layoutHtml, {
      build: function () {
        // Call parent build
        (this.constructor as any).superclass.build.call(this);
        try {
          const parent = this.getParentElement();
          if (parent) {
            const inner = parent.querySelector('.balloon-inner') as HTMLElement | null;
            if (inner) {
              const content = (this.getData && this.getData().properties && this.getData().properties.balloonContent) || '';
              inner.innerHTML = content;
            }
          }
        } catch (e) {
          console.error('Error building balloon content layout', e);
        }
      },
      clear: function () {
        try {
          // remove any dynamic content if needed
          const parent = this.getParentElement();
          if (parent) {
            const inner = parent.querySelector('.balloon-inner') as HTMLElement | null;
            if (inner) inner.innerHTML = '';
          }
        } catch (e) {
          console.error('Error clearing balloon content layout', e);
        }
        (this.constructor as any).superclass.clear.call(this);
      }
    });
  }

  private handleGlobalCarouselClick(ev: MouseEvent) {
    const target = ev.target as HTMLElement | null;
    if (!target) return;

    const btn = target.closest('.balloon-next, .balloon-prev') as HTMLElement | null;
    if (!btn) return;

    const balloon = btn.closest('.modern-balloon') as HTMLElement | null;
    if (!balloon) return;

    const track = balloon.querySelector('.balloon-carousel-track') as HTMLElement | null;
    if (!track) return;

    const img = track.querySelector('.balloon-img') as HTMLElement | null;
    const gap = 8;
    const step = (img ? img.clientWidth : 120) + gap;

    if (btn.classList.contains('balloon-next')) {
      track.scrollBy({ left: step, behavior: 'smooth' });
    } else if (btn.classList.contains('balloon-prev')) {
      track.scrollBy({ left: -step, behavior: 'smooth' });
    }
  }

  // --- simple DOM overlay carousel (avoids balloon/template issues) ---
  private _overlayEl: HTMLElement | null = null;
  private _overlayImgIndex = 0;
  private _overlayKeydownHandler: ((e: KeyboardEvent) => void) | null = null;

  openCarouselOverlay(images: string[], info?: string, title?: string) {
    this.closeCarouselOverlay();
    this._overlayImgIndex = 0;
    const overlay = document.createElement('div');
    // add essential inline styles to guarantee visibility even if CSS isn't loaded
    overlay.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:2000;';
    overlay.className = 'stadium-carousel-overlay';

    // backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'stadium-carousel-backdrop';
    backdrop.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.5);';
    overlay.appendChild(backdrop);

    // box
    const box = document.createElement('div');
    box.className = 'stadium-carousel-box';
    box.style.cssText = 'position:relative;background:white;border-radius:12px;padding:18px;max-width:720px;width:calc(100% - 40px);box-shadow:0 20px 60px rgba(0,0,0,0.4);z-index:2001;';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'stadium-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = 'position:absolute;right:10px;top:8px;background:none;border:none;font-size:26px;cursor:pointer;';
    box.appendChild(closeBtn);

    const inner = document.createElement('div');
    inner.className = 'stadium-carousel-inner';
    inner.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:12px;';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'stadium-prev';
    prevBtn.textContent = '‹';
    prevBtn.style.cssText = 'width:48px;height:48px;border-radius:50%;border:none;background:white;box-shadow:0 6px 20px rgba(0,0,0,0.12);cursor:pointer;font-size:28px;';

    const imgWrap = document.createElement('div');
    imgWrap.className = 'stadium-image-wrap';
    imgWrap.style.cssText = 'width:520px;max-width:100%;height:360px;display:flex;align-items:center;justify-content:center;overflow:hidden;';

    const imgEl = document.createElement('img');
    imgEl.className = 'stadium-overlay-img';
    imgEl.src = images[0];
    imgEl.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:8px;';
    imgWrap.appendChild(imgEl);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'stadium-next';
    nextBtn.textContent = '›';
    nextBtn.style.cssText = 'width:48px;height:48px;border-radius:50%;border:none;background:white;box-shadow:0 6px 20px rgba(0,0,0,0.12);cursor:pointer;font-size:28px;';

    inner.appendChild(prevBtn);
    inner.appendChild(imgWrap);
    inner.appendChild(nextBtn);

    box.appendChild(inner);

    const counter = document.createElement('div');
    counter.className = 'stadium-carousel-counter';
    counter.textContent = `1 / ${images.length}`;
    counter.style.cssText = 'text-align:center;margin-top:12px;color:#333;font-weight:600;';
    box.appendChild(counter);

    // info / description below images
    const infoDiv = document.createElement('div');
    infoDiv.className = 'stadium-info';
    infoDiv.style.cssText = 'margin-top:12px;color:#333;line-height:1.4;';
    infoDiv.innerHTML = info || '';
    box.appendChild(infoDiv);

    // optional title shown above images
    if (title) {
      const titleEl = document.createElement('div');
      titleEl.className = 'stadium-overlay-title';
      titleEl.textContent = title;
      titleEl.style.cssText = 'font-weight:700;font-size:1.05rem;margin-bottom:8px;color:#223;';
      // insert title before inner
      box.insertBefore(titleEl, box.firstChild);
    }

    overlay.appendChild(box);

    document.body.appendChild(overlay);
    this._overlayEl = overlay;

    // handlers
    closeBtn.addEventListener('click', () => this.closeCarouselOverlay());
    backdrop.addEventListener('click', () => this.closeCarouselOverlay());
    prevBtn.addEventListener('click', () => this._carouselPrev(images));
    nextBtn.addEventListener('click', () => this._carouselNext(images));

    // allow ESC to close
    this._overlayKeydownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') this.closeCarouselOverlay();
    };
    document.addEventListener('keydown', this._overlayKeydownHandler);
  }

  private _carouselNext(images: string[]) {
    if (!this._overlayEl) return;
    this._overlayImgIndex = Math.min(this._overlayImgIndex + 1, images.length - 1);
    this._updateOverlayImage(images);
  }

  private _carouselPrev(images: string[]) {
    if (!this._overlayEl) return;
    this._overlayImgIndex = Math.max(this._overlayImgIndex - 1, 0);
    this._updateOverlayImage(images);
  }

  private _updateOverlayImage(images: string[]) {
    if (!this._overlayEl) return;
    const img = this._overlayEl.querySelector('.stadium-overlay-img') as HTMLImageElement | null;
    const counter = this._overlayEl.querySelector('.stadium-carousel-counter') as HTMLElement | null;
    if (img) img.src = images[this._overlayImgIndex];
    if (counter) counter.textContent = `${this._overlayImgIndex + 1} / ${images.length}`;
  }

  closeCarouselOverlay() {
    if (!this._overlayEl) return;
    this._overlayEl.remove();
    this._overlayEl = null;
    if (this._overlayKeydownHandler) {
      document.removeEventListener('keydown', this._overlayKeydownHandler);
      this._overlayKeydownHandler = null;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

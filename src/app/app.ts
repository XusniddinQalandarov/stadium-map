import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Stadium, District } from './models/stadium.interface';
import { StadiumService } from './services/stadium.service';
import { AuthService } from './services/auth.service';
import { appConfig } from './config/app.config';

declare var ymaps: any;

interface StadiumPlacemark {
  geometry: [number, number];
  properties: {
    balloonContentHeader: string;
    balloonContentBody: string;
    iconCaption: string;
  };
  options: {
    preset: string;
    iconColor: string;
  };
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
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${appConfig.yandexMapsApiKey}&lang=ru_RU`;
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
    this.stadiumPlacemarks = this.filteredStadiums.map(stadium => ({
      geometry: stadium.coordinates,
      properties: {
        balloonContentHeader: stadium.address,
        balloonContentBody: `
          <div class="modern-balloon">
            <div class="balloon-content">
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
            </div>
          </div>
        `,
        iconCaption: `${stadium.fieldCount}`
      },
      options: {
        preset: 'islands#geolocationIcon',
        iconColor: '#4CAF50'
      }
    }));
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
      const mark = new ymaps.Placemark(
        placemark.geometry,
        placemark.properties,
        placemark.options
      );

      mark.events.add('click', () => {
        this.map.setCenter(placemark.geometry, 16, {
          duration: 500
        });
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

      this.addPlacemarksToMap();
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

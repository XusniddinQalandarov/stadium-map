import { Injectable } from '@angular/core';
import { Stadium, District } from '../models/stadium.interface';

@Injectable({
  providedIn: 'root'
})
export class StadiumService {
  private stadiums: Stadium[] = [
    // Мирабадский район
    { district: District.MIRABADSKY, coordinates: [41.304659, 69.273128], address: 'Sharof Rashidov mahalla fuqarolar yigʻini', fieldCount: 2 },
    { district: District.MIRABADSKY, coordinates: [41.296141, 69.283567], address: 'Oybek mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.276391, 69.273467], address: 'Zaminobod mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.274539, 69.281061], address: 'Banokatiy mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.273638, 69.291059], address: 'Banokatiy mahalla fuqarolar yigʻin', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.282219, 69.288898], address: 'Istiqlolobod mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.281454, 69.288678], address: 'Istiqlolobod mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.278309, 69.287130], address: 'Sarikoʻl koʻchasi, 9A', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.269221, 69.294840], address: 'Sarikoʻl mahalla fuqarolar yigʻini', fieldCount: 2 },
    { district: District.MIRABADSKY, coordinates: [41.265823, 69.296536], address: 'Sarikoʻl mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.266719, 69.296028], address: 'Sarikoʻl mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.268430, 69.301706], address: 'Qorasuv mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.274949, 69.298158], address: 'Yangizamon 4-tor ko\'chasi', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.275171, 69.302393], address: 'Furqat mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.272989, 69.305855], address: 'Oltinko\'l 2-tor ko\'chasi', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.279873, 69.302751], address: 'Furqat mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.285323, 69.292660], address: 'Inoqobod mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.281786, 69.304829], address: 'Tong Yulduzi mahalla fuqarolar yigʻin', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.256476, 69.317635], address: 'Fayziobod mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.250043, 69.308355], address: '3-mavze', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.249016, 69.311233], address: '3-mavze', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.246721, 69.303479], address: 'Yangi Qoʻyliq mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.244815, 69.308768], address: 'Yangi Qoʻyliq mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.244502, 69.312997], address: 'Munis ko\'chasi', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.248785, 69.321692], address: 'Parvona 2-tor ko\'chasi', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.293411, 69.273042], address: 'Mirobod koʻchasi, 41/2', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.299940, 69.280623], address: 'Mingoʻrik mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.MIRABADSKY, coordinates: [41.297402, 69.293218], address: 'Elbek turar-joy majmuasi', fieldCount: 2 },

    // Бектемир район
    { district: District.BEKTEMIR, coordinates: [41.253461, 69.368379], address: 'Mirishkor mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.BEKTEMIR, coordinates: [41.257597, 69.376126], address: 'Mirishkor mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.BEKTEMIR, coordinates: [41.254267, 69.376809], address: 'Ohangaron koʻchasi', fieldCount: 1 },
    { district: District.BEKTEMIR, coordinates: [41.253358, 69.380539], address: 'Rohat mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.BEKTEMIR, coordinates: [41.253803, 69.378540], address: 'Suvsoz-4 mavzesi, 50A', fieldCount: 1 },
    { district: District.BEKTEMIR, coordinates: [41.253895, 69.371455], address: 'Mirishkor mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.BEKTEMIR, coordinates: [41.251813, 69.371905], address: 'Zilola mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.BEKTEMIR, coordinates: [41.241330, 69.366295], address: 'Abay mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.BEKTEMIR, coordinates: [41.240578, 69.371497], address: 'Ziyolilar dahasi', fieldCount: 2 },
    { district: District.BEKTEMIR, coordinates: [41.244952, 69.359555], address: 'Abay mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.BEKTEMIR, coordinates: [41.240675, 69.349568], address: 'Husayn Boyqaro mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.BEKTEMIR, coordinates: [41.233873, 69.321090], address: 'Nurafshon mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.BEKTEMIR, coordinates: [41.225852, 69.317483], address: 'Oltintopgan mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.BEKTEMIR, coordinates: [41.225976, 69.328800], address: 'Olim Oshirov dahasi', fieldCount: 1 },
    { district: District.BEKTEMIR, coordinates: [41.254406, 69.358923], address: 'Mirishkor mahalla fuqarolar yigʻini', fieldCount: 1 },

    // Яшнабад район
    { district: District.YASHNABAD, coordinates: [41.316924, 69.313843], address: 'Boyqoʻrgʻon mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.YASHNABAD, coordinates: [41.315676, 69.314334], address: 'Boyqoʻrgʻon mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.YASHNABAD, coordinates: [41.311108, 69.301149], address: 'Eski ToshMI', fieldCount: 1 },
    { district: District.YASHNABAD, coordinates: [41.311100, 69.311666], address: 'Boyqo\'rgo\'n ko\'chasi', fieldCount: 1 },
    { district: District.YASHNABAD, coordinates: [41.307256, 69.308783], address: 'Mashinasozlar mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.YASHNABAD, coordinates: [41.305939, 69.301637], address: 'Choʻlpon mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.YASHNABAD, coordinates: [41.302954, 69.305250], address: 'Choʻlpon mahalla fuqarolar yigʻini', fieldCount: 1 },
    { district: District.YASHNABAD, coordinates: [41.284032, 69.305939], address: 'Joʻrabek mahalla fuqarolar yigʻini', fieldCount: 2 },
    { district: District.YASHNABAD, coordinates: [41.279873, 69.308524], address: 'Joʻrabek mahalla fuqarolar yigʻini', fieldCount: 1 },
  ];

  getStadiums(): Stadium[] {
    return this.stadiums;
  }

  getStadiumsByDistrict(district: District): Stadium[] {
    return this.stadiums.filter(stadium => stadium.district === district);
  }

  getTotalFieldCount(): number {
    return this.stadiums.reduce((total, stadium) => total + stadium.fieldCount, 0);
  }

  getDistrictFieldCount(district: District): number {
    return this.getStadiumsByDistrict(district).reduce((total, stadium) => total + stadium.fieldCount, 0);
  }
}

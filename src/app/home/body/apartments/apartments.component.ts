import { Component, OnInit } from '@angular/core';
import { IApartment } from 'src/app/core/apartment/apartment.model';
// import { Apartment } from 'src/app/core/apartment/apartment.model';
import { ApartmentService } from 'src/app/core/apartment/apartment.service';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-apartments',
  templateUrl: './apartments.component.html',
  styleUrls: ['./apartments.component.css'],
})
export class ApartmentsComponent implements OnInit {
  apartmentList: IApartment[];
  kvLogo = 'assets/images/kv-crop-2.png';
  city24Logo = 'assets/images/c24-crop-5.png';
  dateToday = new Date();
  loaded = false;
  cityPartList = [
    'Kadriorg',
    'Vanalinn',
    'Haabersti',
    'Kesklinn',
    'Kristiine',
    'Lasnamäe',
    'Mustamäe',
    'Nõmme',
    'Pirita',
    'Põhja-Tallinn',
  ];
  selectedCityParts = [];
  form: FormGroup;
  apiString: string = '';
  sortString: string = '';
  dateSort: string = '';
  priceSort: string = '';
  page: number = 1;
  cityPartMap: Map<string, Element> = new Map();

  constructor(private apartmentService: ApartmentService, private formBuilder: FormBuilder) {}
  
  private getApartments() {
    this.loaded = false;
    this.apartmentService.getApartments(this.addToApiString(`page=${this.page}`)).then((res) => {
      this.apartmentList = res;
      this.removeUnnecessary(this.apartmentList);
      this.loaded = true;
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        priceMin: new FormControl('', [(c: AbstractControl) => this.validateMinMax(c, 'priceMin')]),
        priceMax: new FormControl('', [(c: AbstractControl) => this.validateMinMax(c, 'priceMax')]),
        roomsMin: new FormControl('', [(c: AbstractControl) => this.validateMinMax(c, 'roomsMin')]),
        roomsMax: new FormControl('', [(c: AbstractControl) => this.validateMinMax(c, 'roomsMax')]),
        m2Min: new FormControl('', [(c: AbstractControl) => this.validateMinMax(c, 'm2Min')]),
        m2Max: new FormControl('', [(c: AbstractControl) => this.validateMinMax(c, 'm2Max')]),
        m2PriceMin: new FormControl('', [
          (c: AbstractControl) => this.validateMinMax(c, 'm2PriceMin'),
        ]),
        m2PriceMax: new FormControl('', [
          (c: AbstractControl) => this.validateMinMax(c, 'm2PriceMax'),
        ]),
      },
      { updateOn: 'blur' }
    );
    this.getApartments();
  }

  // Move it to backend ??
  removeUnnecessary(apartmentList: IApartment[]) {
    apartmentList.forEach((e) => {
      if (e.title.includes('Anda üürile korter,')) {
        const firstDashIndex = e.title.indexOf('-');
        if (firstDashIndex > -1) {
          e.title = e.title.slice(firstDashIndex + 2);
        }
      }
    });
  }

  addToApiString(string: string) {
    this.apiString === '' ? (this.apiString += string) : (this.apiString += '&' + string);
    return this.apiString;
  }

  private addSortToApiString(apiSort: string) {
    if (this.includesSort()) {
      const sortStringStart = this.apiString.indexOf('sort');
      const sortStringEnd = this.apiString.substring(sortStringStart).indexOf('&') + 1;
      sortStringEnd > 0
        ? (this.apiString =
            this.apiString.slice(0, sortStringEnd) +
            ',' +
            apiSort +
            this.apiString.slice(sortStringEnd))
        : (this.apiString += ',' + apiSort);
    } else {
      this.addToApiString(`sort=${apiSort}`);
    }
  }

  includesSort(): boolean {
    return this.apiString.includes('sort') ? true : false;
  }

  buildApiString() {
    this.apiString = '';
    // example
    // price[lte]=500&price[gte]=375&limit=100&cityPart=Mustamäe,Lasnamäe,Nõmme&sort=cityPart
    for (const [key, control] of Object.entries(this.form.controls)) {
      if (control.value !== null && control.value !== '') {
        if (key.includes('Min')) {
          const minIndex = key.indexOf('Min');
          if (minIndex > -1) {
            let queryString = key.substring(0, minIndex);
            queryString += '[gte]=' + control.value;
            this.addToApiString(queryString);
          }
        } else if (key.includes('Max')) {
          const maxIndex = key.indexOf('Max');
          if (maxIndex > -1) {
            let queryString = key.substring(0, maxIndex);
            queryString += '[lte]=' + control.value;
            this.addToApiString(queryString);
          }
        }
      }
    }
    if (this.selectedCityParts.length != 0) {
      this.addToApiString('cityPart=' + this.selectedCityParts.toString());
    }

    if (this.priceSort !== '') {
      if (this.priceSort === '▲') {
        this.addSortToApiString('price');
      } else if (this.priceSort === '▼') {
        this.addSortToApiString('-price');
      }
    }
    /*
      do date sorting last.. apiString sort order matters
      sort=price,date .. will sort by price and then each equal price by date
      sort=date,price.. will sort by date and then each equal date by price
      because date precision is by milliseconds price sort wont affect anything
    */
    // '▲' | '▼'
    if (this.dateSort !== '') {
      if (this.dateSort === '▲') {
        this.addSortToApiString('date');
      } else if (this.dateSort === '▼') {
        this.addSortToApiString('-date');
      }
    }
    console.log(`Final string >> ${this.apiString}`);
  }

  onSearch() {
    this.page = 1;
    this.buildApiString();
    this.getApartments();
  }

  onSortDate() {
    // if not using UTF-8
    // &#9650; -- up
    // &#9660; -- down
    // const upSymbolCode = 9650;
    // const upSymbol = String.fromCharCode(upSymbolCode);
    // '▲' | '▼'
    // if (this.dateSort === '' || this.dateSort === '&#9650;') {
    //   this.dateSort = '&#9660;'
    // } else if (this.dateSort === '&#9660;') {
    //   this.dateSort = '&#9650;';
    // }

    if (this.dateSort === '' || this.dateSort === '▲') {
      this.dateSort = '▼';
    } else if (this.dateSort === '▼') {
      this.dateSort = '▲';
    }
  }

  onSortPrice() {
    if (this.priceSort === '' || this.priceSort === '▲') {
      this.priceSort = '▼';
    } else if (this.priceSort === '▼') {
      this.priceSort = '▲';
    }
  }

  onSelectCityPart(event: Event) {
    const element = event.target as Element;
    const textContent = element.textContent.trim();
    if (this.selectedCityParts.includes(textContent)) {
      const index = this.selectedCityParts.indexOf(textContent);
      if (index > -1) {
        this.selectedCityParts.splice(index, 1);
        // pointless if
        if (this.cityPartMap.has(textContent)) {
          this.cityPartMap.delete(textContent)
        }
      }
    } else {
      this.selectedCityParts.push(textContent);
      this.cityPartMap.set(textContent, element)
    }
    this.changeLiClass(element);
  }

  onRemoveSelectedCityPart(event: Event) {
    const key = (event.target as Element).textContent.trim();
    if (this.cityPartMap.has(key)) {
      this.changeLiClass(this.cityPartMap.get(key));
      this.cityPartMap.delete(key);
      if (this.selectedCityParts.includes(key)) {
        const index = this.selectedCityParts.indexOf(key);
        if (index > -1) {
          this.selectedCityParts.splice(index, 1);
        }
      }
    }
  }

  changeLiClass(element: Element) {
    element.className = element.className.includes('cityPart-not-selected')
      ? element.className.replace('cityPart-not-selected', 'cityPart-selected')
      : element.className.replace('cityPart-selected', 'cityPart-not-selected');
  }

  validateMinMax(control: AbstractControl, controlName: string) {
    // gets called multiple times.. cant change it.. change valdation method ??
    // could just use built in validators
    if (control.value !== '' && control.value !== null && typeof control.value === 'number') {
      const minInput = controlName.includes('Min') ? true : false;
      let antonymControl: AbstractControl;
      if (!minInput) {
        // control is max find min
        const maxIndex = controlName.indexOf('Max');
        if (maxIndex > -1) {
          const antonymName = controlName.slice(0, maxIndex) + 'Min';
          antonymControl = this._getAntonymControl(antonymName);
        }
        if (antonymControl.value !== '' && antonymControl.value !== null) {
          if (control.value < antonymControl.value) return { incorrect: true };
        }
      } else {
        // control is min find max
        const minIndex = controlName.indexOf('Min');
        if (minIndex > -1) {
          const antonymName = controlName.slice(0, minIndex) + 'Max';
          antonymControl = this._getAntonymControl(antonymName);
        }
        if (antonymControl.value !== '' && antonymControl.value !== null) {
          control.value > antonymControl.value
            ? antonymControl.setErrors({ incorrect: true })
            : antonymControl.setErrors({ incorrect: false });
        }
      }
    }
    return null;
  }

  _getAntonymControl(controlName: string): AbstractControl | null {
    for (const [key, control] of Object.entries(this.form.controls)) {
      if (key === controlName) return control;
    }
    return null;
  }

  goToSite(url: string) {
    window.open(url, '_blank');
  }

  goToPage(param: number) {
    // &#9664; === ◀
    // &#9654; === ▶
    if (!(param === -1 && this.page < 2)) {
      this.page += param;
      this.buildApiString();
      this.getApartments();
    }
  }

  // onChangeView() {
  //   console.log('going to change view in apartments');
  //   this.userDataService.setView('recover');
  // }

  // ngOnDestroy(): void {
  //   console.log('ApartmentsComponent got destroyed');
  // }

}
